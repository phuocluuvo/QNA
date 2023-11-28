import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor() {
    super({
      clientID: "dc2d33ef9576cdc8219c",
      clientSecret: "9ff283d4fefb607ae8f6e59135d9b19556037656",
      callbackURL: `${process.env.URL_API}/api/auth/github/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    return profile;
  }
}
