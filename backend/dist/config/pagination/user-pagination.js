"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPaginateConfig = void 0;
const nestjs_paginate_1 = require("nestjs-paginate");
exports.userPaginateConfig = {
    searchableColumns: ["id", "fullname", "username", "email"],
    sortableColumns: [
        "createdAt",
        "updatedAt",
        "fullname",
        "username",
        "email",
        "role",
        "activityPoint",
    ],
    filterableColumns: {
        role: [nestjs_paginate_1.FilterOperator.EQ],
        state: [nestjs_paginate_1.FilterOperator.EQ],
    },
};
//# sourceMappingURL=user-pagination.js.map