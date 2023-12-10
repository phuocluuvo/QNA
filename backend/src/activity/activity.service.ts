import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { MoreThanOrEqual, Repository } from "typeorm";
import { User } from "../users/entity/users.entity";
import { UsersService } from "../users/users.service";
import { Transactional } from "typeorm-transactional";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { activityPaginateConfig } from "../config/pagination/activity-pagination";
import { Activity } from "./entity/activity.entity";
import {
  ObjectActivityTypeEnum,
  ReputationActivityTypeEnum,
} from "../enums/reputation.enum";
import { reputationActivityPoint } from "../constants/reputation.constants";
import { Question } from "../question/entity/question.entity";
import { Answer } from "../answer/entity/answer.entity";
import { Comment } from "../comment/entity/comment.entity";
import { message } from "../constants/message.constants";
import { SysconfigService } from "../sysconfig/sysconfig.service";

@Injectable()
export class ActivityService {
  constructor(
    @Inject("ACTIVITY_REPOSITORY")
    private readonly activityRepository: Repository<Activity>,
    private readonly usersService: UsersService,
    private readonly sysconfigService: SysconfigService,
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
   * @param authorId - Author id (question, answer, comment)
   */
  @Transactional()
  async create(
    activityType: ReputationActivityTypeEnum,
    objectType: ObjectActivityTypeEnum,
    objectId: string,
    userId: string,
    authorId: string,
  ) {
    const repu = await this.transConfigToReputationConstant(activityType);

    const newActivity = new Activity();
    newActivity.activityType = activityType;
    newActivity.objectType = objectType;
    newActivity.objectId = objectId;
    newActivity.pointChange = repu;
    newActivity.user = { id: userId } as unknown as User;

    switch (objectType) {
      case ObjectActivityTypeEnum.QUESTION:
        newActivity.question = { id: objectId } as unknown as Question;
        break;
      case ObjectActivityTypeEnum.ANSWER:
        newActivity.answer = { id: objectId } as unknown as Answer;
        break;
      case ObjectActivityTypeEnum.COMMENT:
        newActivity.comment = { id: objectId } as unknown as Comment;
        break;
      case ObjectActivityTypeEnum.VOTE_QUESTION:
        newActivity.question = { id: objectId } as unknown as Question;
        break;
      case ObjectActivityTypeEnum.VOTE_ANSWER:
        newActivity.answer = { id: objectId } as unknown as Answer;
        break;
    }

    const activity = await this.activityRepository.save(newActivity);

    // Update activity points
    await this.usersService.updateActivityPoint(authorId, repu);
    return activity;
  }

  /**
   * Check create question
   * @param userId - The ID of the user who created the activity
   */
  async checkCreateQuestion(userId: string): Promise<boolean> {
    const sysconfigUsing = await this.sysconfigService.getUsingSysconfig();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let requiredActivity = 3;
    let questionPointCheck =
      reputationActivityPoint[ReputationActivityTypeEnum.CREATE_QUESTION];

    if (sysconfigUsing) {
      requiredActivity = sysconfigUsing.createQuestionDaily;
      questionPointCheck = sysconfigUsing.questionCreatePointCheck;
    }
    const activity = await this.activityRepository.count({
      where: {
        user: { id: userId },
        activityType: ReputationActivityTypeEnum.CREATE_QUESTION,
        createdAt: MoreThanOrEqual(todayStart),
      },
    });

    if (activity >= requiredActivity) {
      const user = await this.usersService.findById(userId);
      const pointCheck = Math.pow(activity + 1, 2) * questionPointCheck;

      return user.activityPoint >= pointCheck;
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

  async getPointChange(userId: string, date: string) {
    const user = await this.usersService.find({
      id: userId,
    });
    if (!user) {
      throw new BadRequestException(message.NOT_FOUND.USER);
    }

    const queryBuiler =
      await this.activityRepository.createQueryBuilder("activity");
    queryBuiler.select([
      "DATE(activity.createdAt) AS activity_date",
      "SUM(activity.pointChange) AS total_points",
    ]);
    queryBuiler.where({ user: { id: userId } });
    if (date != "all") {
      const datet = new Date(date);

      if (isNaN(datet.getTime())) {
        throw new BadRequestException();
      }

      queryBuiler.andWhere("activity.createdAt >= :date", { date });
    }
    queryBuiler.groupBy("activity_date");
    const result = await queryBuiler.getRawMany();
    let cur_point = user.activityPoint;
    for (let i = result.length - 1; i >= 0; i--) {
      result[i].total_points = cur_point - result[i].total_points;
      cur_point = result[i].total_points;
    }

    return result;
  }

  private async transConfigToReputationConstant(
    activityType: ReputationActivityTypeEnum,
  ): Promise<number> {
    const sysconfigUsing = await this.sysconfigService.getUsingSysconfig();
    if (sysconfigUsing) {
      const reputation = {
        [ReputationActivityTypeEnum.CREATE_QUESTION]:
          sysconfigUsing.createQuestion,
        [ReputationActivityTypeEnum.UPDATE_QUESTION]:
          sysconfigUsing.updateQuestion,
        [ReputationActivityTypeEnum.CREATE_ANSWER]: sysconfigUsing.createAnswer,
        [ReputationActivityTypeEnum.UPDATE_ANSWER]: sysconfigUsing.updateAnswer,
        [ReputationActivityTypeEnum.CREATE_COMMENT]:
          sysconfigUsing.createComment,
        [ReputationActivityTypeEnum.UPDATE_COMMENT]:
          sysconfigUsing.updateComment,
        [ReputationActivityTypeEnum.UPVOTE]: sysconfigUsing.upVote,
        [ReputationActivityTypeEnum.CANCLE_UPVOTE]: sysconfigUsing.cancleUpVote,
        [ReputationActivityTypeEnum.CHANGE_DOWNVOTE_TO_UPVOTE]:
          sysconfigUsing.changeDownVoteToUpVote,
        [ReputationActivityTypeEnum.ACCEPT_ANSWER]: sysconfigUsing.acceptAnswer,
        [ReputationActivityTypeEnum.DELETE_QUESTION]:
          sysconfigUsing.deleteQuestion,
        [ReputationActivityTypeEnum.DELETE_ANSWER]: sysconfigUsing.deleteAnswer,
        [ReputationActivityTypeEnum.DELETE_COMMENT]:
          sysconfigUsing.deleteComment,
        [ReputationActivityTypeEnum.DOWNVOTE]: sysconfigUsing.downVote,
        [ReputationActivityTypeEnum.CANCLE_DOWNVOTE]:
          sysconfigUsing.cancleDownVote,
        [ReputationActivityTypeEnum.CHANGE_UPVOTE_TO_DOWNVOTE]:
          sysconfigUsing.changeUpVoteToDownVote,
        [ReputationActivityTypeEnum.UN_ACCEPT_ANSWER]:
          sysconfigUsing.unAcceptAnswer,
        [ReputationActivityTypeEnum.BLOCK_QUESTION]:
          sysconfigUsing.blockQuestion,
        [ReputationActivityTypeEnum.VERIFY_QUESTION]:
          sysconfigUsing.verifyQuestion,
        [ReputationActivityTypeEnum.VERIFY_TAG]: sysconfigUsing.verifyTag,
        [ReputationActivityTypeEnum.UN_BLOCK_QUESTION]:
          sysconfigUsing.unBlockQuestion,
      };
      return reputation[activityType];
    } else {
      return reputationActivityPoint[activityType];
    }
  }

  async checkUndeleteQuestion(questionId: string): Promise<boolean> {
    const requiredActivity = 10;
    const activity = await this.countUnblockQuestion(questionId);
    return activity < requiredActivity;
  }

  async countUnblockQuestion(questionId: string): Promise<number> {
    const activityType = ReputationActivityTypeEnum.UN_BLOCK_QUESTION;

    return await this.activityRepository.count({
      where: {
        question: { id: questionId },
        activityType: activityType,
      },
    });
  }

  async countQuestionBalance(userId: string) {
    const sysconfigUsing = await this.sysconfigService.getUsingSysconfig();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let requiredActivity = 3;
    let questionPointCheck =
      reputationActivityPoint[ReputationActivityTypeEnum.CREATE_QUESTION];

    if (sysconfigUsing) {
      requiredActivity = sysconfigUsing.createQuestionDaily;
      questionPointCheck = sysconfigUsing.questionCreatePointCheck;
    }
    const activity = await this.activityRepository.count({
      where: {
        user: { id: userId },
        activityType: ReputationActivityTypeEnum.CREATE_QUESTION,
        createdAt: MoreThanOrEqual(todayStart),
      },
    });

    const user = await this.usersService.findById(userId);

    let balance = 0;
    let flag = true;
    let pointCheck = 0;
    const count = activity >= requiredActivity ? activity : requiredActivity;
    console.log("count::" + count);
    while (flag) {
      pointCheck = Math.pow(count + 1 + balance, 2) * questionPointCheck;
      console.log("poiuntcheck::" + pointCheck);
      console.log("userP::" + user.activityPoint);
      if (user.activityPoint >= pointCheck && balance < 100) {
        console.log("user::" + user.activityPoint);
        balance++;
      } else {
        flag = false;
      }
      user.activityPoint += questionPointCheck;
    }
    console.log(balance);
    return activity >= requiredActivity
      ? balance
      : balance + requiredActivity - activity;
  }
}
