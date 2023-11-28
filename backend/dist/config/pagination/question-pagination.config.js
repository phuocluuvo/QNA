"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionPaginateConfig = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.questionPaginateConfig = {
    sortableColumns: [
        "title",
        "content",
        "views",
        "votes",
        "createdAt",
        "updatedAt",
    ],
    defaultSortBy: [["title", "ASC"]],
    searchableColumns: ["title", "content"],
    relations: ["user", "comments", "comments.user"],
    filterableColumns: {
        "user.id": [nestjs_paginate_1.FilterOperator.EQ],
        type: [nestjs_paginate_1.FilterOperator.EQ],
        state: [nestjs_paginate_1.FilterOperator.EQ],
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
//# sourceMappingURL=question-pagination.config.js.map