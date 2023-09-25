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

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
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
        message: "Validation failed",
        data: errExits,
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
    return tokens;
  }

  async signIn(data: LoginUserDto) {
    // Check if user exists
    const user = await this.usersService.findOne(data.username);
    if (!user) throw new BadRequestException("User does not exist");
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException("Password is incorrect");
    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string, role: Role) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          //Change
          secret: jwtConstants.access,
          expiresIn: "15m",
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
          expiresIn: "7d",
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException("Access Denied");
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException("Access Denied");
    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
