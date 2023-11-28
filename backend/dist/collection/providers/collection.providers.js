"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionProviders = void 0;
const collection_entity_1 = require("../enity/collection.entity");
exports.collectionProviders = [
    {
        provide: "COLLECTION_REPOSITORY",
        useFactory: (dataSource) => dataSource.getRepository(collection_entity_1.Collection),
        inject: ["DATA_SOURCE"],
    },
];
//# sourceMappingURL=collection.providers.js.map