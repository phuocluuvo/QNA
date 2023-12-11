import { User } from "../../users/entity/users.entity";
export declare class Announcement {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    expiration_date: Date;
    publication_date: Date;
    is_published: boolean;
    user: User;
}
