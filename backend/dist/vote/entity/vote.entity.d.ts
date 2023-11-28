import { User } from "../../users/entity/users.entity";
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { VoteType } from "../../enums/vote-type.enum";
import { Activity } from "../../activity/entity/activity.entity";
export declare class Vote {
    id: string;
    voteType: VoteType;
    user: User;
    question: Question;
    answer: Answer;
    createdAt: Date;
    updatedAt: Date;
    activity: Activity[];
}
