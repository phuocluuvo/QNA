import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Notification } from "./entity/notification.entity";

@Injectable()
export class NotificationService {
  constructor(
    @Inject("NOTIFICATION_REPOSITORY")
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findByUserId(userId: string) {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
    });
  }
}
