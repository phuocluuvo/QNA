import { UserType } from "@/util/type/User.type";
import {
  Avatar,
  HStack,
  VStack,
  Text,
  TextProps,
  BoxProps,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

type AuthorProps = {
  user: UserType;
  headingText?: string;
  /**
   * will not render if headingText is not provided
   */
  headingTextStyle?: TextProps;
  bottomText?: string;
  /**
   * will not render if bottomText is not provided
   */
  bottomTextStyle?: TextProps;
  nameStyle?: TextProps;
  onClick?: () => void;
  containerStyle?: BoxProps;
};

function Author({
  user,
  headingText,
  headingTextStyle,
  nameStyle,
  onClick,
  containerStyle,
  bottomText,
  bottomTextStyle,
}: AuthorProps) {
  const router = useRouter();
  return (
    <HStack
      rounded={"md"}
      py={1}
      {...containerStyle}
      style={{
        transition: "all 0.2s ease-in-out",
        paddingInline: 10,
      }}
      cursor={"pointer"}
    >
      <Avatar size={"sm"} name={user.fullname} src={user.avatar} />
      <VStack alignItems={"start"} spacing={0}>
        {/* @ts-ignore */}
        {headingText ? (
          <Text {...headingTextStyle} fontSize={"xs"}>
            {headingText}
          </Text>
        ) : null}
        <Text
          {...nameStyle}
          fontSize={"xs"}
          cursor={"pointer"}
          onClick={() => {
            onClick ? onClick() : router.push(`/user/${user.id}`);
          }}
        >
          {user.fullname}
        </Text>
        {bottomText ? (
          <Text {...bottomTextStyle} fontSize={"xs"}>
            {bottomText}
          </Text>
        ) : null}
      </VStack>
    </HStack>
  );
}

export default Author;
