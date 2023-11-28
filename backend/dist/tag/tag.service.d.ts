import { Repository } from "typeorm";
import { Tag } from "./entity/tag.entity";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { PaginateQuery } from "nestjs-paginate";
import { TagState } from "../enums/tag-state.enum";
import { ActivityService } from "../activity/activity.service";
import { NotificationService } from "../notification/notification.service";
export declare class TagService {
    private readonly tagRepository;
    private readonly activityService;
    private readonly notificationService;
    constructor(tagRepository: Repository<Tag>, activityService: ActivityService, notificationService: NotificationService);
    find(query: PaginateQuery, user: any): Promise<import("nestjs-paginate").Paginated<Tag>>;
    findOneByName(name: string): Promise<Tag>;
    findOne(option: any): Promise<Tag>;
    create(tagDto: CreateTagDto, userId: string): Promise<CreateTagDto & Tag>;
    update(id: string, tagDto: UpdateTagDto): Promise<Tag>;
    remove(tag: Tag): Promise<Tag>;
    checkAndTransTags(tag_ids: string[]): Promise<Tag[]>;
    censoring(tagId: string, userId: string, state: TagState): Promise<Tag>;
    getTop5HasMostQuestion(): Promise<any[]>;
    topTagUserByUser(userId: string): Promise<Tag[]>;
}
