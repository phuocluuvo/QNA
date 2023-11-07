import { AnswerType } from "@/util/type/Answer.type";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  HStack,
  Heading,
  Input,
  Spacer,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import VoteButton from "../VoteButton";
import helper from "@/util/helper";
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

function AnswerItem({
  answer,
  getTranslate,
  isAuthor,
  dispatch,
  fecthAnswer,
}: {
  answer: AnswerType;
  getTranslate: (key: string) => string;
  isAuthor: boolean;
  dispatch: (action: any) => void;
  fecthAnswer: () => void;
}) {
  const [state, setState] = useStateWithCallback({
    // @ts-ignore
    count: answer.votes ?? 0,
    isDarkMode: false,
    isApproved: answer.isApproved,
    isShowConfirm: false,
    isShowComment: false,
    comment: "",
  });

  React.useEffect(() => {
    // @ts-ignore
    setState((oldState) =>
      helper.mappingState(oldState, {
        isApproved: answer.isApproved,
      })
    );
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
          console.log("comment:::", res);
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
      <Divider />
      <Box key={answer.id} my={5}>
        <HStack alignItems={"stretch"} height={"full"}>
          <Flex
            direction={{ base: "column", md: "row" }}
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
          >
            {/* display raw text */}
            <Box
              dangerouslySetInnerHTML={{
                __html: answer.content.trim(),
              }}
              fontSize={"sm"}
              w={"full"}
              h={"full"}
              flex={1}
            />
            <VStack
              w={"full"}
              justifyContent={"space-between"}
              mb={"1"}
              mr={2}
              flex={1}
              alignItems={"flex-start"}
            >
              <Author
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
            </VStack>
            <Collapse
              in={state.isShowComment}
              animateOpacity
              style={{ width: "100%" }}
            >
              <Input
                placeholder={getTranslate("COMMENT")}
                onChange={(e) =>
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, { comment: e.target.value })
                  )
                }
                value={state.comment}
                size={"sm"}
              />
            </Collapse>
            {/* comment button */}
            <HStack>
              <Button
                type="button"
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
                onClick={() =>
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, {
                      isShowComment: !oldState.isShowComment,
                    })
                  )
                }
              >
                {getTranslate("CANCEL")}
              </Button>
            </HStack>
          </VStack>
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
