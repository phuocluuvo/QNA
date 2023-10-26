import actionGetQuestion from "@/API/redux/actions/question/ActionGetQuestion";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import AnswerEditor from "@/components/AnswerEditor";
import AnswerItem from "@/components/AnswerItem";
import Author from "@/components/Author";
import ErrorContent from "@/components/Error";
import LinkButton from "@/components/LinkButton";
import TagQuestion from "@/components/TagQuestion";
import VoteButton from "@/components/VoteButton";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import QuestionDataList from "@/util/mock/QuestionDataList.mock";
import { QuestionType } from "@/util/type/Question.type";
import { UserType } from "@/util/type/User.type";
import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import { BiDotsVerticalRounded, BiPencil, BiSolidShare } from "react-icons/bi";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ni18nConfig } from "../../../../ni18n.config";
import { clientNamespaces, loadTranslations } from "ni18n";
import { GetStaticProps } from "next";
import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import actionGetAnswer from "@/API/redux/actions/answer/actionGetAnswer";
import { AnswerListType } from "@/util/type/Answer.type";
import { VOTE } from "@/API/constant/Vote.enum";
import actionVoteQuestion from "@/API/redux/actions/question/actionVoteQuestion";
import { FormVote } from "@/API/type/Form.type";
import { useSession } from "next-auth/react";

