import { Ability, InferSubjects } from "@casl/ability";
import { Question } from "../question/entity/question.entity";
import { User } from "../users/entity/users.entity";
import { Action } from "../enums/action.enum";
import { Answer } from "../answer/entity/answer.entity";
import { Comment } from "../comment/entity/comment.entity";
import { Bookmark } from "../bookmark/entity/bookmark.entity";
import { Collection } from "../collection/enity/collection.entity";
type Subjects = InferSubjects<typeof Question | typeof User | typeof Answer | typeof Comment | typeof Bookmark | typeof Collection> | "all";
export type AppAbility = Ability<[Action, Subjects]>;
export declare class CaslAbilityFactory {
    createForUser(userReq: any): Ability<[Action, Subjects], import("@casl/ability").MongoQuery>;
}
export {};
