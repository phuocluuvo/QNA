"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionModule = void 0;
const common_1 = require("@nestjs/common");
const collection_controller_1 = require("./collection.controller");
const collection_service_1 = require("./collection.service");
const database_module_1 = require("../database/database.module");
const collection_providers_1 = require("./providers/collection.providers");
const casl_module_1 = require("../casl/casl.module");
let CollectionModule = class CollectionModule {
};
exports.CollectionModule = CollectionModule;
exports.CollectionModule = CollectionModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, casl_module_1.CaslModule],
        controllers: [collection_controller_1.CollectionController],
        providers: [...collection_providers_1.collectionProviders, collection_service_1.CollectionService],
        exports: [collection_service_1.CollectionService],
    })
], CollectionModule);
//# sourceMappingURL=collection.module.js.map