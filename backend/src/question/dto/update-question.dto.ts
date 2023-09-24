import { CreateQuestionDto } from "./create-question.dto";
import { PartialType } from "@nestjs/mapped-types";
export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
