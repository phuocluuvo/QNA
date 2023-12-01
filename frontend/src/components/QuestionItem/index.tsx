"use client";
import { Colors } from "@/assets/constant/Colors";
import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Link,
  Spacer,
  Stack,
  Tag,
  Text,
  Tooltip,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import helper, {
  markdownToPlainText,
  removeVietnameseTones,
} from "@/util/helper";
import { QuestionType } from "@/util/type/Question.type";
import { useRouter } from "next/router";
import Author from "../Author";
import TagQuestion from "../TagQuestion";
import moment from "moment";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import dynamic from "next/dynamic";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function QuestionItem({
  question,
  isDarkMode,
  onClick,
  isLast,
  isVerifyItem,
  type = "normal",
}: {
  question: QuestionType;
  isDarkMode?: boolean;
  onClick?: () => void;
  isLast?: boolean;
  isVerifyItem?: boolean;
  type?: "minimals" | "normal";
}) {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const router = useRouter();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const hasImage = /<img.*?src="(.*?)"/.test(question.content);
  let contentSource = question.content;
  let imageSource = "";
  if (hasImage) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = question.content;
    const imageElement = tempElement.querySelector("img");
    if (imageElement) {
      imageSource = imageElement.src;
    }
    contentSource = tempElement.innerText;
  }
  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      mx={{ base: 0, md: 1 }}
      rounded={"md"}
      w={"full"}
      _hover={{
        boxShadow: "0 0 0 1px " + Colors(isDarkMode).BORDER,
      }}
      minW={
        type === "minimals"
          ? {
              base: "200px",
              md: "200px",
            }
          : { base: "80vw", md: "80%" }
      }
      mb={type === "minimals" ? 0 : 2}
      flex={1}
      transition={"ease-in-out 0.2s"}
      p={2}
      bg={Colors(isDarkMode).PRIMARY_BG}
    >
      <Stack
        display={type === "minimals" ? "none" : "flex"}
        direction={{
          base: "row",
          md: "column",
        }}
        spacing={0}
        style={{
          borderRight: "1px solid " + Colors(isDarkMode).BORDER,
          paddingRight: "10px",
          marginRight: "10px",
          justifyContent: "center",
          alignItems: "center",
          ...(isMobile && {
            borderRight: "none",
            gap: "20px",
            borderTop: "1px solid " + Colors(isDarkMode).BORDER,
            paddingTop: "10px",
          }),
        }}
      >
        {/* up vote */}
        <Text fontSize={"xs"} opacity={0.4} noOfLines={1}>
          {getTranslate("VOTES")}
        </Text>
        <Heading size={"md"}>{helper.numberFormat(question.votes)}</Heading>
        <Text fontSize={"xs"} opacity={0.4} noOfLines={1}>
          {getTranslate("ANSWERS")}
        </Text>
        <Tooltip
          label={
            question.type === "normal"
              ? "This question has approved answer"
              : null
          }
          hasArrow
        >
          <Button
            px={0}
            colorScheme={question.type === "normal" ? "green" : "gray"}
          >
            {helper.numberFormat(question.answersNumber || 0)}
          </Button>
        </Tooltip>
        <Text fontSize={"xs"} opacity={0.4} noOfLines={1}>
          {getTranslate("VISITS")}
        </Text>
        <Text>{helper.numberFormat(question.views ? question.views : 0)}</Text>
      </Stack>
      {type === "normal" && imageSource ? (
        <Image
          src={imageSource}
          alt="Picture of the author"
          width={100}
          display={{ base: "none", md: "block" }}
          // height={'100%'}
          aspectRatio={1 / 1}
          rounded={"md"}
          style={{
            marginRight: "10px",
            objectFit: "cover",
          }}
        />
      ) : null}
      <Stack
        key={question.id}
        spacing={1}
        flex={1}
        alignItems={"flex-start"}
        direction={type === "minimals" ? "row" : "column"}
      >
        <Tag
          display={type === "minimals" ? "block" : "none"}
          m="auto"
          mr={2}
          p={"3"}
          fontSize={"xl"}
          colorScheme="green"
          justifyItems={"center"}
          alignItems={"center"}
          textAlign={"center"}
        >
          {question.votes}
        </Tag>
        <Stack direction={"column"} w={"full"} justifyContent={"space-between"}>
          <Tooltip
            hasArrow
            label={"This question is blocked due to violation of the rules"}
          >
            <Badge
              colorScheme={question.state === "blocked" ? "red" : "green"}
              display={question.state === "blocked" ? "block" : "none"}
              w={"fit-content"}
            >
              {question.state}
            </Badge>
          </Tooltip>
          <Text
            _hover={{
              textDecoration: "underline",
            }}
            as={"a"}
           href={router.basePath + `/question/${question.id}/${removeVietnameseTones(question.title)}`}
            fontWeight={"semibold"}
            maxW={"lg"}
            w={type === "minimals" ? "100%" : "60vw"}
            isTruncated
            paddingTop={{
              base: 0,
              md: 2,
            }}
            fontSize={"lg"}
          >
            <span
              style={{
                display:
                  !isVerifyItem || type === "minimals" ? "none" : "unset",
              }}
            >
              {getTranslate("TITLE")}:
            </span>{" "}
            {question.title}
          </Text>
        </Stack>{" "}
        <Text
          style={{
            display: type === "normal" ? "none" : "unset",
            minWidth: "fit-content",
          }}
        >
          {helper.formatDate(question.createdAt, false, "ddd, DD/MM/YYYY")}
        </Text>
        {type === "minimals" ? null : (
          <Text w={"full"} noOfLines={2} fontSize={"sm"} opacity={0.8}>
            {markdownToPlainText(question.content)}
          </Text>
        )}
        <Spacer />
        {type === "minimals" ? null : (
          <HStack w={"full"} alignItems={"flex-end"} pb={2}>
            <HStack flexWrap={"wrap"}>
              {question.tagNames?.map((tag) => (
                <TagQuestion tag={tag} key={tag} />
              ))}
            </HStack>
            <Spacer />

            <Author
              type="simple"
              user={question.user}
              nameStyle={{
                fontWeight: "bold",
                fontSize: "sm",
                noOfLines: { base: 1, md: 2 },
                _hover: {
                  textDecoration: "underline",
                },
              }}
              headingText={getTranslate("ASKED_AT").replace(
                "{0}",
                helper.formatDate(
                  question.createdAt,
                  false,
                  "H:mm A - ddd, DD/MM/YYYY"
                )
              )}
              bottomTextStyle={{
                color: "gray.500",
                fontSize: "xs",
                noOfLines: { base: 1, md: 2 },
              }}
            />
          </HStack>
        )}
      </Stack>
    </Stack>
  );
}

export default QuestionItem;
