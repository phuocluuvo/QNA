"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSysconfigDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_sysconfig_dto_1 = require("./create-sysconfig.dto");
class UpdateSysconfigDto extends (0, mapped_types_1.PartialType)(create_sysconfig_dto_1.CreateSysconfigDto) {
}
exports.UpdateSysconfigDto = UpdateSysconfigDto;
//# sourceMappingURL=update-sysconfig.dto.js.map