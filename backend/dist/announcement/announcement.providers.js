"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementProviders = void 0;
const announcement_entity_1 = require("./entity/announcement.entity");
exports.announcementProviders = [
    {
        provide: "ANNOUNCEMENT_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(announcement_entity_1.Announcement),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=announcement.providers.js.map