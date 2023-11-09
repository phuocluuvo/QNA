import { Inject, Injectable } from "@nestjs/common";
import { MoreThanOrEqual, Repository } from "typeorm";
import { Reputation } from "./entity/reputation.entity";
import {
  ActivityReputationTypeEnum,
  ObjectReputationTypeEnum,
} from "../enums/reputation.enum";
import { User } from "../users/entity/users.entity";
import { reputationActivityPoint } from "../constants/reputation.constants";
import { UsersService } from "../users/users.service";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class ReputationService {
  constructor(
    @Inject("REPUTATION_REPOSITORY")
    private readonly reputationRepository: Repository<Reputation>,
    private readonly usersService: UsersService,
  ) {}

  async findByUserId(id: string): Promise<Reputation[]> {
    return this.reputationRepository.find({ where: { user: { id } } });
  }

  @Transactional()
  async create(
    activityType: ActivityReputationTypeEnum,
    objectType: ObjectReputationTypeEnum,
    objectId: string,
    userId: string,
  ) {
    const newReputation = new Reputation();
    newReputation.activityType = activityType;
    newReputation.objectType = objectType;
    newReputation.objectId = objectId;
    newReputation.pointChange = reputationActivityPoint[activityType];
    newReputation.user = { id: userId } as unknown as User;

    await this.reputationRepository.save(newReputation);

    // Update reputation points
    await this.usersService.updateReputationPoint(
      userId,
      reputationActivityPoint[activityType],
    );
  }

  async checkCreateQuestion(userId: string): Promise<boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const requiredReputations = 3;
    const activityType = ActivityReputationTypeEnum.CREATE_ANSWER;

    const reputations = await this.reputationRepository.count({
      where: {
        user: { id: userId },
        createdAt: MoreThanOrEqual(todayStart),
      },
    });

    if (reputations >= requiredReputations) {
      const user = await this.usersService.findById(userId);
      const pointCheck =
        (reputations + 1) * reputationActivityPoint[activityType];

      return user.reputationPoint > pointCheck;
    }

    return true;
  }

  async syncPointDelete(objectId: string, userId: string) {
    const reputations = await this.reputationRepository.find({
      where: {
        user: { id: userId },
        objectId,
      },
    });
    const pointChange = reputations.reduce((a, b) => a + b.pointChange, 0);

    return this.usersService.updateReputationPoint(userId, -pointChange);
  }
}
