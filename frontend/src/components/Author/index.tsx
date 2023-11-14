import { UserType } from "@/util/type/User.type";
import {
  Avatar,
  HStack,
  VStack,
  Text,
  TextProps,
  BoxProps,
  ResponsiveValue,
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
  /**
   * size of avatar
   */
  sizeAvatar?: ResponsiveValue<
    (string & {}) | "sm" | "md" | "lg" | "xl" | "2xl" | "xs" | "full" | "2xs"
  >;
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
  sizeAvatar,
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
      <Avatar
        size={sizeAvatar ?? "sm"}
        name={user.fullname}
        src={user.avatar}
      />
      <VStack alignItems={"start"} spacing={0}>
        {/* @ts-ignore */}
        {headingText ? (
          <Text {...headingTextStyle} fontSize={sizeAvatar ?? "xs"}>
            {headingText}
          </Text>
        ) : null}
        <Text
          {...nameStyle}
          fontSize={sizeAvatar ?? "xs"}
          cursor={"pointer"}
          onClick={() => {
            onClick ? onClick() : router.push(`/user/${user.id}`);
          }}
        >
          {user.fullname}
        </Text>
        {bottomText ? (
          <Text {...bottomTextStyle} fontSize={sizeAvatar ?? "xs"}>
            {bottomText}
          </Text>
        ) : null}
      </VStack>
    </HStack>
  );
}

export default Author;
