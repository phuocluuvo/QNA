import { faker } from "@faker-js/faker";
import { QuestionListType, QuestionType } from "../type/Question.type";
import users from "./UserData.mock";
import tagList from "./TagData.mock";
import { AnswerListType } from "../type/Answer.type";
import answerList from "./AnswareDataList.mock";

function generateRandomQuestionDataList(id: number): QuestionType {
  const title = faker.lorem.sentence();
  const content = faker.lorem.paragraphs({ min: 4, max: 30 }, "\n");
  const user = users[Math.floor(Math.random() * 10)];
  const tags = tagList(Math.floor(Math.random() * 5));
  const images = [{ url: faker.image.urlPicsumPhotos() }];
  const status = faker.datatype.boolean() ? 1 : 0;
  const createdAt = faker.date.past().toISOString();
  const updatedDate = faker.date.recent().toISOString();
  const votes = faker.number.int({ min: 0, max: 1000 });
  const views = faker.number.int({ min: 0, max: 10000 });
  const answerNumber = faker.number.int({ min: 0, max: 1000 });
  const _answerList: AnswerListType = answerList;

  return {
    id,
    title,
    content,
    user,
    tags,
    status,
    createdAt,
    updatedDate,
    votes,
    views,
    images,
    answerNumber,
    answerList: _answerList,
  };
}

const questionDataList: QuestionListType = {
  items: [],
  pagination: {
    currentPage: 1,
    totalPageNumber: 1,
  },
};
const random = Math.floor(Math.random() * 20) + 10;
for (let i = 1; i <= random; i++) {
  const question = generateRandomQuestionDataList(i);
  questionDataList.items.push(question);
}

export default questionDataList;
