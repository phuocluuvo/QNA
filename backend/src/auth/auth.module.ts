import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { jwtConstants } from "../constants/constants";
import { AuthController } from "./auth.controller";
import { RolesGuard } from "./guards/roles.guard";
import { AccessTokenStrategy } from "./strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "./strategies/refreshToken.strategy";
import { EmailModule } from "src/email/email.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.access,
      signOptions: { expiresIn: "23d" },
    }),
    forwardRef(() => UsersModule),
    EmailModule,
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
