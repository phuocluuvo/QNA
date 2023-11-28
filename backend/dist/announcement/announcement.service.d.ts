import { Repository } from "typeorm";
import { Announcement } from "./entity/announcement.entity";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { PaginateQuery } from "nestjs-paginate";
import { FindAnnouncementDto } from "./dto/find-announcement.dto";
export declare class AnnouncementService {
    private readonly announcementRepository;
    constructor(announcementRepository: Repository<Announcement>);
    create(announcementDto: CreateAnnouncementDto): Promise<Announcement>;
    update(id: string, announcementDto: UpdateAnnouncementDto): Promise<Announcement>;
    delete(id: string): Promise<Announcement>;
    getAll(query: PaginateQuery, findAnnouncementDto: FindAnnouncementDto): Promise<import("nestjs-paginate").Paginated<Announcement>>;
    getAllForUser(query: PaginateQuery, findAnnouncementDto: FindAnnouncementDto): Promise<import("nestjs-paginate").Paginated<Announcement>>;
    getOne(id: string): Promise<Announcement>;
}