function Question() {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { id } = router.query;
  const [hydrated, setHydrated] = useState(false);
  const session = useSession();
  const dispatch = useDispatch();
  // @ts-ignore
  const questionsRequesting = useSelector(
    (state: { questionReducer: { type: ActionTypes } }) =>
      state.questionReducer.type
  );
  // @ts-ignore
  let userData: UserType = null;
  let answerLoadType = useSelector(
    (state: { answerReducer: { type: ActionTypes } }) =>
      state.answerReducer.type
  );
  const voteQuestion = (voteType: VOTE) => {
    let form: FormVote = {
      question_id: id as string,
      vote_type: voteType,
    };
    dispatch<any>(
      actionVoteQuestion(
        form,
        (res) => {
          // @ts-ignore
          setState((oldState) => {
            return helper.mappingState(oldState, {
              count: res.votes,
            });
          });
        },
        () => {
          // @ts-ignore
          setState((oldState) => {
            return helper.mappingState(oldState, {
              count: oldState.count,
            });
          });
        }
      )
    );
  };
  const fecthAnswer = () => {
    dispatch<any>(
      actionGetAnswer(
        {
          question_id: id as string,
          limit: 20,
          page: 1,
        },
        (res) => {
          // @ts-ignore
          setState((oldState) => {
            res.items.sort((a, b) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });
            return helper.mappingState(oldState, {
              answerList: res,
            });
          });
        },
        () => {
          console.log("err");
        }
      )
    );
  };
  useEffect(() => {
    if (answerLoadType === ActionTypes.REQUEST_CREATE_ANSWER) {
      console.log("request create answer");
      fecthAnswer();
    }
  }, [answerLoadType]);

  useEffect(() => {
    if (id) {
      let form = {
        id: id as string,
      };
      let formAnswer = {
        question_id: id as string,
      };
      // @ts-ignore
      userData = localStorage.getItem("userLogin");
      dispatch<any>(
        actionGetQuestion(
          form,
          (data) => {
            // @ts-ignore
            setState((oldState) =>
              helper.mappingState(oldState, {
                question: data,
                count: data.votes,
              })
            );
            fecthAnswer();
          },
          () => {
            console.log("error");
          }
        )
      );
    }
  }, [id]);
  const [state, setState] = useState<{
    count: number;
    question: QuestionType;
    isDarkMode: boolean;
    answerList: AnswerListType;
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
  // sort item base on time added
  function sortAnswerList(answerList: AnswerListType) {
    state.answerList?.items.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  const parseLines = (value: string) => value.replace(/(\\n)/g, "\n");
  return (
    <>
      {questionsRequesting === ActionTypes.REQUEST_GET_QUESTION ? (
        <Box
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: Colors(isDarkMode).PRIMARY_BG,
            zIndex: 1000,
          }}
        >
          <Flex
            w={"full"}
            h={"full"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Heading size={"lg"}>Loading...</Heading>
          </Flex>
        </Box>
      ) : questionsRequesting === ActionTypes.SUCCESS_GET_QUESTION &&
        state.question ? (
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
              <Box flex={1}>
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
                      onClick={() => voteQuestion(VOTE.UPVOTE)}
                    />
                    <Heading size={"md"}>
                      {helper.numberFormat(state.count)}
                    </Heading>
                    <VoteButton
                      isDarkMode={isDarkMode}
                      type="down"
                      onClick={() => voteQuestion(VOTE.DOWNVOTE)}
                    />
                    <VStack py={5}>
                      <ChatIcon />
                      <Text>
                        {state.answerList && state.answerList.meta.totalItems}
                      </Text>
                      <ViewIcon />
                      <Text>{state.question.views}</Text>
                    </VStack>
                  </VStack>
                  <Box width={"full"}>
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
                        onClick={() => router.back()}
                      />
                      <Flex w={"full"} direction={"column"} mb={"10"}>
                        <Box width={"full"}>
                          <HStack
                            pos={"relative"}
                            alignItems={"start"}
                            justifyContent={"space-between"}
                            width={"full"}
                            // bg={Colors(isDarkMode).PRIMARY_BG}
                          >
                            <Heading flex={1} maxW={"85%"}>{state.question.title}</Heading>
                            <Menu>
                              <MenuButton
                                pos={"absolute"}
                                right={0}
                                top={0}
                                alignSelf={"center"}
                                as={Button}
                                variant="link"
                                size={"lg"}
                                leftIcon={<Icon as={BiDotsVerticalRounded} />}
                                colorScheme={"orange"}
                              />
                              <MenuList zIndex={2}>
                                <MenuItem icon={<Icon as={BiPencil} />}>
                                  Adjust
                                </MenuItem>
                                <MenuItem icon={<Icon as={BiSolidShare} />}>
                                  Share
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
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
                                state.question.createdAt,
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
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: state.question.content,
                      }}
                      fontSize={"sm"}
                      maxW={"full"}
                    />
                    {userData ? (
                      state.question.user.id === userData?.id ? (
                        <HStack
                          py={2}
                          divider={<Divider orientation="vertical" />}
                        >
                          <Button
                            colorScheme="orange"
                            size={"sm"}
                            variant="link"
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="orange"
                            size={"sm"}
                            variant="link"
                          >
                            Remove
                          </Button>
                        </HStack>
                      ) : null
                    ) : null}
                  </Box>
                </HStack>
                {userData ? <Divider mb={5} /> : null}
                <AnswerEditor
                  getTranslate={getTranslate}
                  questionId={state.question.id}
                  getResult={(res) => {
                    fecthAnswer();
                  }}
                />
                <Box>
                  {state.answerList &&
                    state.answerList?.items.map((answer) => (
                      <AnswerItem
                        key={answer.id}
                        answer={answer}
                        getTranslate={getTranslate}
                        isAuthor={
                          session?.data?.user?.id.toString() ===
                          state.question.user.id.toString()
                        }
                        dispatch={dispatch}
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
                {QuestionDataList.items.map(
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
                            <Text color={"white"}>{question.votes}</Text>
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
      ) : questionsRequesting === ActionTypes.FAILURE_GET_QUESTION ? (
        <ErrorContent
          errorTitle={getTranslate("ERROR_TITLE")}
          errorMessage={getTranslate("ERROR_MESSAGE")}
        />
      ) : null}
    </>
  );
}
// export const getStaticProps: GetStaticProps = async (props) => {
//   return {
//     props: {
//       ...(await loadTranslations(ni18nConfig, props.locale, [
//         "home-page",
//       ])),
//       ...clientNamespaces(ni18nConfig, ["home-page"]),
//     },
//   };
// };
export default Question;
