import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('/user')
export class UserController {
    constructor(private readonly userProvider: UserService) { }

    @Get()
    getAll(): Promise<User[]> {
        return this.userProvider.findAll();
    }
}
