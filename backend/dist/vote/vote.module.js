"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteModule = void 0;
const common_1 = require("@nestjs/common");
const vote_service_1 = require("./vote.service");
const database_module_1 = require("../database/database.module");
const vote_providers_1 = require("./providers/vote.providers");
const activity_module_1 = require("../activity/activity.module");
const notification_module_1 = require("../notification/notification.module");
const vote_controller_1 = require("./vote.controller");
let VoteModule = class VoteModule {
};
exports.VoteModule = VoteModule;
exports.VoteModule = VoteModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, activity_module_1.ActivityModule, notification_module_1.NotificationModule],
        providers: [...vote_providers_1.voteProviders, vote_service_1.VoteService],
        exports: [vote_service_1.VoteService],
        controllers: [vote_controller_1.VoteController],
    })
], VoteModule);
//# sourceMappingURL=vote.module.js.map