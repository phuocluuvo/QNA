import { ActionGetUserList } from "@/API/redux/actions/user/ActionGetUserList";
import { Pages } from "@/assets/constant/Pages";
import UserItem from "@/components/UserItem";
import { LanguageHelper } from "@/util/Language/Language.util";
import { UserListType } from "@/util/type/User.type";
import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";

function UsersListPage() {
  const [users, setUsers] = React.useState<UserListType | null>(null);
  const dispatch = useDispatch();
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );

  React.useEffect(() => {
    dispatch(
      // @ts-ignore
      ActionGetUserList(
        {
          limit: 5,
          page: 1,
        },
        (res: UserListType) => {
          console.log("UserListType", res.data);
          setUsers(res);
        },
        (err: any) => {}
      )
    );
  }, []);
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      style={{
        width: "full",
      }}
      flex={1}
    >
      {" "}
      <Heading size={"lg"} fontWeight={"medium"}>
        {getTranslate("USERS")}
      </Heading>
      {/* description */}
      <Text
        maxW={{ base: "100%", md: "50%" }}
        style={{
          marginBottom: "20px",
        }}
      >
        {getTranslate("USERS_DESCRIPTION")}
      </Text>
      <Flex
        flexDir={{ base: "column", md: "row" }}
        flexWrap={"wrap"}
        w={"full"}
        gap={5}
      >
        {users?.data.map((user, index) => (
          <UserItem user={user} />
        ))}
      </Flex>
    </Box>
  );
}

export default UsersListPage;
