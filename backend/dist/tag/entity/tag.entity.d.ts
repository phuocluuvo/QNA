import { Question } from "../../question/entity/question.entity";
import { TagState } from "../../enums/tag-state.enum";
import { User } from "../../users/entity/users.entity";
export declare class Tag {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    state: TagState;
    questionsNumber: number;
    user: User;
    questions: Question[];
}
