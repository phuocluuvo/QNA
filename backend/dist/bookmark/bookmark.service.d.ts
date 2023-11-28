import { Repository } from "typeorm";
import { PaginateQuery } from "nestjs-paginate";
import { Bookmark } from "./entity/bookmark.entity";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
export declare class BookmarkService {
    private readonly bookmarkRepository;
    constructor(bookmarkRepository: Repository<Bookmark>);
    find(query: PaginateQuery, userId: string): Promise<import("nestjs-paginate").Paginated<Bookmark>>;
    getBookmarkCollection(query: PaginateQuery, userId: string, collectionId: string): Promise<import("nestjs-paginate").Paginated<Bookmark>>;
    getBookmarkCollectionForLater(query: PaginateQuery, userId: string): Promise<import("nestjs-paginate").Paginated<Bookmark>>;
    create(createBookmarkDto: CreateBookmarkDto, userId: string): Promise<Bookmark>;
    update(bookmark: Bookmark, collection: any): Promise<Bookmark>;
    remove(bookmark: Bookmark): Promise<Bookmark>;
    findOneById(id: string): Promise<Bookmark>;
    findOne(id: string): Promise<Bookmark>;
    checkQuestionIsBookmark(questionId: string, userId: string): Promise<Bookmark>;
    checkAnswerIsBookmark(questionId: string, userId: string): Promise<Bookmark>;
}
