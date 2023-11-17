import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { Bookmark } from "./entity/bookmark.entity";
import { bookmarkPaginateConfig } from "../config/pagination/bookmark-pagination";
import { message } from "../constants/message.constants";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { ObjectActivityTypeEnum } from "../enums/reputation.enum";
import { Collection } from "../collection/enity/collection.entity";

@Injectable()
export class BookmarkService {
  constructor(
    @Inject("BOOKMARK_REPOSITORY")
    private readonly bookmarkRepository: Repository<Bookmark>,
  ) {}

  /**
   * Find bookmark based on userId and paginate the results.
   * @param query
   * @param userId
   */
  async find(query: PaginateQuery, userId: string) {
    const queryBuilder = this.bookmarkRepository.createQueryBuilder("bookmark");
    queryBuilder.leftJoinAndSelect("bookmark.user", "user");
    queryBuilder.where({ user: { id: userId } });
    return paginate<Bookmark>(query, queryBuilder, bookmarkPaginateConfig);
  }

  /**
   * Create a new bookmark.
   * @param createBookmarkDto
   * @param userId
   */
  async create(createBookmarkDto: CreateBookmarkDto, userId: string) {
    const bookmarkTrans = {};

    bookmarkTrans["user"] = userId;

    if (createBookmarkDto.question_id) {
      bookmarkTrans["question"] = createBookmarkDto.question_id;
      bookmarkTrans["type"] = ObjectActivityTypeEnum.QUESTION;
    } else {
      bookmarkTrans["answer"] = createBookmarkDto.answer_id;
      bookmarkTrans["type"] = ObjectActivityTypeEnum.ANSWER;
    }
    const bookmark = this.bookmarkRepository.create(bookmarkTrans);

    return this.bookmarkRepository.save(bookmark);
  }

  /**
   * Update a bookmark.
   * @param id
   * @param collection_id
   * @param bookmark
   */
  async update(bookmark: Bookmark, collection_id: string) {
    bookmark.collection = { id: collection_id } as unknown as Collection;
    return this.bookmarkRepository.save(bookmark);
  }

  /**
   * Delete a bookmark.
   * @param bookmark
   */
  async remove(bookmark: Bookmark) {
    return this.bookmarkRepository.remove(bookmark);
  }

  async findOneById(id: string) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id: id },
      relations: ["user", "answer", "question"],
    });

    if (!bookmark) {
      throw new NotFoundException(message.NOT_FOUND.BOOKMARK);
    }
    return bookmark;
  }

  async findOne(id: string) {
    return await this.bookmarkRepository.findOne({
      where: { id: id },
    });
  }
}
