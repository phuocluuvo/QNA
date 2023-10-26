import { AnswerType } from "@/util/type/Answer.type";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import VoteButton from "../VoteButton";
import helper from "@/util/helper";
import Author from "../Author";
import { CheckIcon } from "@chakra-ui/icons";
import actionApproveAnswer from "@/API/redux/actions/answer/actionApproveAnswer";
import { FormApproveAnswer } from "@/API/type/Form.type";
import CustomAlertDialog from "../AlertDialog";

function AnswerItem({
  answer,
  getTranslate,
  isAuthor,
  dispatch,
}: {
  answer: AnswerType;
  getTranslate: (key: string) => string;
  isAuthor: boolean;
  dispatch: (action: any) => void;
}) {
  const [state, setState] = React.useState({
    // @ts-ignore
    count: answer.votes ?? 0,
    isDarkMode: false,
    isApproved: answer.isApproved,
    isShowConfirm: false,
  });
  const approveHandler = () => {
    let form: FormApproveAnswer = {
      answer_id: answer.id,
      question_id: answer.question.id,
    };
    dispatch(
      actionApproveAnswer(
        form,
        (res: any) => {
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, {
              isApproved: !oldState.isApproved,
            })
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
        <HStack alignItems={"start"}>
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
                onClick={() =>
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, {
                      count: state.count + 1,
                    })
                  )
                }
              />
              <Heading size={"sm"}>{helper.numberFormat(state.count)}</Heading>
              <VoteButton
                isDarkMode={state.isDarkMode}
                type="down"
                size={20}
                onClick={() =>
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, {
                      count: state.count - 1,
                    })
                  )
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
          <VStack>
            {/* display raw text */}
            <Box
              dangerouslySetInnerHTML={{
                __html: answer.content.trim(),
              }}
              fontSize={"sm"}
              w={"full"}
            />
            <HStack w={"full"} mb={"1"} mr={2} alignItems={"flex-start"}>
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
          !state.isApproved ? getTranslate("APPROVE") : getTranslate("UNAPPROVE")
        }
        cancelText={getTranslate("CANCEL")}
        confirmAction={approveHandler}
      />
    </>
  );
}

export default AnswerItem;
