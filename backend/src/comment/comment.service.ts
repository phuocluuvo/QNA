import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Comment } from "./entity/comment.entity";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { plainToClass } from "class-transformer";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateAnswerDto } from "../answer/dto/update-answer.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { message } from "../constants/message.constants";
import { commentPaginateConfig } from "../config/pagination/comment-pagination";
import { Transactional } from "typeorm-transactional";
import { ActivityService } from "../activity/activity.service";
import {
  ObjectActivityTypeEnum,
  ReputationActivityTypeEnum,
} from "../enums/reputation.enum";
import {
  notificationText,
  notificationTextDesc,
} from "../constants/notification.constants";
import { NotificationService } from "../notification/notification.service";
import { HistoryService } from "../history/history.service";

@Injectable()
export class CommentService {
  constructor(
    @Inject("COMMENT_REPOSITORY")
    private readonly commentRepository: Repository<Comment>,
    private readonly activityService: ActivityService,
    private readonly notificationService: NotificationService,
    private readonly historyService: HistoryService,
  ) {}

  /**
   * Find comment based on answerId and paginate the results.
   *
   * @param answerId - The ID of the question to filter comment.
   * @param query
   * @returns Paginated list of comment.
   */
  async find(answerId: string, query: PaginateQuery) {
    const queryBuilder = this.commentRepository.createQueryBuilder("comment");
    queryBuilder.innerJoinAndSelect("comment.user", "user");
    queryBuilder.where(
      answerId ? { answer: { id: answerId } } : { id: "no_id" },
    );

    return paginate<Comment>(query, queryBuilder, commentPaginateConfig);
  }

  /**
   * Find an answer by its ID.
   *
   * @param id - The ID of the answer to retrieve.
   * @returns The comment with the specified ID.
   * @throws NotFoundException if the answer with the given ID does not exist.
   */
  async findOneById(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      relations: ["user", "answer"],
    });

    if (!comment) {
      throw new NotFoundException(message.NOT_FOUND.COMMENT);
    }
    return comment;
  }

  /**
   * Find an comment.
   *
   * @param option - The option of the answer to retrieve.
   * @returns The comment with the specified ID.
   * @throws NotFoundException if the answer with the given ID does not exist.
   */
  async findOne(option: any) {
    return await this.commentRepository.findOne({
      where: option,
      relations: ["user", "answer"],
    });
  }

  /**
   * Create a new comment.
   *
   * @param commentDto - The data to create a new comment.
   * @param userId - The ID of the user creating the comment.
   * @returns The created comment.
   */
  async create(commentDto: CreateCommentDto, userId: string) {
    const commentTrans = plainToClass(CreateCommentDto, commentDto, {
      excludeExtraneousValues: true,
    });
    commentTrans["user"] = userId;

    if (commentDto.answer_id) {
      commentTrans["answer"] = commentDto.answer_id;
    } else {
      commentTrans["question"] = commentDto.question_id;
    }
    if (commentDto.type) {
      commentTrans["type"] = commentDto.type;
    }

    return this.commentRepository.save(commentTrans);
  }

  /**
   * Update an existing comment.
   *
   * @param id - The ID of the answer to update.
   * @param commentDto - The updated data for the comment.
   * @returns The updated comment.
   */
  async update(id: string, commentDto: UpdateCommentDto) {
    const commentTrans = plainToClass(UpdateAnswerDto, commentDto, {
      excludeExtraneousValues: true,
    });
    const comment = await this.commentRepository.preload({
      id,
      ...commentTrans,
    });
    return this.commentRepository.save(comment);
  }

  /**
   * Remove a comment.
   *
   * @param comment - The comment entity to remove.
   * @returns The removed comment.
   */
  async remove(comment: Comment) {
    return this.commentRepository.remove(comment);
  }

  /**
   *  Create a new comment with activity.
   * @param commentDto - The data to create a new comment.
   * @param userId - The ID of the user creating the comment.
   */
  @Transactional()
  async createWithActivity(commentDto: CreateCommentDto, userId: string) {
    const comment = await this.create(commentDto, userId);
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.CREATE_COMMENT,
      ObjectActivityTypeEnum.COMMENT,
      comment.id,
      userId,
      userId,
    );
    await this.notificationService.create(
      notificationText.COMMENT.CREATE,
      notificationTextDesc.COMMENT.CREATE,
      userId,
      activity.id,
    );
    return comment;
  }

  /**
   * Update an existing comment with activity.
   * @param id - The ID of the answer to update.
   * @param commentDto - The updated data for the comment.
   * @param oldComment  - The old comment data.
   * @param userId - The ID of the user updating the comment.
   */
  async updateWithActivity(
    id: string,
    commentDto: UpdateCommentDto,
    oldComment: Comment,
    userId: string,
  ) {
    const comment = await this.update(id, commentDto);
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.UPDATE_COMMENT,
      ObjectActivityTypeEnum.COMMENT,
      comment.id,
      userId,
      oldComment.user.id,
    );

    await this.historyService.createCommentHistory(oldComment, userId);

    if (userId != oldComment.user.id) {
      await this.notificationService.create(
        notificationText.COMMENT.UPDATE,
        notificationTextDesc.COMMENT.UPDATE,
        oldComment.user.id,
        activity.id,
      );
    }
    return comment;
  }

  /**
   * Update an existing comment with activity.
   * @param comment - The comment entity to update.
   * @param userId - The ID of the user updating the comment.
   */
  @Transactional()
  async removeWithActivity(comment: Comment, userId: string) {
    const activity = await this.activityService.create(
      ReputationActivityTypeEnum.DELETE_COMMENT,
      ObjectActivityTypeEnum.COMMENT,
      comment.id,
      userId,
      comment.user.id,
    );
    await this.notificationService.create(
      notificationText.COMMENT.DELETE,
      notificationTextDesc.COMMENT.DELETE,
      comment.user.id,
      activity.id,
    );
    return this.remove(comment);
  }

  async getCommentHistory(query: PaginateQuery, commentId: string) {
    return this.historyService.getAnswerHistory(query, commentId);
  }
}
