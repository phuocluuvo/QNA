import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Box,
  useColorMode,
  BoxProps,
  Text,
  VStack,
  Button,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Colors } from "@/assets/constant/Colors";
import { useDispatch } from "react-redux";
import actionGetQuestionList from "@/API/redux/actions/question/ActionGetQuestionList";
import {
  QUESTION_SORT_BY,
  QuestionListType,
  QuestionType,
} from "@/util/type/Question.type";
import { NextRouter } from "next/router";
import helper, { removeVietnameseTones } from "@/util/helper";
type Props = {
  questions?: string;
  containerStyles?: BoxProps;
  router: NextRouter;
  getTranslate: (key: string) => string;
};
function TabsQuestion({
  questions,
  containerStyles,
  router,
  getTranslate,
}: Props) {
  const { colorMode } = useColorMode();
  const [state, setState] = React.useState<{
    questionsNew: QuestionType[];
    questionsUnanswer: QuestionType[];
  }>({
    questionsNew: [],
    questionsUnanswer: [],
  });
  const dispatch = useDispatch();
  function fetchNewQuestions() {
    dispatch(
      // @ts-ignore
      actionGetQuestionList(
        {
          page: 1,
          limit: 8,
          sortBy: "createdAt:DESC",
        },
        (res) => {
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, {
              questionsNew: res.data,
            })
          );
        },
        () => {}
      )
    );
  }
  function fetchUnanswerQuestions() {
    dispatch(
      // @ts-ignore
      actionGetQuestionList(
        {
          page: 1,
          limit: 8,
          "filter.type": "$eq:" + QUESTION_SORT_BY.NO_ANSWER,
          sortBy: "createdAt:DESC",
        },
        (res) => {
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, {
              questionsUnanswer: res.data,
            })
          );
        },
        () => {}
      )
    );
  }
  React.useEffect(() => {
    fetchNewQuestions();
    fetchUnanswerQuestions();
  }, []);
  return (
    <Box
      rounded={"md"}
      w={{
        base: "full",
        md: "300px",
      }}
      bg={Colors(colorMode === "dark").PRIMARY_BG}
      {...containerStyles}
    >
      <Tabs position="relative" variant="unstyled">
        <TabList>
          <Tab>{getTranslate("NEWEST")}</Tab>
          <Tab>{getTranslate("UNANSWERED")}</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            <VStack
              alignItems={"flex-start"}
              divider={<Divider color={Colors(colorMode === "dark").BORDER} />}
            >
              {state.questionsNew && state.questionsNew.length > 0
                ? state.questionsNew.map((question) => (
                    <HStack w={"full"} key={question.id}>
                      <Box
                        style={{
                          fontSize: "sm",
                          fontWeight: "bold",
                          position: "relative",
                          padding: "2px 10px",
                          borderRadius: "5px",
                          border: "1px solid",
                          borderColor: Colors(colorMode === "dark").PRIMARY_BG,
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
                            router.basePath + `/question/${question.id}/${removeVietnameseTones(question.title)}`
                          )
                        }
                        transition={"all 0.2s ease-in-out"}
                        _hover={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          opacity: 1,
                        }}
                        noOfLines={2}
                      >
                        {question.title.trim()}
                      </Text>
                    </HStack>
                  ))
                : null}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack
              alignItems={"flex-start"}
              divider={<Divider color={Colors(colorMode === "dark").BORDER} />}
            >
              {state.questionsUnanswer && state.questionsUnanswer.length > 0
                ? state.questionsUnanswer.map((question) => (
                    <HStack>
                      <Box
                        style={{
                          fontSize: "sm",
                          fontWeight: "bold",
                          position: "relative",
                          padding: "2px 10px",
                          borderRadius: "5px",
                          border: "1px solid",
                          borderColor: Colors(colorMode === "dark").PRIMARY_BG,
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
                            router.basePath + `/question/${question.id}/${removeVietnameseTones(question.title)}`
                          )
                        }
                        transition={"all 0.2s ease-in-out"}
                        _hover={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          opacity: 1,
                        }}
                        noOfLines={2}
                      >
                        {question.title.trim()}
                      </Text>
                    </HStack>
                  ))
                : null}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default TabsQuestion;
