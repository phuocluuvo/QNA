import { Status } from "@/util/type/Status.type";
import { UserType } from "../type/User.type";
import { faker } from "@faker-js/faker";
function generateRandomUserData(id: number): UserType {
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const dob = faker.date.birthdate().toLocaleDateString();
  const status = faker.datatype.boolean() ? Status.ACTIVE : Status.INACTIVE;
  const avatar = `https://i.pravatar.cc/300?u=${email}`;
  const password = faker.internet.password();

  return { id, name, email, dob, status, avatar, password };
}

let myUser = {
  id: 123456,
  name: "Louis Vincent",
  email: "vincentlouis0702@gmail.com",
  dob: "07/02/2001",
  status: Status.ACTIVE,
  avatar: "https://scontent.fsgn5-6.fna.fbcdn.net/v/t39.30808-6/328620063_1504263593436271_2354880114894454552_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=Awbbh2MBMREAX-oXLzW&_nc_ht=scontent.fsgn5-6.fna&oh=00_AfCqbFRErta-SPovXt6g1nPa06MK0D1j9UvvBTOW1hTeiA&oe=6514AADC",
  password: "123456!Az",
};

const users: UserType[] = [];

for (let i = 1; i <= 10; i++) {
  const user = generateRandomUserData(i);
  users.push(user);
}
export const myUserLogin = myUser;

users.push(myUser);

export default users;
