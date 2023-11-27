import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor() {
    super({
      clientID: "600881c5b204132ea4c2",
      clientSecret: "8c0bc5b45c2fb5f098af89ab566a5225d48b3ba0",
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
