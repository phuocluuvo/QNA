"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionProviders = void 0;
const question_entity_1 = require("../entity/question.entity");
exports.questionProviders = [
    {
        provide: "QUESTION_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(question_entity_1.Question),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=question.providers.js.map