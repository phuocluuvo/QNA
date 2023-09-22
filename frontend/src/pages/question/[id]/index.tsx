"use client";
import actionGetQuestion from "@/API/redux/actions/ActionGetQuestion";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import AnswareItem from "@/components/AnswerItem";
import Author from "@/components/Author";
import ErrorContent from "@/components/Error";
import LinkButton from "@/components/LinkButton";
import TagQuestion from "@/components/TagQuestion";
import VoteButton from "@/components/VoteButton";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import QuestionDataList from "@/util/mock/QuestionDataList.mock";
import { PostType } from "@/util/type/Post.type";
import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Divider,
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
import { useDispatch } from "react-redux";
function Question() {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { id } = router.query;
  const [hydrated, setHydrated] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    let form = {
      id: Number(id),
    };
    dispatch(
      actionGetQuestion(
        form,
        (data) => {
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, {
              question: data,
              count: data.voteNumber,
            })
          );
        },
        () => {
          console.log("error");
        }
      )
    );
  }, [id]);
  const [state, setState] = useState<{
    count: number;
    question: PostType;
    isDarkMode: boolean;
  }>({
    count: 0,
    // @ts-ignore
    question: null,
    isDarkMode: colorMode === "dark",
  });
  const isDarkMode = colorMode === "dark";
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const parseLines = (value: string) => value.replace(/(\\n)/g, "\n");
  return (
    <>
      {state.question ? (
        <>
          <Head>
            <title>{state.question.title}</title>
            <meta
              name={state.question.title}
              content={state.question.content}
            />
          </Head>
          <Container maxW={{ base: "fit-content", md: "90%" }}>
            <Flex
              direction={{
                base: "column",
                md: "row",
              }}
            >
              <Box>
                <HStack alignItems={"start"} mb={10}>
                  <VStack
                    spacing={0}
                    mr={2}
                    pos={"sticky"}
                    top={{ base: 28, md: 20 }}
                  >
                    {/* up vote */}
                    <VoteButton
                      isDarkMode={isDarkMode}
                      type="up"
                      onClick={() =>
                        // @ts-ignore
                        setState((oldState) =>
                          helper.mappingState(oldState, {
                            count: state.count + 1,
                          })
                        )
                      }
                    />
                    <Heading size={"md"}>
                      {helper.numberFormat(state.count)}
                    </Heading>
                    <VoteButton
                      isDarkMode={isDarkMode}
                      type="down"
                      onClick={() =>
                        // @ts-ignore
                        setState((oldState) =>
                          helper.mappingState(oldState, {
                            count: state.count - 1,
                          })
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
                              <TagQuestion key={tag.id} tag={tag} />
                            ))}
                          </HStack>
                        </Box>
                        <Spacer />
                        {/* author */}
                        <HStack rounded={"md"} py={1} height={20}>
                          <Author
                            user={state.question.user}
                            headingText={getTranslate("ANSWERED_AT").replace(
                              "{0}",
                              helper.formatDate(
                                state.question.createdDate,
                                false,
                                "H:mm A - ddd, DD/MM/YYYY"
                              )
                            )}
                            nameStyle={{
                              color: "gray.500",
                              _hover: {
                                textDecoration: "underline",
                              },
                            }}
                          />
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

                    <Text aria-multiline={true}>
                      {state.question.content
                        ? parseLines(state.question.content)
                        : null}
                    </Text>
                  </Box>
                </HStack>
                <Box>
                  {state.question.answerList &&
                    state.question.answerList?.answerList.map((answer) => (
                      <AnswareItem
                        key={answer.id}
                        answer={answer}
                        getTranslate={getTranslate}
                      />
                    ))}
                </Box>
              </Box>
              <Box
                style={{
                  position: "sticky",
                  top: 90,
                  marginInline: "20px",
                  height: "fit-content",
                  borderRadius: "5px",
                  padding: "10px",
                  zIndex: 1,
                }}
                bg={Colors(colorMode === "dark").PRIMARY_BG}
              >
                <Heading size={"sm"}>Related questions</Heading>
                {QuestionDataList.postList.map(
                  (question, index) =>
                    index < 5 && (
                      <Box
                        key={index}
                        style={{
                          margin: "10px",
                          marginBlock: "20px",
                        }}
                        width={{ base: "full", md: "300px" }}
                      >
                        <HStack alignItems={"center"}>
                          <Box
                            my={"auto"}
                            p={2}
                            rounded="5px"
                            flex={0.2}
                            backgroundColor={Colors(isDarkMode).PRIMARY}
                          >
                            <Text color={"white"}>{question.voteNumber}</Text>
                          </Box>
                          <LinkButton
                            text={question.title}
                            href={`/question/${question.id}`}
                            style={{
                              width: "fit-content",
                              mx: 0,
                              px: 0,
                              flex: 1,
                            }}
                            textStyle={{
                              noOfLines: 2,
                              textAlign: "left",
                              maxW: "full",
                              fontWeight: "normal",
                            }}
                            onClick={() =>
                              router.push(`/question/${question.id}`)
                            }
                          />
                        </HStack>
                      </Box>
                    )
                )}
              </Box>
            </Flex>
          </Container>
        </>
      ) : (
        <ErrorContent
          errorTitle={getTranslate("ERROR_TITLE")}
          errorMessage={getTranslate("ERROR_MESSAGE")}
        />
      )}
    </>
  );
}

export default Question;
