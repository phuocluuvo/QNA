import { UserType } from "@/util/type/User.type";
import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

function UserItem({ user }: { user: UserType }) {
  const router = useRouter();
  return (
    <HStack
      w={{ base: "100%", md: "48%", xl: "23%" }}
      key={user.id}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
      }}
      _hover={{
        boxShadow: "0 0 0 2px orange",
        transition: "all 0.2s ease-in-out",
      }}
      display={"flex"}
      transition={"all 0.2s ease-in-out"}
      cursor={"pointer"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
    >
      <Avatar src={user.avatar} name={user.fullname} />
      <VStack
        spacing={0}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
      >
        <Button
          variant={"link"}
          onClick={() => {
            router.push(`/users/${user.id}`);
          }}
          noOfLines={1}
          style={{
            width: "fit-content",
            maxWidth: "full",
          }}
        >
          {user.fullname}
        </Button>
        <Text colorScheme="orange" fontSize={"sm"} fontWeight={"bold"}>
          {user.activityPoint}
        </Text>
        {user?.role === "admin" ? <Badge>Admin</Badge> : <Spacer />}
      </VStack>
    </HStack>
  );
}

export default UserItem;
