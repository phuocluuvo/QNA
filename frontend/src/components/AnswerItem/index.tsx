import { AnswerType } from "@/util/type/Answer.type";
import {
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  Heading,
  Input,
  Link,
  Spacer,
  Tag,
  Text,
  Tooltip,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import VoteButton from "../VoteButton";
import helper, {
  markdownToPlainText,
  removeVietnameseTones,
} from "@/util/helper";
import Author from "../Author";
import { CheckIcon } from "@chakra-ui/icons";
import actionApproveAnswer from "@/API/redux/actions/answer/actionApproveAnswer";
import {
  FormApproveAnswer,
  FormCommentAnswer,
  FormVoteAnswer,
} from "@/API/type/Form.type";
import CustomAlertDialog from "../AlertDialog";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { VOTE } from "@/API/constant/Vote.enum";
import actionVoteAnswer from "@/API/redux/actions/answer/actionVoteAnswer";
import actionCreateCommentAnswer from "@/API/redux/actions/answer/actionCreateCommentAnswer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CommentType } from "@/util/type/Comment.type";
import dynamic from "next/dynamic";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function AnswerItem({
  answer,
  getTranslate,
  isAuthor,
  dispatch,
  fecthAnswer,
  type = "normal",
}: {
  answer: AnswerType;
  getTranslate: (key: string) => string;
  isAuthor: boolean;
  dispatch: (action: any) => void;
  fecthAnswer: () => void;
  type?: "minimals" | "normal";
}) {
  const session = useSession();
  const router = useRouter();
  const [commentArray, setCommentArray] = useStateWithCallback<
    Array<CommentType>
  >(answer.comments ?? []);
  const commentRef = React.useRef<HTMLInputElement>(null);
  const [state, setState] = useStateWithCallback<{
    count: number;
    isDarkMode: boolean;
    isApproved: boolean;
    isShowConfirm: boolean;
    isShowComment: boolean;
    comment: string;
    answer: AnswerType;
  }>({
    // @ts-ignore
    count: answer.votes ?? 0,
    isDarkMode: false,
    isApproved: answer.isApproved,
    isShowConfirm: false,
    isShowComment: false,
    comment: "",
    answer: answer,
  });
  const { colorMode } = useColorMode();
  React.useEffect(() => {
    // @ts-ignore
    setState((oldState) =>
      helper.mappingState(oldState, {
        isApproved: answer.isApproved,
        answer: answer,
      })
    );
    // setCommentArray(answer.comments);
  }, [answer]);
  const voteHandler = (type: VOTE) => {
    const form: FormVoteAnswer = {
      answer_id: answer.id,
      vote_type: type,
    };
    dispatch(
      actionVoteAnswer(
        form,
        (res: AnswerType) => {
          setState(
            // @ts-ignore
            (oldState) =>
              helper.mappingState(oldState, {
                count: res.votes,
              }),
            () => fecthAnswer()
          );
        },
        () => {}
      )
    );
  };
  const createComment = () => {
    const form: FormCommentAnswer = {
      answer_id: answer.id,
      content: state.comment,
    };
    dispatch(
      actionCreateCommentAnswer(
        form,
        (res: any) => {
          setCommentArray(
            (oldArray) => [...oldArray, res],
            (res) => {
              // @ts-ignore
              setState((oldState) =>
                helper.mappingState(oldState, {
                  comment: "",
                  answer: { ...answer, comments: res },
                  isShowComment: false,
                })
              );
            }
          );
        },
        () => {}
      )
    );
  };

  const approveHandler = () => {
    let form: FormApproveAnswer = {
      answer_id: answer.id,
      question_id: answer.question.id,
    };
    dispatch(
      actionApproveAnswer(
        form,
        (res: any) => {
          setState(
            // @ts-ignore
            (oldState) =>
              helper.mappingState(oldState, {
                isApproved: !oldState.isApproved,
              }),
            () => fecthAnswer()
          );
        },
        () => {}
      )
    );
  };
  return (
    <>
      <Box
        id={answer.id}
        key={answer.id}
        my={type === "normal" ? 5 : 0}
        w={"full"}
      >
        <HStack alignItems={"stretch"} height={"full"}>
          <Tag
            h={"fit-content"}
            variant="solid"
            alignSelf={"center"}
            colorScheme="green"
            display={type === "normal" ? "none" : "flex"}
          >
            {answer.votes}
          </Tag>
          <Flex
            direction={{ base: "column", md: "row" }}
            display={type === "minimals" ? "none" : "flex"}
            pos={{ base: "sticky" }}
            top={28}
          >
            <VStack
              spacing={0}
              mr={2}
              pos={"sticky"}
              top={{ base: 28, md: 40 }}
            >
              {/* up vote */}
              <VoteButton
                isDarkMode={state.isDarkMode}
                type="up"
                size={20}
                onClick={() => voteHandler(VOTE.UPVOTE)}
              />
              <Heading size={"sm"}>{helper.numberFormat(state.count)}</Heading>
              <VoteButton
                isDarkMode={state.isDarkMode}
                type="down"
                size={20}
                onClick={() =>
                  // @ts-ignore
                  voteHandler(VOTE.DOWNVOTE)
                }
              />
              {/* approve button */}
              {isAuthor ? (
                <Button
                  size={"xs"}
                  colorScheme={"green"}
                  variant={state.isApproved ? "solid" : "outline"}
                  mt={1}
                  onClick={() =>
                    setState((oldState) => ({
                      ...oldState,
                      isShowConfirm: true,
                    }))
                  }
                  rightIcon={state.isApproved ? <CheckIcon /> : undefined}
                >
                  {getTranslate("APPROVE")}
                </Button>
              ) : (
                <Tooltip
                  hasArrow
                  placement="right"
                  label={getTranslate("APPROVE_TOOLTIP")}
                >
                  <CheckIcon
                    display={state.isApproved ? "block" : "none"}
                    color={"green.500"}
                  />
                </Tooltip>
              )}
            </VStack>
          </Flex>
          <VStack
            alignItems={"flex-start"}
            justifyContent={"space-between"}
            flex={1}
            w={"full"}
          >
            {type === "minimals" ? (
              <Text
                style={{
                  fontSize: "16px",
                  backgroundColor: "transparent",
                }}
                noOfLines={2}
              >
                {markdownToPlainText(answer.content)}
              </Text>
            ) : (
              <Box data-color-mode={colorMode} w={"100%"}>
                <EditerMarkdown
                  source={answer.content}
                  style={{
                    fontSize: "16px",
                    backgroundColor: "transparent",
                  }}
                />
              </Box>
            )}

            <Link
              style={{
                display: type === "normal" ? "none" : "block",
              }}
              href={`/question/${answer.question.id}/${removeVietnameseTones(
                answer.question.title
              )}#${answer.id}`}
              color={"blue.500"}
              // @ts-ignore
              scroll={false}
            >
              {answer.question.title}
            </Link>
            <HStack
              w={"full"}
              justifyContent={"space-between"}
              mb={"1"}
              mr={2}
              flex={1}
              display={type === "minimals" ? "none" : "flex"}
              alignItems={"flex-start"}
            >
              <Spacer />
              <Author
                type="simple"
                sizeAvatar={"xs"}
                user={answer.user}
                nameStyle={{
                  color: "gray.500",
                  _hover: {
                    textDecoration: "underline",
                  },
                }}
                headingText={getTranslate("ANSWERED_AT").replace(
                  "{0}",
                  helper.formatDate(
                    answer.createdAt,
                    false,
                    "H:mm A - ddd, DD/MM/YYYY"
                  )
                )}
              />
            </HStack>
            {/* comment */}
            <VStack
              w={"full"}
              display={type === "minimals" ? "none" : "flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={0}
            >
              {state.answer.comments?.length > 0 &&
                state.answer.comments.map((comment) => (
                  <HStack
                    key={comment.id}
                    w={"full"}
                    borderBottom={"1px solid"}
                    borderColor={"gray.200"}
                    opacity={0.8}
                    _hover={{
                      opacity: 1,
                    }}
                    py={2}
                    flexWrap={"wrap"}
                  >
                    <Text fontSize={"xs"}>{comment.content}</Text>
                    <Text fontSize={"xs"}>
                      {helper.formatDate(
                        comment.createdAt,
                        false,
                        "H:mm A - ddd, DD/MM/YYYY"
                      )}{" "}
                    </Text>
                    <Button
                      variant={"link"}
                      colorScheme="facebook"
                      onClick={() =>
                        router.push(
                          `/user/${comment.user.id ?? session.data?.user.id}`
                        )
                      }
                      _hover={{
                        textDecoration: "underline",
                      }}
                    >
                      <Text fontSize={"xs"}>
                        {comment.user.fullname ?? session.data?.user.fullname}
                      </Text>
                    </Button>
                  </HStack>
                ))}
            </VStack>
            <Collapse
              in={state.isShowComment}
              animateOpacity
              style={{ width: "100%" }}
            >
              <Input
                ref={commentRef}
                placeholder={getTranslate("COMMENT")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    createComment();
                  }
                }}
                autoFocus={true}
                onChange={(e) => {
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, { comment: e.target.value })
                  );
                }}
                value={state.comment}
                size={"sm"}
              />
            </Collapse>
            {/* comment button */}
            <HStack display={type === "minimals" ? "none" : "flex"}>
              <Button
                type="button"
                isDisabled={
                  !session.data?.user?.id ||
                  (state.isShowComment && !state.comment)
                }
                variant={state.isShowComment ? "solid" : "link"}
                colorScheme="facebook"
                size="xs"
                onClick={() =>
                  state.isShowComment
                    ? createComment()
                    : // @ts-ignore
                      setState((oldState) =>
                        helper.mappingState(oldState, {
                          isShowComment: true,
                        })
                      )
                }
              >
                {!state.isShowComment
                  ? getTranslate("COMMENT")
                  : getTranslate("SUBMIT")}
              </Button>
              <Button
                type="button"
                variant={"ghost"}
                colorScheme="facebook"
                size="xs"
                display={state.isShowComment ? "block" : "none"}
                onClick={() => {
                  if (commentRef.current && state.isShowComment === true) {
                    commentRef.current.focus;
                  }
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, {
                      isShowComment: !oldState.isShowComment,
                    })
                  );
                }}
              >
                {getTranslate("CANCEL")}
              </Button>
            </HStack>
          </VStack>
          <Text display={type === "normal" ? "none" : "block"} fontSize={"md"}>
            {helper.formatDate(answer.createdAt, false, "ddd, DD/MM/YYYY")}
          </Text>
        </HStack>
      </Box>
      <CustomAlertDialog
        content={
          !state.isApproved
            ? getTranslate("APPROVE_CONFIRM_TITLE")
            : getTranslate("UNAPPROVE_CONFIRM_TITLE")
        }
        title={(!state.isApproved
          ? getTranslate("APPROVE")
          : getTranslate("UNAPPROVE")
        ).concat("?")}
        buttonStyle={{
          display: "none",
        }}
        isOpen={state.isShowConfirm}
        onClose={() =>
          setState((oldState) => ({
            ...oldState,
            isShowConfirm: false,
          }))
        }
        confirmButtonStyle={{
          variant: "solid",
          colorScheme: state.isApproved ? "red" : "green",
        }}
        cancelButtonStyle={{
          variant: "ghost",
          colorScheme: "gray",
        }}
        confirmText={
          !state.isApproved
            ? getTranslate("APPROVE")
            : getTranslate("UNAPPROVE")
        }
        cancelText={getTranslate("CANCEL")}
        confirmAction={approveHandler}
      />
    </>
  );
}

export default AnswerItem;
