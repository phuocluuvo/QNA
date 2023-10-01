import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from "@casl/ability";
import { Question } from "../question/entity/question.entity";
import { User } from "../users/entity/users.entity";
import { Action } from "../enums/action.enum";
import { Injectable } from "@nestjs/common";
import { Role } from "../enums/role.enum";

type Subjects = InferSubjects<typeof Question | typeof User> | "all";

export type AppAbility = Ability<[Action, Subjects]>;

type FlatQuestion = Question & {
  "user.id": Question["user"]["id"];
};

@Injectable()
export class CaslAbilityFactory {
  createForUser(userReq) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (userReq.role == Role.ADMIN) {
      can(Action.Manage, "all");
    } else {
      can(Action.Read, "all");
      can<FlatQuestion>([Action.Update, Action.Delete], Question, {
        "user.id": userReq["sub"],
      });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
