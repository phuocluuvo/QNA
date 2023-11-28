import { CollectionService } from "./collection.service";
import { CaslAbilityFactory } from "../casl/casl-ability.factory";
export declare class CollectionController {
    private readonly collectionService;
    private readonly caslAbilityFactory;
    constructor(collectionService: CollectionService, caslAbilityFactory: CaslAbilityFactory);
    findAllCollection(req: Request): Promise<import("./enity/collection.entity").Collection[]>;
    createCollection(name: string, req: Request): Promise<import("./enity/collection.entity").Collection>;
    updateCollection(id: string, name: string, req: Request): Promise<import("./enity/collection.entity").Collection>;
    deleteCollection(id: string, req: Request): Promise<import("./enity/collection.entity").Collection>;
}
