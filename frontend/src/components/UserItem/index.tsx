import { Colors } from "@/assets/constant/Colors";
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
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

function UserItem({ user }: { user: UserType }) {
  const router = useRouter();
  const { colorMode } = useColorMode();
  return (
    <HStack
      w={{ base: "100%", md: "48%", xl: "23%" }}
      key={user.id}
      style={{
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
            router.push(`/user/${user.id}`);
          }}
          noOfLines={1}
          style={{
            width: "fit-content",
            maxWidth: "full",
          }}
        >
          {user.fullname}
        </Button>
        <Text display={user.title ? "block" : "none"} fontSize={"sm"}>
          {user.title}
        </Text>
        <Text display={user.location ? "block" : "none"} fontSize={"sm"}>
          {user.location}
        </Text>
        <Text colorScheme="orange" fontSize={"sm"} fontWeight={"bold"}>
          {user.activityPoint}
        </Text>
        {user?.role !== "user" ? (
          <Badge colorScheme={user.role === "admin" ? "red" : "blue"}>
            {user?.role}
          </Badge>
        ) : (
          <Spacer />
        )}
      </VStack>
    </HStack>
  );
}

export default UserItem;
