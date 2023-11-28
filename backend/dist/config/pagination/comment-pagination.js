"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentPaginateConfig = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.commentPaginateConfig = {
    sortableColumns: ["content", "createdAt", "updatedAt"],
    defaultSortBy: [["createdAt", "ASC"]],
    filterableColumns: {
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
//# sourceMappingURL=comment-pagination.js.map