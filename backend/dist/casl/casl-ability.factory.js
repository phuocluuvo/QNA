"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaslAbilityFactory = void 0;
const ability_1 = require("@casl/ability");
const question_entity_1 = require("../question/entity/question.entity");
const action_enum_1 = require("../enums/action.enum");
const common_1 = require("@nestjs/common");
const role_enum_1 = require("../enums/role.enum");
const answer_entity_1 = require("../answer/entity/answer.entity");
const comment_entity_1 = require("../comment/entity/comment.entity");
const bookmark_entity_1 = require("../bookmark/entity/bookmark.entity");
const collection_entity_1 = require("../collection/enity/collection.entity");
let CaslAbilityFactory = class CaslAbilityFactory {
    createForUser(userReq) {
        const { can, build } = new ability_1.AbilityBuilder(ability_1.Ability);
        if (userReq.role == role_enum_1.Role.ADMIN || userReq.role == role_enum_1.Role.MONITOR) {
            can(action_enum_1.Action.Manage, "all");
        }
        else {
            can(action_enum_1.Action.Read, "all");
            can([action_enum_1.Action.Update, action_enum_1.Action.Delete], question_entity_1.Question, {
                "user.id": userReq["sub"],
            });
            can([action_enum_1.Action.Update, action_enum_1.Action.Delete], answer_entity_1.Answer, {
                "user.id": userReq["sub"],
            });
            can([action_enum_1.Action.Update, action_enum_1.Action.Delete], comment_entity_1.Comment, {
                "user.id": userReq["sub"],
            });
            can([action_enum_1.Action.Update, action_enum_1.Action.Delete], bookmark_entity_1.Bookmark, {
                "user.id": userReq["sub"],
            });
            can([action_enum_1.Action.Update, action_enum_1.Action.Delete], collection_entity_1.Collection, {
                "user.id": userReq["sub"],
            });
        }
        return build({
            detectSubjectType: (item) => item.constructor,
        });
    }
};
exports.CaslAbilityFactory = CaslAbilityFactory;
exports.CaslAbilityFactory = CaslAbilityFactory = __decorate([
    (0, common_1.Injectable)()
], CaslAbilityFactory);
//# sourceMappingURL=casl-ability.factory.js.map