"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPaginateConfig = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.activityPaginateConfig = {
    sortableColumns: ["createdAt", "updatedAt"],
    defaultSortBy: [["createdAt", "DESC"]],
    relations: ["user", "question", "answer", "comment", "answer.question"],
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
//# sourceMappingURL=activity-pagination.js.map