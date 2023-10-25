import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Comment } from "./entity/comment.entity";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { CreateAnswerDto } from "../answer/dto/create-answer.dto";
import { plainToClass } from "class-transformer";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateAnswerDto } from "../answer/dto/update-answer.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @Inject("COMMENT_REPOSITORY")
    private commentRepository: Repository<Comment>,
  ) {}

  /**
   * Find comment based on answerId and paginate the results.
   *
   * @param answerId - The ID of the question to filter comment.
   * @param options - Pagination options.
   * @returns Paginated list of comment.
   */
  async find(
    answerId: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Comment>> {
    const queryBuilder = this.commentRepository.createQueryBuilder("comment");
    queryBuilder.innerJoinAndSelect("comment.user", "user");
    queryBuilder.where(
      answerId ? { answer: { id: answerId } } : { id: "no_id" },
    );
    queryBuilder.orderBy("comment.createdAt", "ASC");

    return paginate<Comment>(queryBuilder, options);
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
      throw new NotFoundException(`There is no comment under id ${id}`);
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
    const commentTrans = plainToClass(CreateAnswerDto, commentDto, {
      excludeExtraneousValues: true,
    });
    commentTrans["user"] = userId;
    commentTrans["answer"] = commentDto.answer_id;
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
   * Remove an comment.
   *
   * @param comment - The comment entity to remove.
   * @returns The removed comment.
   */
  async remove(comment: Comment) {
    return this.commentRepository.remove(comment);
  }
}
