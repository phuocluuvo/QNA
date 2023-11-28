import { User } from "../../users/entity/users.entity";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";
export declare class Collection {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    bookmarks: Bookmark[];
}
