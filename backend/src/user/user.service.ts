import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async createOne() {
        this.userRepository.create({
            name: "ewe",
            avatar: "đưaawdwa",
            email: "ưdaadwdwadw",
            isVerify: true
        });
    }
}