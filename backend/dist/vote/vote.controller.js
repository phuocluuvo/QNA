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
exports.VoteController = void 0;
const common_1 = require("@nestjs/common");
const vote_service_1 = require("./vote.service");
const swagger_1 = require("@nestjs/swagger");
let VoteController = class VoteController {
    constructor(voteService) {
        this.voteService = voteService;
    }
    async getVoteInfo(id) {
        return await this.voteService.getVoteInfoByUser(id);
    }
};
exports.VoteController = VoteController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "vote info" }),
    (0, common_1.Get)("summary/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "getVoteInfo", null);
exports.VoteController = VoteController = __decorate([
    (0, common_1.Controller)("vote"),
    (0, swagger_1.ApiTags)("vote"),
    __metadata("design:paramtypes", [vote_service_1.VoteService])
], VoteController);
//# sourceMappingURL=vote.controller.js.map