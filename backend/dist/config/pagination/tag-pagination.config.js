"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagPaginateConfig = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.tagPaginateConfig = {
    sortableColumns: ["content", "createdAt", "updatedAt"],
    defaultSortBy: [["name", "ASC"]],
    searchableColumns: ["name", "content"],
    relations: ["user", "questions"],
    filterableColumns: {
        "user.id": [nestjs_paginate_1.FilterOperator.EQ],
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
//# sourceMappingURL=tag-pagination.config.js.map