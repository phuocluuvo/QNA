"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sysconfigProviders = void 0;
const sysconfig_entity_1 = require("../entity/sysconfig.entity");
exports.sysconfigProviders = [
    {
        provide: "SYSCONFIG_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(sysconfig_entity_1.Sysconfig),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=sysconfig.providers.js.map