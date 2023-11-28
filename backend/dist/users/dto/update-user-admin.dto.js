"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserAdminDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_admin_dto_1 = require("./create-user-admin.dto");
class UpdateUserAdminDto extends (0, mapped_types_1.PartialType)(create_user_admin_dto_1.CreateUserAdminDto) {
}
exports.UpdateUserAdminDto = UpdateUserAdminDto;
//# sourceMappingURL=update-user-admin.dto.js.map