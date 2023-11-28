"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityProviders = void 0;
const activity_entity_1 = require("../entity/activity.entity");
exports.activityProviders = [
    {
        provide: "ACTIVITY_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(activity_entity_1.Activity),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=activity.providers.js.map