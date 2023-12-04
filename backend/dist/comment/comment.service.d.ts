import { Repository } from "typeorm";
import { Comment } from "./entity/comment.entity";
import { PaginateQuery } from "nestjs-paginate";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { ActivityService } from "../activity/activity.service";
import { NotificationService } from "../notification/notification.service";
import { HistoryService } from "../history/history.service";
export declare class CommentService {
    private readonly commentRepository;
    private readonly activityService;
    private readonly notificationService;
    private readonly historyService;
    constructor(commentRepository: Repository<Comment>, activityService: ActivityService, notificationService: NotificationService, historyService: HistoryService);
    find(answerId: string, query: PaginateQuery): Promise<import("nestjs-paginate").Paginated<Comment>>;
    findOneById(id: string): Promise<Comment>;
    findOne(option: any): Promise<Comment>;
    create(commentDto: CreateCommentDto, userId: string): Promise<CreateCommentDto & Comment>;
    update(id: string, commentDto: UpdateCommentDto): Promise<Comment>;
    remove(comment: Comment): Promise<import("typeorm").UpdateResult>;
    createWithActivity(commentDto: CreateCommentDto, userId: string): Promise<CreateCommentDto & Comment>;
    updateWithActivity(id: string, commentDto: UpdateCommentDto, oldComment: Comment, userId: string): Promise<Comment>;
    removeWithActivity(comment: Comment, userId: string): Promise<Comment>;
    getCommentHistory(query: PaginateQuery, commentId: string): Promise<import("nestjs-paginate").Paginated<import("../history/entity/history.entity").History>>;
}
