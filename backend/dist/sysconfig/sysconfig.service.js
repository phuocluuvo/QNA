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
exports.SysconfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const create_sysconfig_dto_1 = require("./dto/create-sysconfig.dto");
const class_transformer_1 = require("class-transformer");
const update_sysconfig_dto_1 = require("./dto/update-sysconfig.dto");
const message_constants_1 = require("../constants/message.constants");
let SysconfigService = class SysconfigService {
    constructor(sysconfigRepository, cacheManager) {
        this.sysconfigRepository = sysconfigRepository;
        this.cacheManager = cacheManager;
    }
    async findAll() {
        return await this.sysconfigRepository.find();
    }
    async getUsingSysconfig() {
        const cache = await this.cacheManager.get("sysconfig-using");
        if (cache) {
            return cache;
        }
        const result = await this.sysconfigRepository.findOne({
            where: { isUse: true },
            order: { createdAt: "DESC" },
        });
        if (result) {
            await this.cacheManager.set("sysconfig-using", result, -1);
        }
        return result;
    }
    async findOne(id) {
        const sysconfig = await this.sysconfigRepository.findOne({ where: { id } });
        if (!sysconfig) {
            throw new common_1.BadRequestException(message_constants_1.message.NOT_FOUND.SYSCONFIG);
        }
        return sysconfig;
    }
    async create(sysconfigDto, userId) {
        await this.cacheManager.del("sysconfig-using");
        const sysconfigDtoTrans = (0, class_transformer_1.plainToClass)(create_sysconfig_dto_1.CreateSysconfigDto, sysconfigDto, {
            excludeExtraneousValues: true,
        });
        sysconfigDtoTrans["latestEditUser"] = userId;
        return await this.sysconfigRepository.save(sysconfigDtoTrans);
    }
    async update(id, sysconfigDto, userId) {
        await this.cacheManager.del("sysconfig-using");
        const sysconfigDtoTrans = (0, class_transformer_1.plainToClass)(update_sysconfig_dto_1.UpdateSysconfigDto, sysconfigDto, {
            excludeExtraneousValues: true,
        });
        const sysconfig = await this.sysconfigRepository.preload({
            id: id,
            ...sysconfigDtoTrans,
        });
        sysconfig["latestEditUser"] = { id: userId };
        return await this.sysconfigRepository.save(sysconfig);
    }
    async delete(id) {
        const sysconfig = await this.sysconfigRepository.findOne({ where: { id } });
        if (!sysconfig) {
            throw new common_1.BadRequestException(message_constants_1.message.NOT_FOUND.SYSCONFIG);
        }
        if (sysconfig.isUse == true) {
            throw new common_1.BadRequestException(message_constants_1.message.CANNOT_DELETE_SYSCONFIG_USING);
        }
        await this.sysconfigRepository.delete({ id });
        await this.cacheManager.del("sysconfig-using");
        return sysconfig;
    }
};
exports.SysconfigService = SysconfigService;
exports.SysconfigService = SysconfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("SYSCONFIG_REPOSITORY")),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_1.Repository, Object])
], SysconfigService);
//# sourceMappingURL=sysconfig.service.js.map