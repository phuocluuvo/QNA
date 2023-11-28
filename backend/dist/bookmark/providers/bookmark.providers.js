"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkProviders = void 0;
const bookmark_entity_1 = require("../entity/bookmark.entity");
exports.bookmarkProviders = [
    {
        provide: "BOOKMARK_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(bookmark_entity_1.Bookmark),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=bookmark.providers.js.map