import { SysconfigService } from "./sysconfig.service";
import { UpdateSysconfigDto } from "./dto/update-sysconfig.dto";
import { CreateSysconfigDto } from "./dto/create-sysconfig.dto";
export declare class SysconfigController {
    private readonly sysconfigService;
    constructor(sysconfigService: SysconfigService);
    findAll(): Promise<import("./entity/sysconfig.entity").Sysconfig[]>;
    findOne(id: string): Promise<import("./entity/sysconfig.entity").Sysconfig>;
    create(sysconfigDto: CreateSysconfigDto, req: Request): Promise<import("./entity/sysconfig.entity").Sysconfig>;
    update(id: string, sysconfigDto: UpdateSysconfigDto, userId: string): Promise<import("./entity/sysconfig.entity").Sysconfig>;
    delete(id: string): Promise<import("./entity/sysconfig.entity").Sysconfig>;
}
