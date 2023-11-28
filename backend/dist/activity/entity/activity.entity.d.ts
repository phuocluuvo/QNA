import { User } from "../../users/entity/users.entity";
import { Notification } from "../../notification/entity/notification.entity";
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Vote } from "../../vote/entity/vote.entity";
export declare class Activity {
    id: string;
    pointChange: number;
    activityType: string;
    objectType: string;
    objectId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    notifications: Notification[];
    question: Question;
    answer: Answer;
    comment: Comment;
    vote: Vote;
}
