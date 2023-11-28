import { Role } from "../../enums/role.enum";
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Vote } from "../../vote/entity/vote.entity";
import { Activity } from "../../activity/entity/activity.entity";
import { UserState } from "../../enums/user-state.enum";
import { Tag } from "../../tag/entity/tag.entity";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { History } from "../../history/entity/history.entity";
import { Collection } from "../../collection/enity/collection.entity";
import { Announcement } from "../../announcement/entity/announcement.entity";
import { Sysconfig } from "../../sysconfig/entity/sysconfig.entity";
export declare class User {
    id: string;
    username: string;
    fullname: string;
    avatar: string;
    dob: Date;
    email: string;
    title: string;
    facebookLink: string;
    githubLink: string;
    twitterLink: string;
    websiteLink: string;
    password: string;
    role: Role;
    activityPoint: number;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    state: UserState;
    uuid: string;
    uuid_created_at: Date;
    about: string;
    location: string;
    more: string;
    notificationsNumber: number;
    questions: Question[];
    answers: Answer[];
    votes: Vote[];
    activities: Activity[];
    tags: Tag[];
    bookmarks: Bookmark[];
    collections: Collection[];
    histories: History[];
    announcements: Announcement[];
    sysconfigs: Sysconfig[];
}