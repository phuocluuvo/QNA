import { faker } from "@faker-js/faker";
import { TagType } from "../type/Tag.type";

const tagList: TagType[] = [];

for (let i = 1; i <= 10; i++) {
  const tag: TagType = {
    id: i,
    name: faker.lorem.word(),
    status: faker.datatype.boolean() ? 1 : 0,
  };
  tagList.push(tag);
}

const generateRandomTagData = (numberOfTag: number): TagType[] => {
  const tagList: TagType[] = [];
  for (let i = 1; i <= numberOfTag; i++) {
    const tag: TagType = {
      id: i,
      name: faker.lorem.word(),
      status: faker.datatype.boolean() ? 1 : 0,
    };
    tagList.push(tag);
  }
  return tagList;
};

export default generateRandomTagData;
