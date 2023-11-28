"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteProviders = void 0;
const vote_entity_1 = require("../entity/vote.entity");
exports.voteProviders = [
    {
        provide: "VOTE_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(vote_entity_1.Vote),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=vote.providers.js.map