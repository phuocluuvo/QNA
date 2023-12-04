import { User } from "../../users/entity/users.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Activity } from "../../activity/entity/activity.entity";
import { Question } from "../../question/entity/question.entity";
import { History } from "../../history/entity/history.entity";
import { CommentTypeEnum } from "../../enums/comment-type.enum";
export declare class Comment {
    id: string;
    content: string;
    type: CommentTypeEnum;
    answer: Answer;
    question: Question;
    user: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    activity: Activity[];
    histories: History[];
}
