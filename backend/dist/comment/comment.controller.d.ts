import { AnswerService } from "../answer/answer.service";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { PaginateQuery } from "nestjs-paginate";
import { QuestionService } from "../question/question.service";
export declare class CommentController {
    private readonly commentService;
    private readonly caslAbilityFactory;
    private readonly answerService;
    private readonly questionService;
    constructor(commentService: CommentService, caslAbilityFactory: CaslAbilityFactory, answerService: AnswerService, questionService: QuestionService);
    find(answerId: string, query: PaginateQuery): Promise<import("nestjs-paginate").Paginated<import("./entity/comment.entity").Comment>>;
    findOneById(id: string): Promise<import("./entity/comment.entity").Comment>;
    findHistory(id: string, query: PaginateQuery): Promise<import("nestjs-paginate").Paginated<import("../history/entity/history.entity").History>>;
    create(answerDto: CreateCommentDto, req: Request): Promise<CreateCommentDto & import("./entity/comment.entity").Comment>;
    update(id: string, commentDto: UpdateCommentDto, req: Request): Promise<import("./entity/comment.entity").Comment>;
    remove(id: string, req: Request): Promise<import("./entity/comment.entity").Comment>;
}
