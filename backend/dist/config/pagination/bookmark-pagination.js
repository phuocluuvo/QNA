"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkPaginateConfig = void 0;
exports.bookmarkPaginateConfig = {
    sortableColumns: ["createdAt", "updatedAt"],
    defaultSortBy: [["createdAt", "DESC"]],
    relations: ["question", "answer", "answer.question", "collection"],
};
//# sourceMappingURL=bookmark-pagination.js.map