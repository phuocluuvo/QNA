import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { History } from "./entity/history.entity";
import { Question } from "../question/entity/question.entity";
import { ObjectActivityTypeEnum } from "../enums/reputation.enum";
import { Answer } from "../answer/entity/answer.entity";
import { Comment } from "../comment/entity/comment.entity";
import { User } from "../users/entity/users.entity";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { historyPaginateConfig } from "../config/pagination/history-pagination";

@Injectable()
export class HistoryService {
  constructor(
    @Inject("HISTORY_REPOSITORY")
    private readonly historyRepository: Repository<History>,
  ) {}

  async getQuestionHistory(query: PaginateQuery, questionId: string) {
    const queryBuilder = this.historyRepository.createQueryBuilder("history");
    queryBuilder.where({ question: { id: questionId } });

    return paginate<History>(query, queryBuilder, historyPaginateConfig);
  }

  async getAnswerHistory(query: PaginateQuery, answerId: string) {
    const queryBuilder = this.historyRepository.createQueryBuilder("history");
    queryBuilder.where({ answer: { id: answerId } });

    return paginate<History>(query, queryBuilder, historyPaginateConfig);
  }

  async getCommentHistory(query: PaginateQuery, commentId: string) {
    const queryBuilder = this.historyRepository.createQueryBuilder("history");
    queryBuilder.where({ comment: { id: commentId } });

    return paginate<History>(query, queryBuilder, historyPaginateConfig);
  }

  async createQuestionHistory(
    oldQuestion: Question,
    userModify: string,
  ): Promise<History> {
    const newHistory = new History();
    newHistory.question = { id: oldQuestion.id } as unknown as Question;
    newHistory.type = ObjectActivityTypeEnum.QUESTION;
    newHistory.title = oldQuestion.title;
    newHistory.content = oldQuestion.content;
    newHistory.user = { id: userModify } as unknown as User;

    return this.historyRepository.save(newHistory);
  }

  async createAnswerHistory(
    oldAnswer: Answer,
    userModify: string,
  ): Promise<History> {
    const newHistory = new History();
    newHistory.answer = { id: oldAnswer.id } as unknown as Answer;
    newHistory.type = ObjectActivityTypeEnum.ANSWER;
    newHistory.content = oldAnswer.content;
    newHistory.user = { id: userModify } as unknown as User;

    return this.historyRepository.save(newHistory);
  }

  async createCommentHistory(
    oldComment: Comment,
    userModify: string,
  ): Promise<History> {
    const newHistory = new History();
    newHistory.comment = { id: oldComment.id } as unknown as Comment;
    newHistory.type = ObjectActivityTypeEnum.COMMENT;
    newHistory.content = oldComment.content;
    newHistory.user = { id: userModify } as unknown as User;

    return this.historyRepository.save(newHistory);
  }
}
