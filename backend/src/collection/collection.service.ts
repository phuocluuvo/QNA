import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Collection } from "./enity/collection.entity";
import { Repository } from "typeorm";
import { message } from "../constants/message.constants";

@Injectable()
export class CollectionService {
  constructor(
    @Inject("COLLECTION_REPOSITORY")
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async findAllCollection(userId: string) {
    return this.collectionRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findOneById(id: string) {
    const collection = await this.collectionRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!collection) {
      throw new NotFoundException(message.NOT_FOUND.COLLECTION);
    }
    return collection;
  }

  async findOneByName(name: string) {
    return await this.collectionRepository.findOne({
      where: { name },
    });
  }

  async createCollection(name: string, userId: string) {
    const checkName = await this.findOneByName(name);
    if (checkName) {
      throw new NotFoundException(message.COLLECTION_NAME_IS_EXIST);
    }

    const collection = {};
    collection["name"] = name;
    collection["user"] = userId;
    return this.collectionRepository.save(collection);
  }

  async update(id: string, name: string, collection: Collection) {
    const checkName = await this.findOneByName(name);

    if (checkName && collection.name != name) {
      throw new NotFoundException(message.COLLECTION_NAME_IS_EXIST);
    }
    collection.name = name;
    return this.collectionRepository.save(collection);
  }

  async delete(collection: Collection) {
    return this.collectionRepository.remove(collection);
  }
}
