import { Module } from "@nestjs/common";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { DatabaseModule } from "../database/database.module";
import { historyProviders } from "./providers/history.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [HistoryController],
  providers: [...historyProviders, HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
