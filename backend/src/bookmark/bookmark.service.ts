import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { Bookmark } from "./entity/bookmark.entity";
import { bookmarkPaginateConfig } from "../config/pagination/bookmark-pagination";
import { message } from "../constants/message.constants";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { ObjectActivityTypeEnum } from "../enums/reputation.enum";

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
   * Find bookmark based on userId and paginate the results.
   * @param query
   * @param userId
   * @param collectionId
   */
  async getBookmarkCollection(
    query: PaginateQuery,
    userId: string,
    collectionId: string,
  ) {
    const queryBuilder = this.bookmarkRepository.createQueryBuilder("bookmark");
    queryBuilder.leftJoinAndSelect("bookmark.user", "user");
    queryBuilder.leftJoinAndSelect("bookmark.collection", "collection");

    queryBuilder.where({ user: { id: userId } });
    queryBuilder.andWhere({ collection: { id: collectionId } });
    return paginate<Bookmark>(query, queryBuilder, bookmarkPaginateConfig);
  }

  /**
   * Find bookmark for later and paginate the results.
   * @param query
   * @param userId
   */
  async getBookmarkCollectionForLater(query: PaginateQuery, userId: string) {
    const queryBuilder = this.bookmarkRepository.createQueryBuilder("bookmark");
    queryBuilder.leftJoinAndSelect("bookmark.user", "user");
    queryBuilder.leftJoinAndSelect("bookmark.collection", "collection");

    queryBuilder.where({ user: { id: userId } });
    queryBuilder.andWhere("bookmark.collection.id IS NULL");
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
   * @param collection
   * @param bookmark
   */
  async update(bookmark: Bookmark, collection: any) {
    if (collection != null) {
      bookmark.collection = collection;
    } else {
      bookmark.collection = null;
    }

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

  async checkQuestionIsBookmark(questionId: string, userId: string) {
    return await this.bookmarkRepository.findOne({
      where: { question: { id: questionId }, user: { id: userId } },
    });
  }

  async checkAnswerIsBookmark(questionId: string, userId: string) {
    return await this.bookmarkRepository.findOne({
      where: { answer: { id: questionId }, user: { id: userId } },
    });
  }
}
