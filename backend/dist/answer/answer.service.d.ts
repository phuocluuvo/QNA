import { Repository } from "typeorm";
import { Answer } from "./entity/answer.entity";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { PaginateQuery } from "nestjs-paginate";
import { VoteAnswerDto } from "../vote/dto/vote-answer.dto";
import { VoteService } from "../vote/vote.service";
import { ApproveAnswerDto } from "./dto/approve-answer.dto";
import { ActivityService } from "../activity/activity.service";
import { NotificationService } from "../notification/notification.service";
import { HistoryService } from "../history/history.service";
export declare class AnswerService {
    private readonly answerRepository;
    private readonly voteService;
    private readonly activityService;
    private readonly notificationService;
    private readonly historyService;
    constructor(answerRepository: Repository<Answer>, voteService: VoteService, activityService: ActivityService, notificationService: NotificationService, historyService: HistoryService);
    find(questionId: string, userId: string, query: PaginateQuery): Promise<import("nestjs-paginate").Paginated<Answer>>;
    findOneById(id: string): Promise<Answer>;
    findOne(option: any): Promise<Answer>;
    create(answerDto: CreateAnswerDto, userId: string): Promise<CreateAnswerDto & Answer>;
    update(id: string, answerDto: UpdateAnswerDto): Promise<Answer>;
    remove(answer: Answer): Promise<import("typeorm").UpdateResult>;
    updateVote(userId: string, answerVoteDto: VoteAnswerDto): Promise<Answer>;
    approveAnswer(approveAnswerDto: ApproveAnswerDto): Promise<Answer>;
    createWithActivity(answerDto: CreateAnswerDto, userId: string): Promise<CreateAnswerDto & Answer>;
    updateWithActivity(id: string, answerDto: UpdateAnswerDto, oldAnswer: Answer, userId: string): Promise<Answer>;
    removeWithActivity(answer: Answer, userId: string): Promise<Answer>;
    approveAnswerWithActivity(approveAnswerDto: ApproveAnswerDto, answer: Answer): Promise<Answer>;
    getAnswerHistory(query: PaginateQuery, answerId: string): Promise<import("nestjs-paginate").Paginated<import("../history/entity/history.entity").History>>;
}
