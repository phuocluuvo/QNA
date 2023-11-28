import { TagService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { PaginateQuery } from "nestjs-paginate";
import { UpdateTagDto } from "./dto/update-tag.dto";
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    find(query: PaginateQuery, req: Request): Promise<import("nestjs-paginate").Paginated<import("./entity/tag.entity").Tag>>;
    topTagUserByUser(userId: string): Promise<import("./entity/tag.entity").Tag[]>;
    findOneById(name: string): Promise<import("./entity/tag.entity").Tag>;
    create(req: Request, tagDto: CreateTagDto): Promise<CreateTagDto & import("./entity/tag.entity").Tag>;
    update(id: string, tagDto: UpdateTagDto): Promise<import("./entity/tag.entity").Tag>;
    remove(id: string): Promise<import("./entity/tag.entity").Tag>;
    verify(req: Request, tagId: string): Promise<import("./entity/tag.entity").Tag>;
}
