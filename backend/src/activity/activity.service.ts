import { Inject, Injectable } from "@nestjs/common";
import { MoreThanOrEqual, Repository } from "typeorm";
import { User } from "../users/entity/users.entity";
import { UsersService } from "../users/users.service";
import { Transactional } from "typeorm-transactional";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { activityPaginateConfig } from "../config/pagination/activity-pagination";
import { Activity } from "./entity/activity.entity";
import {
  ReputationActivityTypeEnum,
  ObjectActivityTypeEnum,
} from "../enums/reputation.enum";
import { reputationActivityPoint } from "../constants/reputation.constants";

@Injectable()
export class ActivityService {
  constructor(
    @Inject("ACTIVITY_REPOSITORY")
    private readonly activityRepository: Repository<Activity>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Find all activity
   * @param query
   * @param id
   */
  async findByUserId(query: PaginateQuery, id: string) {
    const queryBuilder = this.activityRepository.createQueryBuilder("activity");
    queryBuilder.where({ user: { id } });
    return paginate<Activity>(query, queryBuilder, activityPaginateConfig);
  }

  /**
   * Create activity
   * @param activityType - activity type
   * @param objectType - Object type (question, answer, comment)
   * @param objectId - object id (question id, answer id, comment id)
   * @param userId - The ID of the user who created the activity
   */
  @Transactional()
  async create(
    activityType: ReputationActivityTypeEnum,
    objectType: ObjectActivityTypeEnum,
    objectId: string,
    userId: string,
  ) {
    const newActivity = new Activity();
    newActivity.activityType = activityType;
    newActivity.objectType = objectType;
    newActivity.objectId = objectId;
    newActivity.pointChange = reputationActivityPoint[activityType];
    newActivity.user = { id: userId } as unknown as User;

    await this.activityRepository.save(newActivity);

    // Update activity points
    await this.usersService.updateActivityPoint(
      userId,
      reputationActivityPoint[activityType],
    );
  }

  /**
   * Check create question
   * @param userId - The ID of the user who created the activity
   */
  async checkCreateQuestion(userId: string): Promise<boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const requiredActivity = 3;
    const activityType = ReputationActivityTypeEnum.CREATE_ANSWER;

    const activity = await this.activityRepository.count({
      where: {
        user: { id: userId },
        createdAt: MoreThanOrEqual(todayStart),
      },
    });

    if (activity >= requiredActivity) {
      const user = await this.usersService.findById(userId);
      const pointCheck = (activity + 1) * reputationActivityPoint[activityType];

      return user.activityPoint > pointCheck;
    }

    return true;
  }

  /**
   * Update activity point for user when delete have votes
   * @param objectId - object id (question id, answer id, comment id)
   * @param userId - The ID of the user who created the activity
   */
  async syncPointDelete(objectId: string, userId: string) {
    const activity = await this.activityRepository.find({
      where: {
        user: { id: userId },
        objectId,
      },
    });
    const pointChange = activity.reduce((a, b) => a + b.pointChange, 0);

    return this.usersService.updateActivityPoint(userId, -pointChange);
  }
}
