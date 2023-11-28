import { CommentTypeEnum } from "../../enums/comment-type.enum";
export declare class CreateCommentDto {
    answer_id: string;
    question_id: string;
    content: string;
    type: CommentTypeEnum;
}
