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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const argon2 = require("argon2");
const constants_1 = require("../constants/constants");
const message_constants_1 = require("../constants/message.constants");
const user_state_enum_1 = require("../enums/user-state.enum");
const uuid_1 = require("uuid");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async signUp(createUserDto) {
        const errExits = {};
        const userExists = await this.usersService.findOne(createUserDto.username);
        if (userExists) {
            errExits["username"] = "User already exists";
        }
        const emailExists = await this.usersService.findOneByEmail(createUserDto.email);
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
        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hash,
        });
        const tokens = await this.getTokens(newUser.id, newUser.username, newUser.role);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        delete newUser.password;
        return { ...newUser, ...tokens };
    }
    async signIn(data) {
        const user = await this.usersService.findOne(data.username);
        if (!user)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        const passwordMatches = await argon2.verify(user.password, data.password);
        if (!passwordMatches)
            throw new common_1.BadRequestException(message_constants_1.message.PASSWORD_IS_INCORRECT);
        const isBlock = user.state === user_state_enum_1.UserState.BLOCKED;
        if (isBlock)
            throw new common_1.BadRequestException(message_constants_1.message.USER_IS_BLOCK);
        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        delete user.password;
        return { ...user, ...tokens };
    }
    async signInWithGoogle(user) {
        let existUser = await this.usersService.findOneByEmail(user.email);
        if (!existUser) {
            existUser = await this.createNew(user);
        }
        if (!existUser.avatar) {
            await this.usersService.update(existUser.id, { avatar: user.picture });
        }
        if (!existUser)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        const isBlock = existUser.state === user_state_enum_1.UserState.BLOCKED;
        if (isBlock)
            throw new common_1.BadRequestException(message_constants_1.message.USER_IS_BLOCK);
        const tokens = await this.getTokens(existUser.id, existUser.username, existUser.role);
        const refreshToken = await this.updateRefreshToken(existUser.id, tokens.refreshToken);
        delete existUser.password;
        return { ...existUser, ...tokens, refreshToken };
    }
    async signInWithGithub(user) {
        let existUser = await this.usersService.findOneByGithub(user.profileUrl);
        if (!existUser) {
            existUser = await this.createNewForGithub(user);
        }
        if (!existUser.avatar && user.photos?.length) {
            await this.usersService.update(existUser.id, {
                avatar: user.photos[0].value,
            });
        }
        if (!existUser)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        const isBlock = existUser.state === user_state_enum_1.UserState.BLOCKED;
        if (isBlock)
            throw new common_1.BadRequestException(message_constants_1.message.USER_IS_BLOCK);
        const tokens = await this.getTokens(existUser.id, existUser.username, existUser.role);
        const refreshToken = await this.updateRefreshToken(existUser.id, tokens.refreshToken);
        delete existUser.password;
        return { ...existUser, ...tokens, refreshToken };
    }
    async logout(userId) {
        return this.usersService.update(userId, { refreshToken: null });
    }
    hashData(data) {
        return argon2.hash(data);
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
        return hashedRefreshToken;
    }
    async getTokens(userId, username, role) {
        const accessTokenExpiresIn = 60 * 60;
        const refreshTokenExpiresIn = 7 * 24 * 60 * 60;
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
                role,
            }, {
                secret: constants_1.jwtConstants.access,
                expiresIn: accessTokenExpiresIn,
            }),
            this.jwtService.signAsync({
                sub: userId,
                username,
                role,
            }, {
                secret: constants_1.jwtConstants.refesh,
                expiresIn: refreshTokenExpiresIn,
            }),
        ]);
        return {
            accessToken,
            expires_in: this.calculateExpiryDate(accessTokenExpiresIn),
            refreshToken,
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findById(userId);
        const isBlock = user.state === user_state_enum_1.UserState.BLOCKED;
        if (isBlock)
            throw new common_1.BadRequestException(message_constants_1.message.USER_IS_BLOCK);
        if (!user || !user.refreshToken)
            throw new common_1.ForbiddenException(message_constants_1.message.ACCESS_DENIED);
        const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches)
            throw new common_1.ForbiddenException(message_constants_1.message.ACCESS_DENIED);
        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async refreshTokensV2(refreshToken) {
        const user = await this.usersService.findOneByRefreshToken(refreshToken);
        if (!user)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        const isBlock = user.state === user_state_enum_1.UserState.BLOCKED;
        if (isBlock)
            throw new common_1.BadRequestException(message_constants_1.message.USER_IS_BLOCK);
        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return { ...user, ...tokens };
    }
    calculateExpiryDate(expiresInSeconds) {
        const currentTime = new Date();
        return new Date(currentTime.getTime() + expiresInSeconds * 1000);
    }
    async createNew(user) {
        const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
        const createUserDto = new create_user_dto_1.CreateUserDto();
        createUserDto.username =
            user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + randomDigits;
        createUserDto.fullname = user.firstName + " " + user.lastName;
        createUserDto.email = user.email;
        createUserDto.avatar = user.picture;
        createUserDto.password = await this.hashData(user.email);
        createUserDto.refreshToken = user.token;
        return this.usersService.create(createUserDto);
    }
    async createNewForGithub(user) {
        const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
        const createUserDto = new create_user_dto_1.CreateUserDto();
        createUserDto.username = user.username + randomDigits;
        createUserDto.fullname = user.displayName;
        createUserDto.email = user.email || null;
        createUserDto.password = await this.hashData(user.username);
        createUserDto.refreshToken = null;
        createUserDto.githubLink = user.profileUrl;
        return this.usersService.create(createUserDto);
    }
    async forgotPassword(username) {
        const user = await this.usersService.findOne(username);
        if (!user)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        if (user.uuid && user.uuid_created_at) {
            const expirationTime = new Date(user.uuid_created_at.getTime() + 5 * 60 * 1000);
            const currentTime = new Date();
            if (expirationTime > currentTime) {
                throw new common_1.BadRequestException(message_constants_1.message.PLEASE_ALLOW_AT_LEAST_5_MINUTES_BEFORE_MAKING_ANOTHER_REQUEST);
            }
            else {
                return this.updateUuid(user);
            }
        }
        else {
            return this.updateUuid(user);
        }
    }
    async updateUuid(user) {
        user.uuid = (0, uuid_1.v4)();
        user.uuid_created_at = new Date();
        await this.usersService.update(user.id, user);
        return this.emailService.sendEmailResetPassword(user.email, `${process.env.URL_WEB}/auth/signin?uuid=${user.uuid}`);
    }
    async resetPassword(uuid, newPassword) {
        const user = await this.usersService.findOneByUuid(uuid);
        if (!user)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        const currentTime = new Date();
        const expirationTime = new Date(user.uuid_created_at.getTime() + 5 * 60 * 1000);
        if (expirationTime < currentTime) {
            throw new common_1.BadRequestException(message_constants_1.message.THE_LINK_HAS_EXPIRED);
        }
        const hash = await this.hashData(newPassword);
        user.uuid = null;
        user.uuid_created_at = null;
        user.password = hash;
        return this.usersService.update(user.id, user);
    }
    async checkUserExists(username) {
        const user = await this.usersService.findOne(username);
        if (!user)
            throw new common_1.BadRequestException(message_constants_1.message.NOT_EXITS_USER);
        delete user.password;
        return user;
    }
    async confirmPassword(userId, password) {
        if (!password)
            throw new common_1.BadRequestException(message_constants_1.message.PASSWORD_IS_EMPTY);
        const user = await this.usersService.getOneById(userId);
        const passwordMatches = await argon2.verify(user.password, password);
        if (!passwordMatches)
            throw new common_1.BadRequestException(message_constants_1.message.PASSWORD_IS_INCORRECT);
        return {
            status: "success",
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map