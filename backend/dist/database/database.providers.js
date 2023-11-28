"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../config/typeorm.config");
const typeorm_transactional_1 = require("typeorm-transactional");
exports.databaseProviders = [
    {
        provide: "DATA_SOURCE",
        useFactory: async () => {
            const dataSource = new typeorm_1.DataSource(typeorm_config_1.databaseConfig);
            (0, typeorm_transactional_1.initializeTransactionalContext)({
                storageDriver: typeorm_transactional_1.StorageDriver.ASYNC_LOCAL_STORAGE,
            });
            (0, typeorm_transactional_1.addTransactionalDataSource)(dataSource);
            return dataSource.initialize();
        },
    },
];
//# sourceMappingURL=database.providers.js.map