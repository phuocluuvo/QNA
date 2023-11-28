import { Repository } from "typeorm";
import { History } from "./entity/history.entity";
import { Question } from "../question/entity/question.entity";
import { Answer } from "../answer/entity/answer.entity";
import { Comment } from "../comment/entity/comment.entity";
import { PaginateQuery } from "nestjs-paginate";
export declare class HistoryService {
    private readonly historyRepository;
    constructor(historyRepository: Repository<History>);
    getQuestionHistory(query: PaginateQuery, questionId: string): Promise<import("nestjs-paginate").Paginated<History>>;
    getAnswerHistory(query: PaginateQuery, answerId: string): Promise<import("nestjs-paginate").Paginated<History>>;
    getCommentHistory(query: PaginateQuery, commentId: string): Promise<import("nestjs-paginate").Paginated<History>>;
    createQuestionHistory(oldQuestion: Question, userModify: string): Promise<History>;
    createAnswerHistory(oldAnswer: Answer, userModify: string): Promise<History>;
    createCommentHistory(oldComment: Comment, userModify: string): Promise<History>;
}
