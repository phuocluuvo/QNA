"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerPaginateConfig = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.answerPaginateConfig = {
    sortableColumns: ["votes", "content", "createdAt", "updatedAt", "isApproved"],
    defaultSortBy: [["isApproved", "DESC"]],
    searchableColumns: ["content"],
    relations: ["user"],
    filterableColumns: {
        "user.id": [nestjs_paginate_1.FilterOperator.EQ],
        createdAt: [
            nestjs_paginate_1.FilterOperator.BTW,
            nestjs_paginate_1.FilterOperator.LTE,
            nestjs_paginate_1.FilterOperator.GTE,
            nestjs_paginate_1.FilterOperator.LT,
            nestjs_paginate_1.FilterOperator.GT,
        ],
        updatedAt: [
            nestjs_paginate_1.FilterOperator.BTW,
            nestjs_paginate_1.FilterOperator.LTE,
            nestjs_paginate_1.FilterOperator.GTE,
            nestjs_paginate_1.FilterOperator.LT,
            nestjs_paginate_1.FilterOperator.GT,
        ],
    },
};
//# sourceMappingURL=answer-pagination.config.js.map