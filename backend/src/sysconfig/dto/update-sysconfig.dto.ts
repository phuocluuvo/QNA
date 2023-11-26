import { PartialType } from "@nestjs/mapped-types";
import { CreateSysconfigDto } from "./create-sysconfig.dto";

export class UpdateSysconfigDto extends PartialType(CreateSysconfigDto) {}
