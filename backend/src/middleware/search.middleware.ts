import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class SearchMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    if (req.query.search) {
      req.query.search = req.query.search
        .toString()
        .trim()
        .replaceAll(" ", "%%");
    }
    next();
  }
}
