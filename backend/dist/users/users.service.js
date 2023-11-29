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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const create_user_dto_1 = require("./dto/create-user.dto");
const users_entity_1 = require("./entity/users.entity");
const update_user_dto_1 = require("./dto/update-user.dto");
const argon2 = require("argon2");
const message_constants_1 = require("../constants/message.constants");
const nestjs_paginate_1 = require("nestjs-paginate");
const user_pagination_1 = require("../config/pagination/user-pagination");
const class_transformer_1 = require("class-transformer");
const update_user_admin_dto_1 = require("./dto/update-user-admin.dto");
const create_user_admin_dto_1 = require("./dto/create-user-admin.dto");
const question_type_enum_1 = require("../enums/question-type.enum");
const uuid_1 = require("uuid");
const email_service_1 = require("../email/email.service");
let UsersService = class UsersService {
    constructor(userRepository, emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    async getAllUser(query, state, role) {
        const queryBuilder = await this.userRepository.createQueryBuilder("user");
        if (state) {
            queryBuilder.andWhere({ state: state });
        }
        if (role) {
            queryBuilder.andWhere({ role: role });
        }
        return (0, nestjs_paginate_1.paginate)(query, queryBuilder, user_pagination_1.userPaginateConfig);
    }
    async create(createUserDto) {
        try {
            const userTrans = (0, class_transformer_1.plainToClass)(create_user_dto_1.CreateUserDto, createUserDto, {
                excludeExtraneousValues: true,
            });
            return this.userRepository.save(userTrans);
        }
        catch (err) {
            throw new Error(`Error creating ${err} user ${err.message}`);
        }
    }
    async find(obj) {
        try {
            const user = await this.userRepository.findOne({
                where: obj,
            });
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async findOne(username) {
        try {
            const user = await this.userRepository
                .createQueryBuilder("user")
                .addSelect("user.password")
                .where({ username })
                .getOne();
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async findOneByEmail(email) {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
            });
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async findOneByGithub(github) {
        try {
            const user = await this.userRepository.findOne({
                where: { githubLink: github },
            });
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async findOneByRefreshToken(refreshToken) {
        try {
            const user = await this.userRepository.findOne({
                where: { refreshToken },
            });
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async findOneByUuid(uuid) {
        try {
            const user = await this.userRepository.findOne({
                where: { uuid },
            });
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async findOneById(id) {
        try {
            const user = await this.userRepository.findOneById(id);
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async findById(id) {
        try {
            const user = await this.userRepository
                .createQueryBuilder("user")
                .addSelect("user.refreshToken")
                .where({ id })
                .getOne();
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async update(id, userDto) {
        try {
            const user = await this.userRepository.preload({
                id,
                ...userDto,
            });
            if (!user) {
                throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.USER);
            }
            return this.userRepository.save(user);
        }
        catch (err) {
            throw new Error(`Error update ${err} user ${err.message}`);
        }
    }
    async getProfile(id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
            });
            if (user) {
                return user;
            }
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async getMoreProfileForAdmin(id, timeType) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentQuarter = Math.ceil(currentMonth / 3);
        try {
            const queryBuilder = await this.userRepository
                .createQueryBuilder("user")
                .select([
                "COUNT(DISTINCT question.id) AS questionCount",
                "COUNT(DISTINCT answer.id) AS answerCount",
                "COUNT(DISTINCT vote.id) AS voteCount",
                "COUNT(DISTINCT tag.id) AS tagCount",
            ])
                .leftJoin("user.questions", "question")
                .leftJoin("user.answers", "answer")
                .leftJoin("user.votes", "vote")
                .leftJoin("user.tags", "tag");
            switch (timeType) {
                case question_type_enum_1.QuestionTimeTypeEnum.MONTH:
                    queryBuilder
                        .where("YEAR(question.createdAt) = :year", { year: currentYear })
                        .andWhere("MONTH(question.createdAt) = :month", {
                        month: currentMonth,
                    })
                        .andWhere("YEAR(answer.createdAt) = :year", { year: currentYear })
                        .andWhere("MONTH(answer.createdAt) = :month", {
                        month: currentMonth,
                    })
                        .andWhere("YEAR(vote.createdAt) = :year", { year: currentYear })
                        .andWhere("MONTH(vote.createdAt) = :month", {
                        month: currentMonth,
                    })
                        .andWhere("YEAR(tag.createdAt) = :year", { year: currentYear })
                        .andWhere("MONTH(tag.createdAt) = :month", {
                        month: currentMonth,
                    });
                    break;
                case question_type_enum_1.QuestionTimeTypeEnum.QUARTER:
                    queryBuilder
                        .where("YEAR(question.createdAt) = :year", { year: currentYear })
                        .andWhere("QUARTER(question.createdAt) = :quarter", {
                        quarter: currentQuarter,
                    })
                        .andWhere("YEAR(answer.createdAt) = :year", { year: currentYear })
                        .andWhere("QUARTER(answer.createdAt) = :quarter", {
                        quarter: currentQuarter,
                    })
                        .andWhere("YEAR(vote.createdAt) = :year", { year: currentYear })
                        .andWhere("QUARTER(vote.createdAt) = :quarter", {
                        quarter: currentQuarter,
                    })
                        .andWhere("YEAR(tag.createdAt) = :year", { year: currentYear })
                        .andWhere("QUARTER(tag.createdAt) = :quarter", {
                        quarter: currentQuarter,
                    });
                    break;
                case question_type_enum_1.QuestionTimeTypeEnum.YEAR:
                    queryBuilder
                        .where("YEAR(question.createdAt) = :year", {
                        year: currentYear,
                    })
                        .andWhere("YEAR(answer.createdAt) = :year", { year: currentYear })
                        .andWhere("YEAR(vote.createdAt) = :year", { year: currentYear })
                        .andWhere("YEAR(tag.createdAt) = :year", { year: currentYear });
                    break;
                default:
                    break;
            }
            queryBuilder.where("user.id = :id", { id }).groupBy("user.id");
            const result = await queryBuilder.getRawOne();
            return result;
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async getProlifeForAdmin(id) {
        try {
            const queryBuilder = await this.userRepository
                .createQueryBuilder("user")
                .select([
                "user.id as id",
                "user.username as username",
                "user.fullname as fullname",
                "user.avatar as avatar",
                "user.dob as dob",
                "user.email as email",
                "user.role as role",
                "user.location as location",
                "user.about as about",
                "user.activityPoint as activityPoint",
                "user.createdAt as createdAt",
                "user.updatedAt as updatedAt",
                "user.state as state",
            ])
                .where("user.id = :id", { id });
            return queryBuilder.getRawOne();
        }
        catch (err) {
            throw new Error(`Error finding ${err} user ${err.message}`);
        }
    }
    async updateProfile(id, userDto) {
        const userTrans = (0, class_transformer_1.plainToClass)(update_user_dto_1.UpdateUserDto, userDto, {
            excludeExtraneousValues: true,
        });
        if (userTrans["password"]) {
            userTrans["password"] = await argon2.hash(userDto["password"]);
        }
        delete userTrans.username;
        delete userTrans.email;
        delete userTrans.refreshToken;
        return await this.update(id, userTrans);
    }
    async createUserForAdmin(createUserDto) {
        const errExits = {};
        const userExists = await this.findOne(createUserDto.username);
        if (userExists) {
            errExits["username"] = "User already exists";
        }
        const emailExists = await this.findOneByEmail(createUserDto.email);
        if (emailExists) {
            errExits["email"] = "Email already exists";
        }
        if (emailExists || userExists) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                error: "Bad Request",
                message: errExits,
            });
        }
        const userTrans = (0, class_transformer_1.plainToClass)(create_user_admin_dto_1.CreateUserAdminDto, createUserDto, {
            excludeExtraneousValues: true,
        });
        userTrans["password"] = await argon2.hash(createUserDto["password"]);
        return this.userRepository.save(userTrans);
    }
    async updateUserForAdmin(id, userDto) {
        const userTrans = (0, class_transformer_1.plainToClass)(update_user_admin_dto_1.UpdateUserAdminDto, userDto, {
            excludeExtraneousValues: true,
        });
        if (userTrans["password"]) {
            userTrans["password"] = await argon2.hash(userDto["password"]);
        }
        delete userTrans.username;
        delete userTrans.email;
        return await this.update(id, userTrans);
    }
    async updateActivityPoint(id, pointChange) {
        return this.userRepository
            .createQueryBuilder("user")
            .update(users_entity_1.User)
            .set({ activityPoint: () => `activity_point + ${pointChange}` })
            .where("id = :id", { id })
            .execute();
    }
    getTop5HasMostQuestion() {
        const queryBuilder = this.userRepository
            .createQueryBuilder("user")
            .select([
            "user.id as id",
            "user.username as username",
            "user.fullname as fullname",
            "user.avatar as avatar",
            "user.dob as dob",
            "user.email as email",
            "user.role as role",
            "user.activityPoint as activityPoint",
            "user.createdAt as createdAt",
            "user.updatedAt as updatedAt",
            "user.state as state",
        ])
            .addSelect("COUNT(user.id)", "question_count")
            .leftJoin("question", "question", "question.user_id = user.id")
            .groupBy("user.id")
            .orderBy("question_count", "DESC")
            .limit(5);
        return queryBuilder.getRawMany();
    }
    getTop5HasMostAnswer() {
        const queryBuilder = this.userRepository
            .createQueryBuilder("user")
            .select([
            "user.id as id",
            "user.username as username",
            "user.fullname as fullname",
            "user.avatar as avatar",
            "user.dob as dob",
            "user.email as email",
            "user.role as role",
            "user.activityPoint as activityPoint",
            "user.createdAt as createdAt",
            "user.updatedAt as updatedAt",
            "user.state as state",
        ])
            .addSelect("COUNT(user.id)", "answer_count")
            .leftJoin("answer", "answer", "answer.user_id = user.id")
            .groupBy("user.id")
            .orderBy("answer_count", "DESC")
            .limit(5);
        return queryBuilder.getRawMany();
    }
    getOneById(userId) {
        const queryBuilder = this.userRepository
            .createQueryBuilder("user")
            .select("user.password", "password")
            .where("user.id = :userId", { userId });
        return queryBuilder.getRawOne();
    }
    async updateEmail(id, email) {
        try {
            const user = await this.userRepository.findOneById(id);
            if (!user) {
                throw new common_1.NotFoundException(message_constants_1.message.NOT_FOUND.USER);
            }
            user.email = email;
            return this.userRepository.save(user);
        }
        catch (err) {
            throw new Error(`Error update ${err} user ${err.message}`);
        }
    }
    async AddEmail(id, email) {
        if (!email) {
            throw new common_1.BadRequestException(message_constants_1.message.EMAIL_IS_REQUIRED);
        }
        if (await this.findOneByEmail(email)) {
            throw new common_1.BadRequestException(message_constants_1.message.EXISTED.EMAIL);
        }
        const user = await this.findOneById(id);
        user.more = email;
        if (!user)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        if (user.uuid && user.uuid_created_at) {
            const expirationTime = new Date(user.uuid_created_at.getTime() + 5 * 60 * 1000);
            const currentTime = new Date();
            if (expirationTime > currentTime) {
                throw new common_1.BadRequestException(message_constants_1.message.PLEASE_ALLOW_AT_LEAST_5_MINUTES_BEFORE_MAKING_ANOTHER_REQUEST);
            }
            else {
                return this.updateUuidForAddEmail(user);
            }
        }
        else {
            return this.updateUuidForAddEmail(user);
        }
    }
    async updateUuidForAddEmail(user) {
        user.uuid = (0, uuid_1.v4)();
        user.uuid_created_at = new Date();
        await this.update(user.id, user);
        return this.emailService.sendEmailAddEmail(user.more, `${process.env.URL_API}/api/user/confirm-email?uuid=${user.uuid}`);
    }
    async confirmEmail(uuid) {
        const user = await this.findOneByUuid(uuid);
        const currentTime = new Date();
        const expirationTime = new Date(user.uuid_created_at.getTime() + 5 * 60 * 1000);
        if (expirationTime < currentTime) {
            throw new common_1.BadRequestException(message_constants_1.message.THE_LINK_HAS_EXPIRED);
        }
        if (!user)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        user.email = user.more;
        user.more = null;
        user.uuid = null;
        user.uuid_created_at = null;
        return this.update(user.id, user);
    }
    async addActivityPoint(pointChange) {
        return this.userRepository
            .createQueryBuilder("user")
            .update(users_entity_1.User)
            .set({ activityPoint: () => `activity_point + ${pointChange}` })
            .execute();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("USERS_REPOSITORY")),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map