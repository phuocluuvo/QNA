import { Status } from "@/util/type/Status.type";
import { UserType } from "../type/User.type";
import { faker } from '@faker-js/faker';
export const UserData: UserType = {
  id: 1,
  name: "John Doe",
  email: "john@doe.com",
  dob: "01/01/2000",
  status: Status.ACTIVE,
  avatar: "https://i.pravatar.cc/300",
};
function generateRandomUserData(id: number): UserType {
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const dob = faker.date.birthdate().toLocaleDateString();
  const status = faker.datatype.boolean() ? Status.ACTIVE : Status.INACTIVE;
  const avatar = `https://i.pravatar.cc/300?u=${email}`;

  return { id, name, email, dob, status, avatar };
}

const users: UserType[] = [];

for (let i = 1; i <= 10; i++) {
  const user = generateRandomUserData(i);
  users.push(user);
}

export default users;
