"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyProviders = void 0;
const history_entity_1 = require("../entity/history.entity");
exports.historyProviders = [
    {
        provide: "HISTORY_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(history_entity_1.History),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=history.providers.js.map