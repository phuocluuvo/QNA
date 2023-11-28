import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Sysconfig } from "./entity/sysconfig.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { CreateSysconfigDto } from "./dto/create-sysconfig.dto";
import { plainToClass } from "class-transformer";
import { UpdateSysconfigDto } from "./dto/update-sysconfig.dto";
import { User } from "../users/entity/users.entity";
import { message } from "../constants/message.constants";

@Injectable()
export class SysconfigService {
  constructor(
    @Inject("SYSCONFIG_REPOSITORY")
    private readonly sysconfigRepository: Repository<Sysconfig>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<Sysconfig[]> {
    return await this.sysconfigRepository.find();
  }

  async getUsingSysconfig(): Promise<Sysconfig> {
    const cache = await this.cacheManager.get("sysconfig-using");

    if (cache) {
      return cache as unknown as Sysconfig;
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

  async findOne(id: string): Promise<Sysconfig> {
    const sysconfig = await this.sysconfigRepository.findOne({ where: { id } });
    if (!sysconfig) {
      throw new BadRequestException(message.NOT_FOUND.SYSCONFIG);
    }
    return sysconfig;
  }

  async create(
    sysconfigDto: CreateSysconfigDto,
    userId: string,
  ): Promise<Sysconfig> {
    await this.cacheManager.del("sysconfig-using");
    const sysconfigDtoTrans = plainToClass(CreateSysconfigDto, sysconfigDto, {
      excludeExtraneousValues: true,
    });
    sysconfigDtoTrans["latestEditUser"] = userId;
    return await this.sysconfigRepository.save(sysconfigDtoTrans);
  }

  async update(
    id: string,
    sysconfigDto: UpdateSysconfigDto,
    userId: string,
  ): Promise<Sysconfig> {
    await this.cacheManager.del("sysconfig-using");
    const sysconfigDtoTrans = plainToClass(UpdateSysconfigDto, sysconfigDto, {
      excludeExtraneousValues: true,
    });
    const sysconfig = await this.sysconfigRepository.preload({
      id: id,
      ...sysconfigDtoTrans,
    });
    sysconfig["latestEditUser"] = { id: userId } as unknown as User;
    return await this.sysconfigRepository.save(sysconfig);
  }

  async delete(id: string): Promise<Sysconfig> {
    const sysconfig = await this.sysconfigRepository.findOne({ where: { id } });
    if (!sysconfig) {
      throw new BadRequestException(message.NOT_FOUND.SYSCONFIG);
    }

    if (sysconfig.isUse == true) {
      throw new BadRequestException(message.CANNOT_DELETE_SYSCONFIG_USING);
    }
    await this.sysconfigRepository.delete({ id });
    await this.cacheManager.del("sysconfig-using");
    return sysconfig;
  }
}
