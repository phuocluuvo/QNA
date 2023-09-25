import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entity/users.entity";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @Inject("USERS_REPOSITORY")
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user: User = this.userRepository.create(createUserDto);
      return this.userRepository.save(user);
    } catch (err) {
      throw new Error(`Error creating ${err} user ${err.message}`);
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
      });

      if (user) {
        return user;
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

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

  async findById(id: string): Promise<User | undefined> {
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

  async update(id: string, userDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.preload({
        id,
        ...userDto,
      });

      if (!user) {
        throw new NotFoundException(`There is no user under id ${id}`);
      }

      return this.userRepository.save(user);
    } catch (err) {
      throw new Error(`Error update ${err} user ${err.message}`);
    }
  }
}
