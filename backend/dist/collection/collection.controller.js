"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const collection_service_1 = require("./collection.service");
const accessToken_guard_1 = require("../auth/guards/accessToken.guard");
const casl_ability_factory_1 = require("../casl/casl-ability.factory");
const action_enum_1 = require("../enums/action.enum");
const message_constants_1 = require("../constants/message.constants");
let CollectionController = class CollectionController {
    constructor(collectionService, caslAbilityFactory) {
        this.collectionService = collectionService;
        this.caslAbilityFactory = caslAbilityFactory;
    }
    async findAllCollection(req) {
        const userId = req["user"]["sub"];
        return this.collectionService.findAllCollection(userId);
    }
    async createCollection(name, req) {
        const userId = req["user"]["sub"];
        return this.collectionService.createCollection(name, userId);
    }
    async updateCollection(id, name, req) {
        const collection = await this.collectionService.findOneById(id);
        const ability = this.caslAbilityFactory.createForUser(req["user"]);
        if (ability.can(action_enum_1.Action.Update, collection)) {
            return this.collectionService.update(id, name, collection);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.COLLECTION);
        }
    }
    async deleteCollection(id, req) {
        const collection = await this.collectionService.findOneById(id);
        const ability = this.caslAbilityFactory.createForUser(req["user"]);
        if (ability.can(action_enum_1.Action.Delete, collection)) {
            return this.collectionService.delete(collection);
        }
        else {
            throw new common_1.ForbiddenException(message_constants_1.message.NOT_AUTHOR.COLLECTION);
        }
    }
};
exports.CollectionController = CollectionController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "get all collection",
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "findAllCollection", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "create collection",
    }),
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Body)("name")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "createCollection", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "update name collection",
    }),
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("name")),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Request]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "updateCollection", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "delete collection",
    }),
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Request]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "deleteCollection", null);
exports.CollectionController = CollectionController = __decorate([
    (0, common_1.Controller)("collection"),
    (0, swagger_1.ApiTags)("collection"),
    __metadata("design:paramtypes", [collection_service_1.CollectionService,
        casl_ability_factory_1.CaslAbilityFactory])
], CollectionController);
//# sourceMappingURL=collection.controller.js.map