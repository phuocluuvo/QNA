import { Role } from "../../enums/role.enum";
import { UserState } from "../../enums/user-state.enum";
export declare class UserDto {
    id: string;
    username: string;
    fullname: string;
    avatar: string;
    activityPoint: number;
    dob: Date;
    email: string;
    role: Role;
    title: string;
    facebookLink: string;
    githubLink: string;
    twitterLink: string;
    websiteLink: string;
    state: UserState;
    createdAt: Date;
    updatedAt: Date;
    location: string;
    about: string;
}
