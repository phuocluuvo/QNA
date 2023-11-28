"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentProviders = void 0;
const comment_entity_1 = require("../entity/comment.entity");
exports.commentProviders = [
    {
        provide: "COMMENT_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(comment_entity_1.Comment),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=comment.providers.js.map