import { User } from "../../users/entity/users.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Question } from "../../question/entity/question.entity";
import { ObjectActivityTypeEnum } from "../../enums/reputation.enum";
import { Collection } from "../../collection/enity/collection.entity";
export declare class Bookmark {
    id: string;
    type: ObjectActivityTypeEnum;
    answer: Answer;
    question: Question;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    collection: Collection;
}
