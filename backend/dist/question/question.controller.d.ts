import { Question } from "./entity/question.entity";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { Request } from "express";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { VoteQuestionDto } from "../vote/dto/vote-question.dto";
import { PaginateQuery } from "nestjs-paginate";
export declare class QuestionController {
    private readonly questionService;
    private readonly caslAbilityFactory;
    constructor(questionService: QuestionService, caslAbilityFactory: CaslAbilityFactory);
    find(query: PaginateQuery, tagNames: string, req: Request): Promise<import("nestjs-paginate").Paginated<Question>>;
    getRelated(query: PaginateQuery, tagNames: string): Promise<import("nestjs-paginate").Paginated<Question>>;
    findOneById(id: string, req: Request): Promise<Question>;
    findHistory(id: string, query: PaginateQuery): Promise<import("nestjs-paginate").Paginated<import("../history/entity/history.entity").History>>;
    create(questionDto: CreateQuestionDto, req: Request): Promise<Question>;
    update(id: string, questionDto: UpdateQuestionDto, req: Request): Promise<Question>;
    remove(id: string, req: Request): Promise<Question>;
    vote(questionVoteDto: VoteQuestionDto, req: Request): Promise<Question>;
    verify(req: Request, questionId: string): Promise<Question>;
    block(req: Request, questionId: string): Promise<Question>;
    undelete(req: Request, questionId: string): Promise<Question>;
    getCounUnBlock(questionId: string): Promise<number>;
    replaceTag(newTag: string, oldTag: string): Promise<import("../tag/entity/tag.entity").Tag>;
}
