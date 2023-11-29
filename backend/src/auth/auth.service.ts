import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import * as argon2 from "argon2";
import { jwtConstants } from "../constants/constants";
import { Role } from "../enums/role.enum";
import { User } from "../users/entity/users.entity";
import { message } from "../constants/message.constants";
import { UserState } from "../enums/user-state.enum";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "src/email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Sign up a new user.
   *
   * @param createUserDto Data for creating a new user.
   * @returns Promise<any> Tokens for the new user.
   * @throws BadRequestException if the username or email already exists.
   * @throws Error if there's an error during the sign-up process.
   */
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user, email exists
    const errExits = {};

    const userExists = await this.usersService.findOne(createUserDto.username);
    if (userExists) {
      errExits["username"] = "User already exists";
    }

    const emailExists = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (emailExists) {
      errExits["email"] = "Email already exists";
    }

    if (emailExists || userExists) {
      throw new BadRequestException({
        statusCode: 400,
        error: "Bad Request",
        message: errExits,
      });
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser: User = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(
      newUser.id,
      newUser.username,
      newUser.role,
    );
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    delete newUser.password;
    return { ...newUser, ...tokens };
  }

  /**
   * Sign in a user.
   *
   * @param data Login credentials.
   * @returns Promise<any> Tokens for the signed-in user.
   * @throws BadRequestException if the user doesn't exist or the password is incorrect.
   */
  async signIn(data: LoginUserDto) {
    // Check if user exists
    const user = await this.usersService.findOne(data.username);

    if (!user) throw new BadRequestException(message.NOT_EXITS_USER);
    const passwordMatches = await argon2.verify(user.password, data.password);

    if (!passwordMatches)
      throw new BadRequestException(message.PASSWORD_IS_INCORRECT);

    const isBlock = user.state === UserState.BLOCKED;

    if (isBlock) throw new BadRequestException(message.USER_IS_BLOCK);

    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    delete user.password;

    return { ...user, ...tokens };
  }

  /**
   * Sign in a user with Google.
   * If the user doesn't exist, create a new user.
   * If the user exists, update the refresh token.
   * @param email Email of the user.
   * @returns Promise<any> Tokens for the signed-in user.
   */

  async signInWithGoogle(user: any) {
    // Check if user exists
    let existUser = await this.usersService.findOneByEmail(user.email);
    if (!existUser) {
      existUser = await this.createNew(user);
    }

    if (!existUser.avatar) {
      await this.usersService.update(existUser.id, { avatar: user.picture });
    }

    if (!existUser) throw new BadRequestException(message.NOT_EXITS_USER);

    const isBlock = existUser.state === UserState.BLOCKED;

    if (isBlock) throw new BadRequestException(message.USER_IS_BLOCK);

    const tokens = await this.getTokens(
      existUser.id,
      existUser.username,
      existUser.role,
    );
    const refreshToken = await this.updateRefreshToken(
      existUser.id,
      tokens.refreshToken,
    );
    delete existUser.password;

    return { ...existUser, ...tokens, refreshToken };
  }

  async signInWithGithub(user: any) {
    // Check if user exists
    let existUser = await this.usersService.findOneByGithub(user.profileUrl);
    if (!existUser) {
      existUser = await this.createNewForGithub(user);
    }

    if (!existUser.avatar && user.photos?.length) {
      await this.usersService.update(existUser.id, {
        avatar: user.photos[0].value,
      });
    }

    if (!existUser) throw new BadRequestException(message.NOT_EXITS_USER);

    const isBlock = existUser.state === UserState.BLOCKED;

    if (isBlock) throw new BadRequestException(message.USER_IS_BLOCK);

    const tokens = await this.getTokens(
      existUser.id,
      existUser.username,
      existUser.role,
    );
    const refreshToken = await this.updateRefreshToken(
      existUser.id,
      tokens.refreshToken,
    );
    delete existUser.password;

    return { ...existUser, ...tokens, refreshToken };
  }

  /**
   * Logout a user by updating the refresh token.
   *
   * @param userId ID of the user to log out.
   * @returns Promise<void>
   */
  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  /**
   * Hash the provided data.
   *
   * @param data Data to be hashed.
   * @returns Promise<string> The hashed data.
   */
  hashData(data: string) {
    return argon2.hash(data);
  }

  /**
   * Update the refresh token for a user.
   *
   * @param userId ID of the user.
   * @param refreshToken New refresh token.
   * @returns Promise<void>
   * @throws NotFoundException if the user with the given ID is not found.
   * @throws Error if there's an error during the update process.
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
    return hashedRefreshToken;
  }

  /**
   * Generate access and refresh tokens for a user.
   *
   * @param userId ID of the user.
   * @param username Username of the user.
   * @param role Role of the user.
   * @returns Promise<accessToken: string; refreshToken: string > The tokens.
   */
  async getTokens(userId: string, username: string, role: Role) {
    const accessTokenExpiresIn = 60 * 60;
    const refreshTokenExpiresIn = 7 * 24 * 60 * 60; //
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: jwtConstants.access,
          expiresIn: accessTokenExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          //Change
          secret: jwtConstants.refesh,
          expiresIn: refreshTokenExpiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      expires_in: this.calculateExpiryDate(accessTokenExpiresIn),
      refreshToken,
    };
  }

  /**
   * Refresh tokens for a user.
   *
   * @param userId ID of the user.
   * @param refreshToken Refresh token.
   * @returns Promise< accessToken: string; refreshToken: string > The refreshed tokens.
   * @throws ForbiddenException if the user or the refresh token is invalid.
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    const isBlock = user.state === UserState.BLOCKED;
    if (isBlock) throw new BadRequestException(message.USER_IS_BLOCK);

    if (!user || !user.refreshToken)
      throw new ForbiddenException(message.ACCESS_DENIED);
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches)
      throw new ForbiddenException(message.ACCESS_DENIED);

    const tokens = await this.getTokens(user.id, user.username, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  /**
   * Refresh tokens for a user.
   *
   * @param userId ID of the user.
   * @param refreshToken Refresh token.
   * @returns Promise< accessToken: string; refreshToken: string > The refreshed tokens.
   * @throws ForbiddenException if the user or the refresh token is invalid.
   */
  async refreshTokensV2(refreshToken: string) {
    const user = await this.usersService.findOneByRefreshToken(refreshToken);

    if (!user) throw new BadRequestException(message.NOT_EXITS_USER);
    const isBlock = user.state === UserState.BLOCKED;
    if (isBlock) throw new BadRequestException(message.USER_IS_BLOCK);

    const tokens = await this.getTokens(user.id, user.username, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { ...user, ...tokens };
  }

  private calculateExpiryDate(expiresInSeconds: number): Date {
    const currentTime: Date = new Date();
    return new Date(currentTime.getTime() + expiresInSeconds * 1000);
  }

  async createNew(user: any): Promise<any> {
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();

    const createUserDto = new CreateUserDto();
    createUserDto.username =
      user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + randomDigits;
    createUserDto.fullname = user.firstName + " " + user.lastName;
    createUserDto.email = user.email;
    createUserDto.avatar = user.picture;
    createUserDto.password = await this.hashData(user.email);
    createUserDto.refreshToken = user.token;
    return this.usersService.create(createUserDto);
  }

  async createNewForGithub(user: any): Promise<any> {
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();

    const createUserDto = new CreateUserDto();
    createUserDto.username = user.username + randomDigits;
    createUserDto.fullname = user.displayName;
    createUserDto.email = user.email || null;
    createUserDto.password = await this.hashData(user.username);
    createUserDto.refreshToken = null;
    createUserDto.githubLink = user.profileUrl;
    return this.usersService.create(createUserDto);
  }

  /**
   * forgot password
   *
   */
  async forgotPassword(username: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new BadRequestException(message.NOT_EXITS_USER);
    if (user.uuid && user.uuid_created_at) {
      const expirationTime = new Date(
        user.uuid_created_at.getTime() + 5 * 60 * 1000,
      );
      const currentTime = new Date();
      if (expirationTime > currentTime) {
        throw new BadRequestException(
          message.PLEASE_ALLOW_AT_LEAST_5_MINUTES_BEFORE_MAKING_ANOTHER_REQUEST,
        );
      } else {
        return this.updateUuid(user);
      }
    } else {
      return this.updateUuid(user);
    }
  }

  async updateUuid(user: any): Promise<any> {
    user.uuid = uuidv4();
    user.uuid_created_at = new Date();
    await this.usersService.update(user.id, user);
    return this.emailService.sendEmailResetPassword(
      user.email,
      `${process.env.URL_WEB}/auth/signin?uuid=${user.uuid}`,
    );
  }

  async resetPassword(uuid: string, newPassword: string): Promise<any> {
    const user = await this.usersService.findOneByUuid(uuid);
    if (!user) throw new BadRequestException(message.NOT_EXITS_USER);
    const currentTime = new Date();
    const expirationTime = new Date(
      user.uuid_created_at.getTime() + 5 * 60 * 1000,
    );
    if (expirationTime < currentTime) {
      throw new BadRequestException(message.THE_LINK_HAS_EXPIRED);
    }
    const hash = await this.hashData(newPassword);
    user.uuid = null;
    user.uuid_created_at = null;
    user.password = hash;
    return this.usersService.update(user.id, user);
  }

  async checkUserExists(username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new BadRequestException(message.NOT_EXITS_USER);
    delete user.password;
    return user;
  }

  /**
   * Confirm password
   * @param user
   * @param passwordConfirm
   * @returns
   * @throws BadRequestException
   */

  async confirmPassword(userId: string, password: string) {
    if (!password) throw new BadRequestException(message.PASSWORD_IS_EMPTY);
    const user = await this.usersService.getOneById(userId);
    const passwordMatches = await argon2.verify(user.password, password);
    if (!passwordMatches)
      throw new BadRequestException(message.PASSWORD_IS_INCORRECT);
    return {
      status: "success",
    };
  }
}
