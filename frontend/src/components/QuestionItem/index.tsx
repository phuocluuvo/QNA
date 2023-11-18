"use client";
import { Colors } from "@/assets/constant/Colors";
import {
  Avatar,
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
import helper from "@/util/helper";
import { QuestionType } from "@/util/type/Question.type";
import { useRouter } from "next/router";
import Author from "../Author";
import TagQuestion from "../TagQuestion";
import moment from "moment";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { CheckIcon } from "@chakra-ui/icons";
function QuestionItem({
  question,
  isDarkMode,
  onClick,
  isLast,
  isVerifyItem,
}: {
  question: QuestionType;
  isDarkMode?: boolean;
  onClick?: () => void;
  isLast?: boolean;
  isVerifyItem?: boolean;
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
      w={{ base: "80%", md: "fit-content" }}
      _hover={{
        boxShadow: "0 0 0 1px " + Colors(isDarkMode).BORDER,
      }}
      height={{ base: "auto", md: "auto" }}
      minW={{ base: "80vw", md: "80%" }}
      mb={2}
      // flex={{ base: 1, lg: isLast ? "none" : 1 }}
      flex={1}
      transition={"ease-in-out 0.2s"}
      p={{ base: 2, md: 3 }}
      bg={Colors(isDarkMode).PRIMARY_BG}
    >
      <Stack
        display={isVerifyItem ? "none" : "flex"}
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
      {!isVerifyItem && imageSource ? (
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
      <VStack
        key={question.id}
        spacing={1}
        flex={1}
        alignItems={"flex-start"}
        height={"100%"}
      >
        <Stack
          direction={
            isVerifyItem
              ? {
                  base: "column",
                  md: "row-reverse",
                }
              : {
                  base: "column",
                  md: "row",
                }
          }
          w={"full"}
          justifyContent={"space-between"}
        >
          {isVerifyItem && (
            <Text colorScheme="gray" fontSize={"xs"}>
              {question.id}
            </Text>
          )}
          <Link
            onClick={() => {
              typeof onClick === "function"
                ? onClick()
                : // @ts-ignore
                  router.push(router.basePath + `/question/${question.id}`);
            }}
            fontWeight={"bold"}
            maxW={"full"}
            noOfLines={1}
          >
            {moment(question.createdAt).isAfter(
              moment().subtract(3, "days")
            ) ? (
              <Tag mr="3">New</Tag>
            ) : (
              ""
            )}
            <span
              style={{
                display: !isVerifyItem ? "none" : "unset",
              }}
            >
              {getTranslate("TITLE")}:
            </span>{" "}
            {question.title}
          </Link>
        </Stack>
        <Text
          style={{
            display: !isVerifyItem ? "none" : "unset",
          }}
          fontSize={"xs"}
        >
          {getTranslate("CONTENT")}:
        </Text>
        <Box
          dangerouslySetInnerHTML={{
            __html: question.content.replace(/<img.*?>/g, ""),
          }}
          fontSize={"sm"}
          maxW={{ base: "xs", md: "md" }}
          noOfLines={2}
        />
        <HStack>
          {question.tagNames?.map((tag) => (
            <TagQuestion tag={tag} key={tag} />
          ))}
        </HStack>
        <HStack w={"full"}>
          <VStack spacing={0} alignItems={"flex-start"}>
            <Spacer />
            <Author
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
          </VStack>
          <Spacer />
        </HStack>
      </VStack>
    </Stack>
  );
}

export default QuestionItem;
