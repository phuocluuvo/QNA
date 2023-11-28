import { Repository } from "typeorm";
import { Sysconfig } from "./entity/sysconfig.entity";
import { Cache } from "cache-manager";
import { CreateSysconfigDto } from "./dto/create-sysconfig.dto";
import { UpdateSysconfigDto } from "./dto/update-sysconfig.dto";
export declare class SysconfigService {
    private readonly sysconfigRepository;
    private cacheManager;
    constructor(sysconfigRepository: Repository<Sysconfig>, cacheManager: Cache);
    findAll(): Promise<Sysconfig[]>;
    getUsingSysconfig(): Promise<Sysconfig>;
    findOne(id: string): Promise<Sysconfig>;
    create(sysconfigDto: CreateSysconfigDto, userId: string): Promise<Sysconfig>;
    update(id: string, sysconfigDto: UpdateSysconfigDto, userId: string): Promise<Sysconfig>;
    delete(id: string): Promise<Sysconfig>;
}
