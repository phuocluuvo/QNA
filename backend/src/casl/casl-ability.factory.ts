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
import { Answer } from "../answer/entity/answer.entity";
import { Comment } from "../comment/entity/comment.entity";
import { Bookmark } from "../bookmark/entity/bookmark.entity";
import { Collection } from "../collection/enity/collection.entity";

type Subjects =
  | InferSubjects<
      | typeof Question
      | typeof User
      | typeof Answer
      | typeof Comment
      | typeof Bookmark
      | typeof Collection
    >
  | "all";

export type AppAbility = Ability<[Action, Subjects]>;

type FlatQuestion = Question & {
  "user.id": Question["user"]["id"];
};

type FlatAnswer = Answer & {
  "user.id": Answer["user"]["id"];
};

type FlatComment = Comment & {
  "user.id": Comment["user"]["id"];
};

type FlatBookmark = Bookmark & {
  "user.id": Bookmark["user"]["id"];
};

type FlatCollection = Collection & {
  "user.id": Collection["user"]["id"];
};

@Injectable()
export class CaslAbilityFactory {
  createForUser(userReq) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (userReq.role == Role.ADMIN || userReq.role == Role.MONITOR) {
      can(Action.Manage, "all");
    } else {
      can(Action.Read, "all");
      can<FlatQuestion>([Action.Update, Action.Delete], Question, {
        "user.id": userReq["sub"],
      });
      can<FlatAnswer>([Action.Update, Action.Delete], Answer, {
        "user.id": userReq["sub"],
      });
      can<FlatComment>([Action.Update, Action.Delete], Comment, {
        "user.id": userReq["sub"],
      });
      can<FlatBookmark>([Action.Update, Action.Delete], Bookmark, {
        "user.id": userReq["sub"],
      });
      can<FlatCollection>([Action.Update, Action.Delete], Collection, {
        "user.id": userReq["sub"],
      });
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
