import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { AnswerService } from "./answer.service";
import { Answer } from "./entity/answer.entity";
import { Request } from "express";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { QuestionService } from "../question/question.service";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { VoteAnswerDto } from "../vote/dto/vote-answer.dto";
import { ApproveAnswerDto } from "./dto/approve-answer.dto";
import { PaginateQuery } from "nestjs-paginate";
export declare class AnswerController {
    private readonly answerService;
    private readonly caslAbilityFactory;
    private readonly questionService;
    constructor(answerService: AnswerService, caslAbilityFactory: CaslAbilityFactory, questionService: QuestionService);
    find(questionId: string, req: Request, query: PaginateQuery): Promise<import("nestjs-paginate").Paginated<Answer>>;
    findOneById(id: string): Promise<Answer>;
    findHistory(id: string, query: PaginateQuery): Promise<import("nestjs-paginate").Paginated<import("../history/entity/history.entity").History>>;
    create(answerDto: CreateAnswerDto, req: Request): Promise<CreateAnswerDto & Answer>;
    update(id: string, answerDto: UpdateAnswerDto, req: Request): Promise<Answer>;
    remove(id: string, req: Request): Promise<Answer>;
    vote(answerVoteDto: VoteAnswerDto, req: Request): Promise<Answer>;
    approve(approveAnswerDto: ApproveAnswerDto, req: Request): Promise<Answer>;
}
