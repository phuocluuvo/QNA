import { Pages } from "@/assets/constant/Pages";
import CensoringQuestionEditor from "@/components/CensoringQuestionEditor";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { QuestionType } from "@/util/type/Question.type";
import {
  HStack,
  Flex,
  VStack,
  Spacer,
  Divider,
  Button,
  Text,
  Box,
  styled,
  Stack,
  Collapse,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

function TabQuestionCensoring({ question }: { question: QuestionType }) {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const [isCheckExplict, setIsCheckExplict] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isShowEditor, setIsShowEditor] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={4}
      alignItems={"start"}
      mb={10}
    >
      <Box width={"full"}>
        <Box>
          <HStack rounded={"md"} py={1} w={"fit-content"}>
            {/* Author info */}
            <Box display={"flex"} flexDirection={"column"}>
              <Text>
                <SpanTitle>AuthorId:</SpanTitle>
                {question.user.id}
              </Text>
              <Text>
                <SpanTitle>Name:</SpanTitle>
                {question.user.fullname}
              </Text>
              <Text>
                <SpanTitle>Email:</SpanTitle>
                {question.user.email}
              </Text>
              <Text fontWeight={"bold"}>
                <SpanTitle>{getTranslate("CRATED_AT")}:</SpanTitle>
                {helper.formatDate(
                  question.createdAt,
                  false,
                  "hh:mm:ss DD/MM/YYYY"
                )}
              </Text>
            </Box>
          </HStack>
          <Divider my={2} />
          <Flex w={"full"} direction={"column"}>
            <Box width={"full"}>
              <VStack
                pos={"relative"}
                alignItems={"start"}
                justifyContent={"space-between"}
                width={"full"}
                mb={5}
              >
                <Text>QuesionId:</Text>
                <Text fontWeight={"bold"}>{question.id}</Text>
                <Text>{getTranslate("TITLE")}:</Text>
                <Text flex={1} fontWeight={"medium"}>
                  {question.title}
                </Text>
              </VStack>
            </Box>
          </Flex>
        </Box>
        <Text>{getTranslate("CONTENT")}:</Text>

        <Box
          dangerouslySetInnerHTML={{
            __html: question.content
              .replace(/<img/g, '<img style="max-width:100%;height:auto;"')
              .replace(
                /<pre/g,
                '<pre style="overflow:scroll;background-color:#1a202c;color:#fff;white-space:pre-wrap;"'
              ),
          }}
          fontSize={"sm"}
          maxW={"full"}
        />
      </Box>
      <Divider orientation="vertical" />
      <Box
        pos={"sticky"}
        top={20}
        display={"flex"}
        flex={1}
        minW={"30vw"}
        flexDirection={"column"}
      >
        <Collapse in={isShowEditor}>
          <CensoringQuestionEditor
            questionId={question.id}
            getTranslate={getTranslate}
            getResult={(res) => {
              console.log("res: ", res);
            }}
          />
        </Collapse>
        <VStack alignItems={"start"}>
          <HStack py={2} divider={<Divider orientation="vertical" />}>
            <Button colorScheme="green" size={"sm"} onClick={() => {}}>
              {getTranslate("CENSORE")}
            </Button>
            <Button
              colorScheme="red"
              size={"sm"}
              onClick={() => {
                setIsShowEditor(!isShowEditor);
              }}
            >
              {getTranslate("REJECT")}
            </Button>
          </HStack>
          <HStack alignItems={"start"}>
            <Text>
              {isCheckExplict
                ? helper.checkExplictWords(question.content.toLowerCase())
                    .isExplict
                  ? getTranslate("INCLUDE_EXPLICT_WORDS")
                  : getTranslate("GOOD_TO_GO")
                : null}
            </Text>
            <Button
              variant={"link"}
              colorScheme={
                isCheckExplict
                  ? helper.checkExplictWords(question.content.toLowerCase())
                      .isExplict
                    ? "red"
                    : "green"
                  : "gray"
              }
              onClick={() => {
                setIsCheckExplict(true);
              }}
            >
              {getTranslate("CHECK_EXPLICT_CONTENT")}
            </Button>
          </HStack>
          {isCheckExplict && (
            <VStack alignItems={"start"}>
              {helper.checkExplictWords(question.content.toLowerCase())
                .isExplict && (
                <>
                  <Text>Explict words:</Text>
                  <Text>
                    {helper
                      .checkExplictWords(question.content.toLowerCase())
                      .explictWords.join(", ")}
                  </Text>
                </>
              )}
            </VStack>
          )}
        </VStack>
      </Box>
    </Stack>
  );
}
const SpanTitle = styled("span", {
  baseStyle: {
    mr: 2,
    fontWeight: "bold",
  },
});

export default TabQuestionCensoring;
