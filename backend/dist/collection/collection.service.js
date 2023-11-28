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
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const message_constants_1 = require("../constants/message.constants");
let CollectionService = class CollectionService {
    constructor(collectionRepository) {
        this.collectionRepository = collectionRepository;
    }
    async findAllCollection(userId) {
        return this.collectionRepository.find({
            where: { user: { id: userId } },
        });
    }
    async findOneById(id) {
        const collection = await this.collectionRepository.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!collection) {
            throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.COLLECTION);
        }
        return collection;
    }
    async findOneByName(name) {
        return await this.collectionRepository.findOne({
            where: { name },
        });
    }
    async createCollection(name, userId) {
        const checkName = await this.findOneByName(name);
        if (checkName) {
            throw new common_1.NotFoundException(message_constants_1.message.COLLECTION_NAME_IS_EXIST);
        }
        const collection = {};
        collection["name"] = name;
        collection["user"] = userId;
        return this.collectionRepository.save(collection);
    }
    async update(id, name, collection) {
        const checkName = await this.findOneByName(name);
        if (checkName && collection.name != name) {
            throw new common_1.NotFoundException(message_constants_1.message.COLLECTION_NAME_IS_EXIST);
        }
        collection.name = name;
        return this.collectionRepository.save(collection);
    }
    async delete(collection) {
        return this.collectionRepository.remove(collection);
    }
};
exports.CollectionService = CollectionService;
exports.CollectionService = CollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("COLLECTION_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CollectionService);
//# sourceMappingURL=collection.service.js.map