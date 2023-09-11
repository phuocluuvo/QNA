import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import ErrorContent from "@/components/Error";
import LinkButton from "@/components/LinkButton";
import VoteButton from "@/components/VoteButton";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import QuestionDataList from "@/util/mock/QuestionDataList.mock";
import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Image,
  Spacer,
  Tag,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function Question() {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const router = useRouter();
  const { id } = router.query;
  const { colorMode } = useColorMode();
  const [state, setState] = useState({
    // @ts-ignore
    count: QuestionDataList.postList.at(id - 1)?.voteNumber ?? 0,
    // @ts-ignore
    question: QuestionDataList.postList.at(id - 1),
    isDarkMode: colorMode === "dark",
  });

  useEffect(() => {
    // @ts-ignore
    let data = QuestionDataList.postList.at(id - 1);
    // @ts-ignore
    setState((oldState) => helper.mappingState(oldState, { question: data }));
  }, [id]);

  const parseLines = (value: string) => value.replace(/(\\n)/g, "\n");
  if (!state.question) {
    return (
      <ErrorContent
        errorTitle={getTranslate("ERROR_TITLE")}
        errorMessage={getTranslate("ERROR_MESSAGE")}
      />
    );
  }
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <>
      <Head>
        <title>{state.question.title}</title>
        <meta
          name={state.question.title}
          content="The website answers the question about IT"
        />
      </Head>
      <Container maxW={{ base: "fit-content", md: "80%" }}>
        <HStack alignItems={"start"}>
          <VStack spacing={0} mr={2} pos={"sticky"} top={{ base: 28, md: 20 }}>
            {/* up vote */}
            <VoteButton
              isDarkMode={state.isDarkMode}
              type="up"
              onClick={() =>
                // @ts-ignore
                setState((oldState) =>
                  helper.mappingState(oldState, { count: state.count + 1 })
                )
              }
            />
            <Heading size={"md"}>{helper.numberFormat(state.count)}</Heading>
            <VoteButton
              isDarkMode={state.isDarkMode}
              type="down"
              onClick={() =>
                // @ts-ignore
                setState((oldState) =>
                  helper.mappingState(oldState, { count: state.count - 1 })
                )
              }
            />
            <VStack py={5}>
              <ChatIcon />
              <Text>{state.question.answerNumber}</Text>
              <ViewIcon />
              <Text>{state.question.viewsNumber}</Text>
            </VStack>
          </VStack>
          <Box>
            <Box>
              <LinkButton
                text={getTranslate("GOBACK")}
                href={"/"}
                style={{
                  width: "fit-content",
                  mx: 0,
                  px: 0,
                }}
                textStyle={{
                  minW: "fit-content",
                }}
                onClick={() => router.push("/")}
              />
              <Flex direction={"column"} mb={"10"}>
                <Box>
                  <Heading>{state.question.title}</Heading>
                  <HStack>
                    {state.question.tags?.map((tag) => (
                      <Tag
                        key={tag.id}
                        size={"md"}
                        colorScheme={"telegram"}
                        py={1}
                        px={2}
                        my={2}
                        rounded={"full"}
                        cursor={"pointer"}
                        _hover={{
                          bgColor: "orange.400",
                          color: "white",
                          transition: "all 0.3s ease-in-out",
                        }}
                        onClick={() => router.push(`/tag/${tag.id}`)}
                      >
                        {tag.name}
                      </Tag>
                    ))}
                  </HStack>
                </Box>
                <Spacer />
                {/* author */}
                <HStack rounded={"md"} py={1} height={20}>
                  <Avatar
                    size={"sm"}
                    name={state.question.user.name}
                    src={state.question.user.avatar}
                  />
                  <VStack alignItems={"start"} spacing={0}>
                    {/* @ts-ignore */}
                    <Text fontSize={"xs"}>
                      {getTranslate("ASKED_AT").replace(
                        "{0}",
                        helper.formatDate(
                          state.question.createdDate,
                          false,
                          "H:mm A - ddd, DD/MM/YYYY"
                        )
                      )}
                    </Text>
                    <Text fontSize={"xs"}>{state.question.user.name}</Text>
                  </VStack>
                </HStack>
              </Flex>
            </Box>
            <Image
              src={state.question.images?.at(0)?.url}
              style={{
                margin: "auto",
                marginBlock: "20px",
              }}
            />
            {/* display raw text */}

            <Text aria-multiline={true} textAlign={"justify"}>
              {parseLines(state.question.content)}
            </Text>
          </Box>
        </HStack>
      </Container>
    </>
  );
}

export default Question;
