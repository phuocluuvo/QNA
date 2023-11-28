"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SysconfigModule = void 0;
const common_1 = require("@nestjs/common");
const sysconfig_controller_1 = require("./sysconfig.controller");
const sysconfig_service_1 = require("./sysconfig.service");
const database_module_1 = require("../database/database.module");
const sysconfig_providers_1 = require("./providers/sysconfig.providers");
let SysconfigModule = class SysconfigModule {
};
exports.SysconfigModule = SysconfigModule;
exports.SysconfigModule = SysconfigModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [sysconfig_controller_1.SysconfigController],
        providers: [...sysconfig_providers_1.sysconfigProviders, sysconfig_service_1.SysconfigService],
        exports: [sysconfig_service_1.SysconfigService],
    })
], SysconfigModule);
//# sourceMappingURL=sysconfig.module.js.map