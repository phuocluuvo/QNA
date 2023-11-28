import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { PaginateQuery } from "nestjs-paginate";
import { User } from "./entity/users.entity";
import { CreateUserAdminDto } from "./dto/create-user-admin.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<UserDto>;
    confirmEmail(uuid: string, res: any): Promise<any>;
    update(req: any, updateUserDto: UpdateUserDto): Promise<UserDto>;
    getAllUser(query: PaginateQuery, state: string, role: string): Promise<import("nestjs-paginate").Paginated<User>>;
    getInfoUser(id: string): Promise<UserDto>;
    getInfoUserForAdmin(id: string): Promise<any>;
    createUserForAdmin(id: string, createUserDto: CreateUserAdminDto): Promise<UserDto>;
    updateUserForAdmin(id: string, updateUserDto: UpdateUserDto): Promise<UserDto>;
    addEmail(req: any, email: string): Promise<any>;
}
