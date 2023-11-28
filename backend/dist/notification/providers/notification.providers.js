"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationProviders = void 0;
const notification_entity_1 = require("../entity/notification.entity");
exports.notificationProviders = [
    {
        provide: "NOTIFICATION_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(notification_entity_1.Notification),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=notification.providers.js.map