"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModule = void 0;
const common_1 = require("@nestjs/common");
const tag_controller_1 = require("./tag.controller");
const tag_service_1 = require("./tag.service");
const database_module_1 = require("../database/database.module");
const tag_providers_1 = require("./providers/tag.providers");
const activity_module_1 = require("../activity/activity.module");
const notification_module_1 = require("../notification/notification.module");
let TagModule = class TagModule {
};
exports.TagModule = TagModule;
exports.TagModule = TagModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, activity_module_1.ActivityModule, notification_module_1.NotificationModule],
        controllers: [tag_controller_1.TagController],
        providers: [...tag_providers_1.tagProviders, tag_service_1.TagService],
        exports: [tag_service_1.TagService],
    })
], TagModule);
//# sourceMappingURL=tag.module.js.map