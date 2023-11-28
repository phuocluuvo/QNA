import { User } from "../../users/entity/users.entity";
import { Question } from "../../question/entity/question.entity";
import { Vote } from "../../vote/entity/vote.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Activity } from "../../activity/entity/activity.entity";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { History } from "../../history/entity/history.entity";
export declare class Answer {
    id: string;
    content: string;
    votes: number;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
    question: Question;
    user: User;
    vote: Vote[];
    comments: Comment[];
    activity: Activity[];
    bookmarks: Bookmark[];
    histories: History[];
    commentsNumber: number;
}
