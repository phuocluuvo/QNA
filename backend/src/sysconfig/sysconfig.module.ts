import { Module } from "@nestjs/common";
import { SysconfigController } from "./sysconfig.controller";
import { SysconfigService } from "./sysconfig.service";
import { DatabaseModule } from "../database/database.module";
import { sysconfigProviders } from "./providers/sysconfig.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [SysconfigController],
  providers: [...sysconfigProviders, SysconfigService],
  exports: [SysconfigService],
})
export class SysconfigModule {}
