"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerProviders = void 0;
const answer_entity_1 = require("../entity/answer.entity");
exports.answerProviders = [
    {
        provide: "ANSWER_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(answer_entity_1.Answer),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=answer.providers.js.map