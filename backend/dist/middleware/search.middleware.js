"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchMiddleware = void 0;
const common_1 = require("@nestjs/common");
let SearchMiddleware = class SearchMiddleware {
    use(req, res, next) {
        console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
        if (req.query.search) {
            req.query.search = req.query.search
                .toString()
                .trim()
                .replaceAll(" ", "%%");
        }
        next();
    }
};
exports.SearchMiddleware = SearchMiddleware;
exports.SearchMiddleware = SearchMiddleware = __decorate([
    (0, common_1.Injectable)()
], SearchMiddleware);
//# sourceMappingURL=search.middleware.js.map