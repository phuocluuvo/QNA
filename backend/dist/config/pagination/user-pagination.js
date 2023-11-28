"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPaginateConfig = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.userPaginateConfig = {
    sortableColumns: [
        "fullname",
        "username",
        "email",
        "role",
        "activityPoint",
        "createdAt",
        "updatedAt",
    ],
    searchableColumns: ["fullname", "username", "email"],
    defaultSortBy: [["createdAt", "DESC"]],
    filterableColumns: {
        role: [nestjs_paginate_1.FilterOperator.EQ],
        state: [nestjs_paginate_1.FilterOperator.EQ],
    },
};
//# sourceMappingURL=user-pagination.js.map