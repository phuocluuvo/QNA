"use client";
import { Colors } from "@/assets/constant/Colors";
import {
  Avatar,
  Box,
  HStack,
  Heading,
  Image,
  Link,
  Spacer,
  Tag,
  Text,
  VStack,
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
function QuestionItem({
  question,
  isDarkMode,
  onClick,
  isLast,
}: {
  question: QuestionType;
  isDarkMode?: boolean;
  onClick?: () => void;
  isLast?: boolean;
}) {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const router = useRouter();
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
    <HStack
      mx={{ base: 0, md: 1 }}
      rounded={"md"}
      minW={{ base: "80%", md: "fit-content" }}
      _hover={{
        boxShadow: "0 0 0 1px " + Colors(isDarkMode).BORDER,
      }}
      height={{ base: 190, md: 170 }}
      w={{ base: "80%", md: "fit-content" }}
      mb={2}
      // flex={{ base: 1, lg: isLast ? "none" : 1 }}
      flex={1}
      transition={"ease-in-out 0.2s"}
      p={{ base: 2, md: 3 }}
      bg={Colors(isDarkMode).PRIMARY_BG}
    >
      <VStack
        spacing={0}
        style={{
          borderRight: "1px solid " + Colors(isDarkMode).BORDER,
          paddingRight: "10px",
          marginRight: "10px",
        }}
      >
        {/* up vote */}
        <Text fontSize={"xs"} opacity={0.4}>
          {getTranslate("VOTES")}
        </Text>
        <Heading size={"md"}>{helper.numberFormat(question.votes)}</Heading>
        <Text fontSize={"xs"} opacity={0.4}>
          {getTranslate("ANSWERS")}
        </Text>
        <Text>{helper.numberFormat(question.answersNumber || 0)}</Text>
        <Text fontSize={"xs"} opacity={0.4}>
          {getTranslate("VISITS")}
        </Text>
        <Text>{helper.numberFormat(question.views ? question.views : 0)}</Text>
      </VStack>
      {imageSource ? (
        <Image
          src={imageSource}
          alt="Picture of the author"
          width={150}
          display={{ base: "none", md: "block" }}
          height={300}
          rounded={"md"}
          style={{
            maxHeight: "150px",
            maxWidth: "200px",
            marginBlock: "20px",
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
        <Link
          onClick={() => {
            onClick
              ? onClick
              : // @ts-ignore
                router.push(router.basePath + `/question/${question.id}`);
          }}
          fontWeight={"bold"}
          maxW={"full"}
          noOfLines={1}
        >
          {moment(question.createdAt).isAfter(moment().subtract(3, "days")) ? (
            <Tag mr="3">New</Tag>
          ) : (
            ""
          )}
          {question.title}
        </Link>
        <Box
          dangerouslySetInnerHTML={{
            __html: question.content.replace(/<img.*?>/g, ""),
          }}
          fontSize={"sm"}
          maxW={"full"}
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
              bottomText={helper.formatDate(question.createdAt, true)}
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
    </HStack>
  );
}

export default QuestionItem;
