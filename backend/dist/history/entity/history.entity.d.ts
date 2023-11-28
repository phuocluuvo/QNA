import { User } from "../../users/entity/users.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Question } from "../../question/entity/question.entity";
import { ObjectActivityTypeEnum } from "../../enums/reputation.enum";
import { Comment } from "../../comment/entity/comment.entity";
export declare class History {
    id: string;
    type: ObjectActivityTypeEnum;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    answer: Answer;
    question: Question;
    comment: Comment;
    user: User;
}
