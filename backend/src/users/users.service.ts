import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entity/users.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as argon2 from "argon2";
import { message } from "../constants/message.constants";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { userPaginateConfig } from "../config/pagination/user-pagination";
import { plainToClass } from "class-transformer";
import { UpdateUserAdminDto } from "./dto/update-user-admin.dto";
import { CreateUserAdminDto } from "./dto/create-user-admin.dto";
import { QuestionTimeTypeEnum } from "src/enums/question-type.enum";

@Injectable()
export class UsersService {
  constructor(
    @Inject("USERS_REPOSITORY")
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUser(query: PaginateQuery, state: string, role: string) {
    const queryBuilder = await this.userRepository.createQueryBuilder("user");

    if (state) {
      queryBuilder.andWhere({ state: state });
    }

    if (role) {
      queryBuilder.andWhere({ role: role });
    }

    return paginate<User>(query, queryBuilder, userPaginateConfig);
  }

  /**
   * Create a new user.
   *
   * @param createUserDto Data for creating a new user.
   * @returns Promise<User> The created user.
   * @throws Error if there's an error during the creation process.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const userTrans = plainToClass(CreateUserDto, createUserDto, {
        excludeExtraneousValues: true,
      });

      return this.userRepository.save(userTrans);
    } catch (err) {
      throw new Error(`Error creating ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by obj.
   *
   * @param obj params.
   * @returns Promise<User | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */
  async find(obj: any): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: obj,
      });

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by username.
   *
   * @param username Username to search for.
   * @returns Promise<User | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */
  async findOne(username: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .addSelect("user.password")
        .where({ username })
        .getOne();

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by email.
   *
   * @param email Email to search for.
   * @returns Promise<User | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */
  async findOneByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async findOneByGithub(github: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { githubLink: github },
      });

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by refresh token.
   * @param refreshToken Refresh token to search for.
   * @returns Promise<User | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */

  async findOneByRefreshToken(refreshToken: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { refreshToken },
      });

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by uuid.
   *
   * @param email Email to search for.
   * @returns Promise<User | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */
  async findOneByUuid(uuid: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { uuid },
      });

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by ID.
   *
   * @param id ID of the user to search for.
   * @returns Promise<Partial<User> | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */
  async findById(id: string): Promise<Partial<User> | undefined> {
    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .addSelect("user.refreshToken")
        .where({ id })
        .getOne();

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Update user information, only auth use.
   *
   * @param id ID of the user to update.
   * @param userDto Data for updating the user.
   * @returns Promise<User> The updated user.
   * @throws NotFoundException if the user with the given ID is not found.
   * @throws Error if there's an error during the update process.
   */
  async update(id: string, userDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.preload({
        id,
        ...userDto,
      });

      if (!user) {
        throw new NotFoundException(message.NOT_FOUND.USER);
      }

      return this.userRepository.save(user);
    } catch (err) {
      throw new Error(`Error update ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by ID.
   *
   * @param id ID of the user to search for.
   * @returns Promise<Partial<User> | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */
  async getProfile(id: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Find a user by ID.
   *
   * @param id ID of the user to search for.
   * @returns Promise<Partial<User> | undefined> The found user or undefined if not found.
   * @throws Error if there's an error during the search process.
   */
  async getMoreProfileForAdmin(
    id: string,
    timeType?: QuestionTimeTypeEnum,
  ): Promise<any> {
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
        .leftJoin("user.tags", "tag")
        .where("user.id = :id", { id })
        .groupBy("user.id");
      switch (timeType) {
        case QuestionTimeTypeEnum.MONTH:
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
        case QuestionTimeTypeEnum.QUARTER:
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
        case QuestionTimeTypeEnum.YEAR:
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
      const result = await queryBuilder.getRawOne();
      return result;
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async getProlifeForAdmin(id: string) {
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
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  /**
   * Update user profile for controller.
   *
   * @param id ID of the user to update.
   * @param userDto Data for updating the user.
   * @returns Promise<User> The updated user.
   * @throws NotFoundException if the user with the given ID is not found.
   * @throws Error if there's an error during the update process.
   */
  async updateProfile(id: string, userDto: UpdateUserDto) {
    const userTrans = plainToClass(UpdateUserDto, userDto, {
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

  async createUserForAdmin(createUserDto: CreateUserAdminDto) {
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
      throw new BadRequestException({
        statusCode: 400,
        error: "Bad Request",
        message: errExits,
      });
    }

    const userTrans = plainToClass(CreateUserAdminDto, createUserDto, {
      excludeExtraneousValues: true,
    });
    userTrans["password"] = await argon2.hash(createUserDto["password"]);

    return this.userRepository.save(userTrans);
  }

  /**
   * Update user profile for controller.
   *
   * @param id ID of the user to update.
   * @param userDto Data for updating the user.
   * @returns Promise<User> The updated user.
   * @throws NotFoundException if the user with the given ID is not found.
   * @throws Error if there's an error during the update process.
   */
  async updateUserForAdmin(id: string, userDto: UpdateUserAdminDto) {
    const userTrans = plainToClass(UpdateUserAdminDto, userDto, {
      excludeExtraneousValues: true,
    });
    if (userTrans["password"]) {
      userTrans["password"] = await argon2.hash(userDto["password"]);
    }
    delete userTrans.username;
    delete userTrans.email;

    return await this.update(id, userTrans);
  }

  /**
   * Update user information, only auth use.
   *
   * @param id
   * @param pointChange
   * @returns Promise<User> The updated user.
   * @throws Error if there's an error during the update process.
   */
  async updateActivityPoint(id: string, pointChange: number) {
    return this.userRepository
      .createQueryBuilder("user")
      .update(User)
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

  getOneById(userId: string) {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .select("user.password", "password")
      .where("user.id = :userId", { userId });

    return queryBuilder.getRawOne();
  }
}
