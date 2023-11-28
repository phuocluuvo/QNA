import { AnnouncementService } from "./announcement.service";
import { UpdateAnnouncementDto } from "./dto/update-announcement.dto";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { PaginateQuery } from "nestjs-paginate";
import { FindAnnouncementDto } from "./dto/find-announcement.dto";
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    createAnnouncement(req: Request, createAnnouncementDto: CreateAnnouncementDto): Promise<import("./entity/announcement.entity").Announcement>;
    updateAnnouncement(req: Request, updateAnnouncementDto: UpdateAnnouncementDto, id: string): Promise<import("./entity/announcement.entity").Announcement>;
    getAllAnnouncement(query: PaginateQuery, findAnnouncementDto: FindAnnouncementDto): Promise<import("nestjs-paginate").Paginated<import("./entity/announcement.entity").Announcement>>;
    getAllAnnouncementForUser(query: PaginateQuery, findAnnouncementDto: FindAnnouncementDto): Promise<import("nestjs-paginate").Paginated<import("./entity/announcement.entity").Announcement>>;
    getDetailAnnouncement(id: string): Promise<import("./entity/announcement.entity").Announcement>;
    deleteAnnouncement(req: Request, id: string): Promise<import("./entity/announcement.entity").Announcement>;
}
