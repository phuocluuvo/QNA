import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { UserType } from "@/util/type/User.type";
import { LinkIcon, TimeIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { BiCake, BiLocationPlus, BiMapPin } from "react-icons/bi";
import { FaFacebook, FaGithub, FaTwitter } from "react-icons/fa";
const DEFAULT_USER: UserType = {
  fullname: "",
  email: "",
  id: "",
  createdAt: "",
  dob: "",
  updatedAt: "",
  username: "",
  avatar: "",
  activityPoint: 0,
  role: "user",
};
function UserInfoProfile({ user }: { user: UserType }) {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  function getFormatedDateFromNow(date: string | undefined) {
    return moment(date).diff(moment(), "minutes") > -60
      ? moment(date).diff(moment(), "minutes") * -1
      : moment(date).diff(moment(), "hours") > -24
      ? moment(date).diff(moment(), "hours") * -1
      : moment(date).diff(moment(), "days") * -1;
  }
  function getFormatedUnitFromNow(date: string | undefined) {
    return moment(date).diff(moment(), "minutes") > -60
      ? "minutes"
      : moment(date).diff(moment(), "hours") > -24
      ? "hours"
      : "days";
  }

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      maxW={"full"}
      justifyItems={"start"}
      my={2}
    >
      <Box pos="relative" w={"fit-content"}>
        <Avatar
          src={user.avatar ?? ""}
          boxSize={{
            base: "100px",
            md: "150px",
          }}
          objectFit="cover"
          borderRadius="12"
          name={user.fullname}
        />
        <Text
          cursor={"pointer"}
          fontSize={{
            base: "xs",
            md: "sm",
          }}
          onClick={() => {
            navigator.clipboard.writeText(user.username).then(() => {
              toast({
                title: "Copied",
                description: "Copied to clipboard",
                status: "success",
                duration: 800,
                isClosable: true,
                position: "top-right",
                size: "sm",
              });
            });
          }}
          pos={"absolute"}
          color={"whiteAlpha.900"}
          zIndex={2}
          bottom={2}
          left={2}
        >
          @{user.username}
        </Text>
        <Box
          style={{
            background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            width: "100%",
            height: "60px",
            borderRadius: "12px",
          }}
        />
      </Box>
      <VStack spacing={1} alignItems={"start"}>
        <HStack justifyItems={"flex-start"}>
          <Heading>{user.fullname}</Heading>
        </HStack>
        <HStack>
          <Text
            fontSize={{
              base: "xs",
              md: "sm",
            }}
          >
            {user.title}
          </Text>
          <BiMapPin
            style={{
              display: user.location ? "flex" : "none",
            }}
          />
          <Text>{user.location}</Text>
        </HStack>
        <Heading size={"sm"}>
          {user.activityPoint}{" "}
          <span
            style={{
              color: Colors(colorMode === "dark").PRIMARY,
            }}
          >
            {getTranslate("ACTIVITY_POINTS")}
          </span>
        </Heading>
        <Stack
          direction={{
            base: "column",
            md: "row",
          }}
          alignItems={"flex-start"}
          spacing={1}
          w={"full"}
        >
          <HStack justifyContent={"center"} minW={"fit-content"}>
            <BiCake />
            <Text
              fontSize={{
                base: "xs",
                md: "sm",
              }}
            >
              {`Member for ${getFormatedDateFromNow(user.createdAt)} 
        ${getFormatedUnitFromNow(user.createdAt)}`}
            </Text>
          </HStack>
          <HStack justifyContent={"center"} minW={"fit-content"}>
            <TimeIcon />
            <Text
              fontSize={{
                base: "xs",
                md: "sm",
              }}
            >
              {`Last seen ${getFormatedDateFromNow(user.updatedAt)} 
        ${getFormatedUnitFromNow(user.updatedAt)} ago`}
            </Text>
          </HStack>
        </Stack>
        <HStack>
          <IconButton
            display={user.githubLink ? "flex" : "none"}
            variant={"ghost"}
            aria-label="Github"
            onClick={() => {
              window.open(user.githubLink, "_blank");
            }}
            icon={<FaGithub />}
          />
          <IconButton
            display={user.twitterLink ? "flex" : "none"}
            variant={"ghost"}
            aria-label="Twitter"
            onClick={() => {
              window.open(user.twitterLink, "_blank");
            }}
            icon={<FaTwitter />}
          />
          <IconButton
            display={user.facebookLink ? "flex" : "none"}
            variant={"ghost"}
            aria-label="Facebook"
            onClick={() => {
              window.open(user.facebookLink, "_blank");
            }}
            icon={<FaFacebook />}
          />
          <IconButton
            display={user.websiteLink ? "flex" : "none"}
            variant={"ghost"}
            aria-label="Website"
            onClick={() => {
              window.open(user.websiteLink, "_blank");
            }}
            icon={<LinkIcon />}
          />
        </HStack>
      </VStack>
    </Stack>
  );
}

export default UserInfoProfile;
