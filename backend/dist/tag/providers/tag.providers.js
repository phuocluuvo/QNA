"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagProviders = void 0;
const tag_entity_1 = require("../entity/tag.entity");
exports.tagProviders = [
    {
        provide: "TAG_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(tag_entity_1.Tag),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=tag.providers.js.map