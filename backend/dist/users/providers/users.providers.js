"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersProviders = void 0;
const users_entity_1 = require("../entity/users.entity");
exports.usersProviders = [
    {
        provide: "USERS_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(users_entity_1.User),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=users.providers.js.map