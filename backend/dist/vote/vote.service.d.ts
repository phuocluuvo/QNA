import { Repository } from "typeorm";
import { Vote } from "./entity/vote.entity";
import { VoteQuestionDto } from "./dto/vote-question.dto";
import { VoteAnswerDto } from "./dto/vote-answer.dto";
import { ActivityService } from "../activity/activity.service";
import { NotificationService } from "../notification/notification.service";
import { Question } from "../question/entity/question.entity";
import { Answer } from "../answer/entity/answer.entity";
export declare class VoteService {
    private readonly voteRepository;
    private readonly activityService;
    private readonly notificationService;
    constructor(voteRepository: Repository<Vote>, activityService: ActivityService, notificationService: NotificationService);
    voteQuestion(userId: string, voteDto: VoteQuestionDto, question: Question): Promise<number>;
    voteAnswer(userId: string, voteDto: VoteAnswerDto, answer: Answer): Promise<number>;
    private handleVote;
    getVote(query: any): Promise<Vote>;
    saveVote(vote: any): Promise<Vote>;
    private convertToVote;
    private getSateVote;
    private getReputationType;
    getVoteInfoByUser(userId: string): Promise<any>;
}
