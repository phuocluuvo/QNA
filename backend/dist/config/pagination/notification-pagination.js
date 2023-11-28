"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationPagination = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.notificationPagination = {
    sortableColumns: ["createdAt", "updatedAt"],
    defaultSortBy: [
        ["isAnnouncement", "DESC"],
        ["isRead", "DESC"],
        ["createdAt", "DESC"],
    ],
    relations: [
        "user",
        "activity",
        "activity.user",
        "activity.question",
        "activity.answer",
        "activity.comment",
        "activity.answer.question",
        "activity.comment.answer.question",
        "activity.comment.question",
    ],
    searchableColumns: ["title", "description"],
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
//# sourceMappingURL=notification-pagination.js.map