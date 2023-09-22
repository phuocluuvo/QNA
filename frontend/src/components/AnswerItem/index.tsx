import { AnswerType } from "@/util/type/Answer.type";
import {
  Avatar,
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import VoteButton from "../VoteButton";
import helper from "@/util/helper";
import Author from "../Author";

function AnswareItem({
  answer,
  getTranslate,
}: {
  answer: AnswerType;
  getTranslate: (key: string) => string;
}) {
  const [state, setState] = React.useState({
    // @ts-ignore
    count: answer.voteNumber ?? 0,
    isDarkMode: false,
  });
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
            </VStack>
          </Flex>
          <VStack>
            {/* display raw text */}
            <Text aria-multiline={true}>{answer.content}</Text>
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
                    answer.createdDate,
                    false,
                    "H:mm A - ddd, DD/MM/YYYY"
                  )
                )}
              />
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </>
  );
}

export default AnswareItem;
