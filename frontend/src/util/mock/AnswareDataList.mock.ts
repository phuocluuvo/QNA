import { faker } from "@faker-js/faker";
import { AnswerListType, AnswerType } from "../type/Answer.type";
import users from "./UserData.mock";

interface Answer {
  id: number | string;
  content: string;
  voteNumber: number;
  createdDate: string;
  updatedDate: string;
  status: number;
  user: string;
}

interface AnswerList {
  answerList: Answer[];
  pagination: {
    currentPage: number;
    totalPageNumber: number;
  };
}

function generateAnswerList(): AnswerListType {
  const answerList: Array<AnswerType> = [];
  const totalPageNumber = faker.number.int({ min: 1, max: 10 });
  const currentPage = faker.number.int({ min: 1, max: totalPageNumber });

  for (let i = 0; i < 10; i++) {
    const answer: AnswerType = {
      id: faker.database.mongodbObjectId(),
      content: faker.lorem.paragraphs(
        faker.number.int({ min: 1, max: 3 }),
        "\n"
      ),
      voteNumber: faker.number.int({ min: 0, max: 1000 }),
      createdDate: faker.date.past().toISOString(),
      updatedDate: faker.date.recent().toISOString(),
      status: faker.datatype.boolean() ? 1 : 0,
      user: { ...users[1] },
    };
    answerList.push(answer);
  }

  return {
    answerList,
    pagination: {
      currentPage,
      totalPageNumber,
    },
  };
}

const answerList = generateAnswerList();
export default answerList;
