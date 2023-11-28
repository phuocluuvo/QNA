import { Collection } from "./enity/collection.entity";
import { Repository } from "typeorm";
export declare class CollectionService {
    private readonly collectionRepository;
    constructor(collectionRepository: Repository<Collection>);
    findAllCollection(userId: string): Promise<Collection[]>;
    findOneById(id: string): Promise<Collection>;
    findOneByName(name: string): Promise<Collection>;
    createCollection(name: string, userId: string): Promise<Collection>;
    update(id: string, name: string, collection: Collection): Promise<Collection>;
    delete(collection: Collection): Promise<Collection>;
}
