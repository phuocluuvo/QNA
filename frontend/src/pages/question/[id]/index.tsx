import actionGetQuestion from "@/API/redux/actions/question/ActionGetQuestion";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import AnswerEditor from "@/components/AnswerEditor";
import AnswerItem from "@/components/AnswerItem";
import Author from "@/components/Author";
import LinkButton from "@/components/LinkButton";
import TagQuestion from "@/components/TagQuestion";
import VoteButton from "@/components/VoteButton";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { QuestionListType, QuestionType } from "@/util/type/Question.type";
import { UserType } from "@/util/type/User.type";
import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import {
  BiDotsVerticalRounded,
  BiPencil,
  BiSolidBookmarkPlus,
  BiSolidShare,
} from "react-icons/bi";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  Stack,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import actionGetAnswer from "@/API/redux/actions/answer/actionGetAnswer";
import { AnswerListType } from "@/util/type/Answer.type";
import { VOTE } from "@/API/constant/Vote.enum";
import actionVoteQuestion from "@/API/redux/actions/question/actionVoteQuestion";
import { FormVote } from "@/API/type/Form.type";
import { useSession } from "next-auth/react";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import actionGetQuestionList from "@/API/redux/actions/question/ActionGetQuestionList";
import AlertContent from "@/components/AlertContent";
import actionSaveToCollection from "@/API/redux/actions/question/ActionSaveToCollection";

