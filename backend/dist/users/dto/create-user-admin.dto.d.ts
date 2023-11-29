import { UserState } from "../../enums/user-state.enum";
import { Role } from "../../enums/role.enum";
export declare class CreateUserAdminDto {
    username: string;
    fullname: string;
    avatar: string;
    email: string;
    title: string;
    facebookLink: string;
    githubLink: string;
    twitterLink: string;
    websiteLink: string;
    dob: Date;
    password: string;
    state: UserState;
    role: Role;
    about: string;
    location: string;
    activityPoint: number;
}
