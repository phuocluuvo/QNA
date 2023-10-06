"use client";
import { Colors } from "@/assets/constant/Colors";
import {
  Avatar,
  Box,
  HStack,
  Heading,
  Image,
  Spacer,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import VoteButton from "../VoteButton";
import helper from "@/util/helper";
import { PostType } from "@/util/type/Post.type";
import { useRouter } from "next/router";
import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import Author from "../Author";
import TagQuestion from "../TagQuestion";
function QuestionItem({
  question,
  isDarkMode,
  onClick,
  isLast,
}: {
  question: PostType;
  isDarkMode?: boolean;
  onClick?: () => void;
  isLast?: boolean;
}) {
  const [count, setCount] = React.useState(question.voteNumber);
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
      mx={{ base: 2, md: 1 }}
      rounded={"md"}
      minW={{ base: "80%", md: "fit-content" }}
      _hover={{
        boxShadow: "0 0 0 1px " + Colors(isDarkMode).BORDER,
      }}
      height={170}
      w={{ base: "80%", md: "fit-content" }}
      mb={2}
      flex={{ base: 1, lg: isLast ? "none" : 1 }}
      transition={"ease-in-out 0.2s"}
      p={3}
      bg={Colors(isDarkMode).PRIMARY_BG}
    >
      <VStack spacing={0}>
        {/* up vote */}
        <VoteButton
          isDarkMode={isDarkMode}
          type="up"
          onClick={() => setCount(count + 1)}
        />
        <Heading size={"md"}>{helper.numberFormat(count)}</Heading>
        <VoteButton
          isDarkMode={isDarkMode}
          type="down"
          onClick={() => setCount(count - 1)}
        />
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
        alignItems={"flex-start"}
        onClick={() => {
          onClick
            ? onClick
            : // @ts-ignore
              router.push(router.basePath + `/question/${question.id}`);
        }}
        cursor={"pointer"}
      >
        <Text fontWeight={"bold"} maxW={"full"} noOfLines={1}>
          {question.title}
        </Text>
        <Box
          dangerouslySetInnerHTML={{
            __html: question.content.replace(/<img.*?>/g, ""),
          }}
          fontSize={"sm"}
          maxW={"full"}
          noOfLines={2}
        >
          {/* {question.content} */}
        </Box>
        <HStack>
          {question.tags?.map((tag) => (
            <TagQuestion tag={tag} key={tag.id} />
          ))}
        </HStack>
        <HStack w={"full"}>
          <VStack spacing={0} alignItems={"flex-start"}>
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
              bottomText={helper.formatDate(question.createdDate, true)}
              bottomTextStyle={{
                color: "gray.500",
                fontSize: "xs",
                noOfLines: { base: 1, md: 2 },
              }}
            />
          </VStack>
          <Spacer />
          <HStack flex={1} alignItems="flex-end" justifyContent={"end"}>
            <Text
              display={{ base: "flex", md: "inline" }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginRight: "10px",
              }}
            >
              {helper.numberFormat(
                question.answerNumber ? question.answerNumber : 0
              )}{" "}
              <ChatIcon />
            </Text>
            <Text
              display={{ base: "flex", md: "inline" }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginRight: "10px",
              }}
            >
              {helper.numberFormat(
                question.viewsNumber ? question.viewsNumber : 0
              )}{" "}
              <ViewIcon />
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </HStack>
  );
}

export default QuestionItem;
