import { ActivityService } from "./activity.service";
import { PaginateQuery } from "nestjs-paginate";
import { Activity } from "./entity/activity.entity";
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    getActivityHistory(query: PaginateQuery, req: any): Promise<import("nestjs-paginate").Paginated<Activity>>;
    getActivityHistoryByUser(query: PaginateQuery, id: string): Promise<import("nestjs-paginate").Paginated<Activity>>;
    getActivityPointChange(id: string, date: string): Promise<any[]>;
}
