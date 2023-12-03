import { UserType } from "@/util/type/User.type";
import {
  Avatar,
  HStack,
  VStack,
  Text,
  TextProps,
  BoxProps,
  ResponsiveValue,
  Heading,
  Badge,
  useColorMode,
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
  type?: "simple" | "normal";
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
  type = "normal",
}: AuthorProps) {
  const { colorMode } = useColorMode();
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
        size={sizeAvatar ?? "xs"}
        name={user.fullname}
        src={user.avatar}
      />
      <VStack alignItems={"start"} spacing={0}>
        {user.role !== "user" && type !== "simple" ? (
          <Badge
            colorScheme={
              user.role === "admin"
                ? "red"
                : user.role === "moderator"
                ? "blue"
                : "whatsapp"
            }
            // @ts-ignore
            fontSize={{
              sm: "xs",
              md: sizeAvatar ?? "xs",
            }}
          >
            {user.role}
          </Badge>
        ) : null}
        <HStack>
          <Text
            {...nameStyle}
            // @ts-ignore
            fontSize={{
              sm: "xs",
              md: sizeAvatar ?? "xs",
            }}
            cursor={"pointer"}
            // colorScheme="blue"
            color={colorMode === "dark" ? "lightblue" : "blue.500"}
            onClick={() => {
              onClick ? onClick() : router.push(`/user/${user.id}`);
            }}
          >
            {user.fullname}
          </Text>{" "}
          <Heading
            fontSize={sizeAvatar ?? "xs"}
            color={colorMode === "dark" ? "yellow" : "orange"}
          >
            {user.activityPoint}
          </Heading>
          {user.role !== "user" && type === "simple" ? (
            <Badge
              colorScheme={
                user.role === "admin"
                  ? "red"
                  : user.role === "moderator"
                  ? "blue"
                  : "whatsapp"
              }
            >
              {user.role}
            </Badge>
          ) : null}
        </HStack>
        {/* @ts-ignore */}
        {headingText ? (
          <Text
            {...headingTextStyle}
            // @ts-ignore
            fontSize={{
              sm: "xs",
              md: sizeAvatar ?? "xs",
            }}
          >
            {headingText}
          </Text>
        ) : null}

        {bottomText ? (
          <Text
            {...bottomTextStyle}
            // @ts-ignore
            fontSize={{
              sm: "xs",
              md: sizeAvatar ?? "xs",
            }}
          >
            {bottomText}
          </Text>
        ) : null}
      </VStack>
    </HStack>
  );
}

export default Author;
