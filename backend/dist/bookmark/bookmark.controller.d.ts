import { BookmarkService } from "./bookmark.service";
import { PaginateQuery } from "nestjs-paginate";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { QuestionService } from "../question/question.service";
import { AnswerService } from "../answer/answer.service";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { CollectionService } from "../collection/collection.service";
export declare class BookmarkController {
    private readonly bookmarkService;
    private readonly questionService;
    private readonly answerService;
    private readonly collectionService;
    private readonly caslAbilityFactory;
    constructor(bookmarkService: BookmarkService, questionService: QuestionService, answerService: AnswerService, collectionService: CollectionService, caslAbilityFactory: CaslAbilityFactory);
    find(query: PaginateQuery, req: Request): Promise<import("nestjs-paginate").Paginated<import("./entity/bookmark.entity").Bookmark>>;
    getBookmarkCollectionForLater(query: PaginateQuery, req: Request): Promise<import("nestjs-paginate").Paginated<import("./entity/bookmark.entity").Bookmark>>;
    getBookmarkCollection(query: PaginateQuery, req: Request, collectionId: string): Promise<import("nestjs-paginate").Paginated<import("./entity/bookmark.entity").Bookmark>>;
    create(createBookmarkDto: CreateBookmarkDto, req: Request): Promise<import("./entity/bookmark.entity").Bookmark>;
    update(collectionId: string, req: Request, id: string): Promise<import("./entity/bookmark.entity").Bookmark>;
    delete(id: string, req: Request): Promise<import("./entity/bookmark.entity").Bookmark>;
}
