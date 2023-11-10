import { DataSource } from "typeorm";
import { databaseConfig } from "../config/typeorm.config";
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
  StorageDriver,
} from "typeorm-transactional";

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async (): Promise<DataSource> => {
      const dataSource: DataSource = new DataSource(databaseConfig);
      initializeTransactionalContext({
        storageDriver: StorageDriver.ASYNC_LOCAL_STORAGE,
      });
      addTransactionalDataSource(dataSource);

      return dataSource.initialize();
    },
  },
];
