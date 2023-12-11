import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { PaginateQuery } from "nestjs-paginate";
import { Activity } from "./entity/activity.entity";
import { ObjectActivityTypeEnum, ReputationActivityTypeEnum } from "../enums/reputation.enum";
import { SysconfigService } from "../sysconfig/sysconfig.service";
export declare class ActivityService {
    private readonly activityRepository;
    private readonly usersService;
    private readonly sysconfigService;
    constructor(activityRepository: Repository<Activity>, usersService: UsersService, sysconfigService: SysconfigService);
    findByUserId(query: PaginateQuery, id: string): Promise<import("nestjs-paginate").Paginated<Activity>>;
    create(activityType: ReputationActivityTypeEnum, objectType: ObjectActivityTypeEnum, objectId: string, userId: string, authorId: string): Promise<Activity>;
    checkCreateQuestion(userId: string): Promise<boolean>;
    syncPointDelete(objectId: string, userId: string): Promise<import("typeorm").UpdateResult>;
    getPointChange(userId: string, date: string): Promise<any[]>;
    private transConfigToReputationConstant;
    checkUndeleteQuestion(questionId: string): Promise<boolean>;
    countUnblockQuestion(questionId: string): Promise<number>;
    countQuestionBalance(userId: string): Promise<{
        balance: number;
        pointCheckNextQuestion: number;
    }>;
}
