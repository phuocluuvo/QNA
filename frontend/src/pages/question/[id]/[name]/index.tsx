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
import helper, { removeVietnameseTones } from "@/util/helper";
import { QuestionListType, QuestionType } from "@/util/type/Question.type";
import { UserType } from "@/util/type/User.type";
import { ChatIcon, RepeatClockIcon, ViewIcon } from "@chakra-ui/icons";
import {
  BiDotsVerticalRounded,
  BiPencil,
  BiSolidBookmarkPlus,
  BiSolidPencil,
  BiSolidShare,
  BiTime,
  BiTimer,
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
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import actionGetAnswer from "@/API/redux/actions/answer/actionGetAnswer";
import { AnswerListType } from "@/util/type/Answer.type";
import { VOTE } from "@/API/constant/Vote.enum";
import actionVoteQuestion from "@/API/redux/actions/question/actionVoteQuestion";
import { FormVote } from "@/API/type/Form.type";
import { useSession } from "next-auth/react";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import actionGetQuestionList, {
  actionGetQuestionWithRelatedTags,
} from "@/API/redux/actions/question/ActionGetQuestionList";
import AlertContent from "@/components/AlertContent";
import actionSaveToCollection from "@/API/redux/actions/question/ActionSaveToCollection";
import dynamic from "next/dynamic";
import { LayoutContext } from "@/provider/LayoutProvider";
import TitleHeader from "@/components/Title";
import api from "@/API/api";
import { GetServerSideProps } from "next";
import { Tooltip } from "chart.js";
import CommentModal from "@/components/CommentModal";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function Question() {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { colorMode } = useColorMode();
  const { setQuestion } = useContext(LayoutContext);
  const router = useRouter();
  const { id } = router.query;
  const [hydrated, setHydrated] = useState(false);
  const session = useSession();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
              isBookmarked: data.bookmarks && data.bookmarks.length > 0,
            })
          );
          setQuestion(data);
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
          setTimeout(() => {
            let _url;
            _url = new URL(window.location.href);
            const bookmark = _url.hash.substring(1);
            const element = document.getElementById(bookmark);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 1000);
        },
        () => {
          console.log("err");
        }
      )
    );
  };
  const deleteBookmark = (id: string) => {
    api
      .deleteBookmark(id)
      .then((res) => {
        console.log(res);
        setState(
          // @ts-ignore
          (oldState) => {
            return helper.mappingState(oldState, {
              isBookmarked: false,
            });
          }
        );
        toast({
          title: "Success",
          description: "Question deleted from collection",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      })
      .catch(
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
      );
  };
  // ------------ get related question ----------
  const fecthQuestionsWithTag = (tagIds: string[]) => {
    let tagsString = tagIds.join(",");
    dispatch<any>(
      actionGetQuestionWithRelatedTags(
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
    isBookmarked: boolean;
  }>({
    count: 0,
    // @ts-ignore
    question: null,
    isDarkMode: colorMode === "dark",
    isVoted: false,
    voteType: VOTE.UPVOTE,
    isBookmarked: false,
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
          setState(
            // @ts-ignore
            (oldState) => {
              return helper.mappingState(oldState, {
                question: {
                  ...oldState.question,
                  bookmarks: [
                    {
                      id: res.id,
                    },
                  ],
                },
                isBookmarked: true,
              });
            }
          );
          toast({
            title: "Success",
            description: "Question saved to For-Later",
            status: "success",
            duration: 3000,
            position: "top-right",
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
            <meta
              name="description"
              content={removeVietnameseTones(state.question.content)}
            />
            <meta
              name="keywords"
              content={state.question.tagNames?.join(",")}
            />
            <meta name="author" content={state.question.user.fullname} />
            <meta name="robots" content="index, follow" />
            <meta name="distribution" content="web" />
            <meta name="revisit-after" content="1 days" />
            <meta name="rating" content="general" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
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
                <HStack
                  bg={
                    state.question.state !== "blocked"
                      ? "transparent"
                      : "rgba(255,12,25,0.2)"
                  }
                  alignItems={"start"}
                  rounded={"md"}
                  paddingRight={"20px"}
                >
                  <VStack
                    spacing={2}
                    height={"full"}
                    position={"sticky"}
                    top={{ base: 28, md: 20 }}
                    pr={1}
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
                    <VStack spacing={0} pb={5}>
                      <IconButton
                        isActive={state.isBookmarked}
                        variant={"ghost"}
                        size={"lg"}
                        aria-label="Save"
                        icon={<BiSolidBookmarkPlus />}
                        title="Save question"
                        onClick={() => {
                          if (state.isBookmarked)
                            deleteBookmark(state.question.bookmarks[0].id);
                          else saveQuestionToCollection(state.question);
                        }}
                      />
                      <IconButton
                        variant={"ghost"}
                        size={"lg"}
                        aria-label="Save"
                        icon={<RepeatClockIcon />}
                        title="Timeline"
                        onClick={() => {
                          router.push(
                            `/question/${state.question.id}/timeline`
                          );
                        }}
                      />
                    </VStack>
                  </VStack>
                  <Box
                    width={"full"}
                    display={"flex"}
                    flexDir={"column"}
                    flex={1}
                    minHeight={"100%"}
                  >
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
                        onClick={() => {
                          // go back to main page
                          router.push("/");
                        }}
                      />
                      <Flex w={"full"} direction={"column"}>
                        <Box width={"full"}>
                          <AlertContent question={state.question} />
                          <HStack
                            pos={"relative"}
                            alignItems={"start"}
                            justifyContent={"space-between"}
                            width={"full"}
                            pb={3}
                          >
                            <TitleHeader title={state.question.title} />
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
                                <MenuItem
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      window.location.href
                                    );
                                    toast({
                                      title: "Copied",
                                      description: "Question link copied",
                                      status: "success",
                                      duration: 3000,
                                      position: "top-right",
                                      isClosable: true,
                                    });
                                  }}
                                  icon={<Icon as={BiSolidShare} />}
                                >
                                  Share
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                          <Stack direction={"column"} mb={3}>
                            <HStack flexWrap={"wrap"}>
                              {state.question.tags?.map((tag) => (
                                <TagQuestion key={tag.id} tag={tag} />
                              ))}
                            </HStack>
                            <HStack w={"full"}>
                              {/* modified times */}
                              <Text
                                fontSize="xs"
                                style={{
                                  display: "flex",
                                  alignItems: "center",

                                  opacity: 0.8,
                                }}
                              >
                                {getTranslate("MODIFIED_AT").replace(
                                  "{0}",
                                  helper.formatDate(
                                    state.question.updatedAt,
                                    false,
                                    "H:mm A - ddd, DD/MM/YYYY"
                                  )
                                )}
                              </Text>
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
                            </HStack>
                          </Stack>
                        </Box>
                      </Flex>
                    </Box>
                    <Divider mb={3} />
                    <Box data-color-mode={colorMode} mb={10}>
                      <EditerMarkdown
                        source={state.question.content}
                        style={{
                          maxWidth: "700px",
                          width: "100%",
                          backgroundColor: "transparent",
                        }}
                      />
                    </Box>
                    <Button
                      onClick={onOpen}
                      display={
                        session.data?.user.id === state.question.user.id &&
                        state.question.state === "blocked"
                          ? "flex"
                          : "none"
                      }
                      leftIcon={<BiSolidPencil />}
                    >
                      Show your question comment report history
                    </Button>

                    <Spacer />
                    {userData ? (
                      state.question.user.id === userData?.id ? (
                        <HStack
                          py={2}
                          mb={10}
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
                <VStack divider={<Divider />}>
                  {state.answerList &&
                    state.answerList?.data?.map((answer) => (
                      <div id={answer.id}>
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
                      </div>
                    ))}
                </VStack>
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
                  {getTranslate("RELATED_QUESTION_WITH_TAG")}
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
                                router.basePath +
                                  `/question/${
                                    question.id
                                  }/${removeVietnameseTones(question.title)}`
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
            <CommentModal
              comments={state.question.comments}
              isOpen={isOpen}
              onClose={onClose}
            />
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

export default Question;
