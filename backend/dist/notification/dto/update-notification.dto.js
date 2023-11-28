"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotificationDto = void 0;
const create_user_dto_1 = require("../../users/dto/create-user.dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class UpdateNotificationDto extends (0, mapped_types_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
exports.UpdateNotificationDto = UpdateNotificationDto;
//# sourceMappingURL=update-notification.dto.js.map