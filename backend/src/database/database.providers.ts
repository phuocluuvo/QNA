import { DataSource, DataSourceOptions, Int32 } from "typeorm";
import { databaseConfig } from "../config/typeorm.config";

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async (): Promise<DataSource> => {
            const dataSource: DataSource = new DataSource(databaseConfig);
            return dataSource.initialize();
        },
    },
];