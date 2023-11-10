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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    delete user.password;

    return { ...user, ...tokens };
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
    const accessTokenExpiresIn = 15 * 60; // 15 minutes in seconds
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

  private calculateExpiryDate(expiresInSeconds: number): Date {
    const currentTime: Date = new Date();
    return new Date(currentTime.getTime() + expiresInSeconds * 1000);
  }
}