function Question() {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const answerList = useSelector(
    (state: { answerReducer: { answerList: AnswerListType } }) =>
      state.answerReducer.answerList
  );
  // @ts-ignore
  let userData: UserType = session.data?.user;
  let answerLoadType = useSelector(
    (state: { answerReducer: { type: ActionTypes } }) =>
      state.answerReducer.type
  );
  useEffect(() => {
    if (answerList)
      setState(
        // @ts-ignore
        (oldState) => helper.mappingState(oldState, { answerList: answerList })
      );
    // call update vote each 30s
    const interval = setInterval(() => {
      if (id)
        dispatch<any>(
          actionGetQuestion(
            { id: id as string },
            (data) => {
              // @ts-ignore
              setState((oldState) =>
                helper.mappingState(oldState, {
                  count: data.votes,
                })
              );
            },
            () => {
              console.log("error");
            }
          )
        );
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const voteQuestion = (voteType: VOTE) => {
    let form: FormVote = {
      question_id: id as string,
      vote_type: voteType,
    };
    dispatch<any>(
      actionVoteQuestion(
        form,
        (res) => {
          console.log("vote question", res);
          // unvoted
          if (state.voteType === voteType) {
            setState(
              // @ts-ignore
              (oldState) => {
                return helper.mappingState(oldState, {
                  count: res.votes,
                  isVoted: false,
                });
              }
            );
          } else
            setState(
              // @ts-ignore
              (oldState) => {
                return helper.mappingState(oldState, {
                  count: res.votes,
                  isVoted: true,
                  voteType: voteType,
                });
              }
            );
          // fecthQuestionData(id);
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
  const fecthQuestionData = (id: any) => {
    let form = {
      id: id as string,
    };
    dispatch<any>(
      actionGetQuestion(
        form,
        (data) => {
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, {
              question: data,
              count: data.votes,
              voteType: (data.vote.length > 0 && data.vote[0].voteType) || null,
              isVoted: data.vote.length > 0,
            })
          );
          let arrayTags = data.tags?.map((tag) => tag.name);
          arrayTags && fecthQuestionsWithTag(arrayTags);
          fecthAnswer();
        },
        () => {
          console.log("error");
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
  // ------------ get related question ----------
  const fecthQuestionsWithTag = (tagIds: string[]) => {
    let tagsString = tagIds.join(",");
    dispatch<any>(
      actionGetQuestionList(
        {
          // @ts-ignore
          tag_names: tagsString,
          limit: 5,
          page: 1,
        },
        (res) => {
          // @ts-ignore
          setState((oldState) => {
            return helper.mappingState(oldState, {
              relatedQuestions: res,
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
    if (
      answerLoadType === ActionTypes.REQUEST_CREATE_ANSWER ||
      answerLoadType === ActionTypes.REQUEST_GET_ANSWER_LIST
    ) {
      console.log("request create answer");
      // fecthAnswer();
      setState(
        // @ts-ignore
        (oldState) =>
          helper.mappingState(oldState, {
            answerList: answerList,
          })
      );
    }
  }, [answerLoadType]);

  useEffect(() => {
    if (id) {
      fecthQuestionData(id);
    }
  }, [id]);
  const [state, setState] = useStateWithCallback<{
    count: number;
    question: QuestionType;
    isDarkMode: boolean;
    answerList: AnswerListType;
    voteType: VOTE;
    isVoted: boolean;
    relatedQuestions: QuestionListType;
  }>({
    count: 0,
    // @ts-ignore
    question: null,
    isDarkMode: colorMode === "dark",
    isVoted: false,
    voteType: VOTE.UPVOTE,
  });
  const toast = useToast();
  // @ts-ignore
  const [editQuestion, setEditQuestion] = useState<QuestionType>({
    title: "",
    content: "",
    tagNames: [""],
  });
  const isDarkMode = colorMode === "dark";
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  function saveQuestionToCollection(question: QuestionType) {
    dispatch(
      actionSaveToCollection(
        question.id,
        (res) => {
          console.log(res);
          toast({
            title: "Success",
            description: "Question saved to collection",
            status: "success",
            icon: "success",
            duration: 3000,
            position: "top-right",
            variant: "subtle",
            isClosable: true,
          });
        },
        // @ts-ignore
        (err) => {
          toast({
            title: "Error",
            description: "Something went wrong",
            status: "error",
            icon: "error",
            duration: 3000,
            position: "top-right",
            variant: "subtle",
            isClosable: true,
          });
        }
      )
    );
  }
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
          <Container maxW={{ base: "fit-content", md: "100%" }}>
            <Flex
              direction={{
                base: "column",
                md: "row",
              }}
            >
              <Box display={"flex"} flexDir={"column"} flex={1}>
                <HStack alignItems={"start"} mb={10}>
                  <VStack
                    spacing={0}
                    mr={2}
                    pos={"sticky"}
                    top={{ base: 28, md: 20 }}
                  >
                    {/* up vote */}
                    <VoteButton
                      isDisabled={state.question.state === "blocked"}
                      isVoted={state.isVoted && state.voteType === VOTE.UPVOTE}
                      isDarkMode={isDarkMode}
                      type="up"
                      onClick={() => voteQuestion(VOTE.UPVOTE)}
                    />
                    <Heading size={"md"}>
                      {helper.numberFormat(state.count)}
                    </Heading>
                    <VoteButton
                      isDisabled={state.question.state === "blocked"}
                      isVoted={
                        state.isVoted && state.voteType === VOTE.DOWNVOTE
                      }
                      isDarkMode={isDarkMode}
                      type="down"
                      onClick={() => voteQuestion(VOTE.DOWNVOTE)}
                    />
                    <VStack pt={5}>
                      <ChatIcon />
                      <Text>
                        {state.answerList && state.answerList.meta?.totalItems}
                      </Text>
                      <ViewIcon />
                      <Text>{state.question.views}</Text>
                    </VStack>
                    <VStack pb={5}>
                      <IconButton
                        variant={"ghost"}
                        size={"lg"}
                        aria-label="Save"
                        icon={<BiSolidBookmarkPlus />}
                        title="Save question"
                        onClick={() => {
                          saveQuestionToCollection(state.question);
                        }}
                      />
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
                      <Flex w={"full"} direction={"column"}>
                        <Box width={"full"}>
                          <AlertContent type={state.question.state} />
                          <HStack
                            pos={"relative"}
                            alignItems={"start"}
                            justifyContent={"space-between"}
                            width={"full"}
                          >
                            <Heading
                              flex={1}
                              maxW={"90%"}
                              fontWeight={"medium"}
                              mb={2}
                            >
                              {state.question.title}
                            </Heading>
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
                          <Stack direction={{ base: "column", md: "row" }}>
                            <HStack flexWrap={"wrap"}>
                              {state.question.tags?.map((tag) => (
                                <TagQuestion key={tag.id} tag={tag} />
                              ))}
                            </HStack>
                            <Spacer />
                            <Author
                              type="simple"
                              user={state.question.user}
                              headingText={getTranslate("ASKED_AT").replace(
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
                          </Stack>
                        </Box>
                      </Flex>
                    </Box>
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: state.question.content
                          .replace(
                            /<img/g,
                            '<img style="max-width:100%;height:auto;"'
                          )
                          .replace(
                            /<pre/g,
                            '<pre style="overflow:scroll;background-color:#1a202c;color:#fff;white-space:pre-wrap;"'
                          ),
                      }}
                      fontSize={"sm"}
                      maxW={{
                        base: "100%",
                        md: "80%",
                      }}
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
                            onClick={() => {
                              router.push(
                                router.basePath +
                                  `/question/edit?questionId=${state.question.id}`
                              );
                            }}
                            isDisabled={state.question.state === "blocked"}
                          >
                            {getTranslate("EDIT")}
                          </Button>
                          <Button
                            colorScheme="orange"
                            size={"sm"}
                            variant="link"
                            isDisabled={state.question.state === "blocked"}
                          >
                            {getTranslate("DELETE")}
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
                    state.answerList?.data?.map((answer) => (
                      <AnswerItem
                        key={answer.id}
                        answer={answer}
                        getTranslate={getTranslate}
                        isAuthor={
                          session?.data?.user?.id.toString() ===
                          state.question.user.id.toString()
                        }
                        fecthAnswer={fecthAnswer}
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
                width={{
                  lg: "300px",
                  md: "200px",
                }}
                bg={Colors(colorMode === "dark").PRIMARY_BG}
              >
                <Heading
                  size={"sm"}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Related questions width similar tags
                </Heading>
                <VStack>
                  {state.relatedQuestions &&
                  state.relatedQuestions.data.length > 0
                    ? state.relatedQuestions.data.map((question) => (
                        <HStack w={"full"}>
                          <Box
                            style={{
                              fontSize: "sm",
                              fontWeight: "bold",
                              position: "relative",
                              padding: "2px 10px",
                              borderRadius: "5px",
                              border: "1px solid",
                              borderColor: Colors(colorMode === "dark")
                                .PRIMARY_BG,
                            }}
                          >
                            <span
                              style={{
                                position: "absolute",
                                left: "3px",
                              }}
                            >
                              {question.votes < 0 ? "-" : ""}
                            </span>
                            {Math.abs(question.votes)}
                          </Box>
                          <Text
                            maxW={"full"}
                            fontSize={"xs"}
                            opacity={0.8}
                            onClick={() =>
                              // @ts-ignore
                              router.push(
                                router.basePath + `/question/${question.id}`
                              )
                            }
                            transition={"all 0.2s ease-in-out"}
                            _hover={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              opacity: 1,
                            }}
                          >
                            {question.title.trim()}
                          </Text>
                        </HStack>
                      ))
                    : null}
                </VStack>
              </Box>
            </Flex>
          </Container>
        </>
      ) : (
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
            direction={"column"}
            justifyContent={"center"}
          >
            <Spinner size={"xl"} />
            <Heading size={"lg"}>Loading...</Heading>
          </Flex>
        </Box>
      )}
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
