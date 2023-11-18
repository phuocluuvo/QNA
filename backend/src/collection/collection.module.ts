import { Module } from "@nestjs/common";
import { CollectionController } from "./collection.controller";
import { CollectionService } from "./collection.service";
import { DatabaseModule } from "../database/database.module";
import { collectionProviders } from "./providers/collection.providers";
import { CaslModule } from "../casl/casl.module";

@Module({
  imports: [DatabaseModule, CaslModule],
  controllers: [CollectionController],
  providers: [...collectionProviders, CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
