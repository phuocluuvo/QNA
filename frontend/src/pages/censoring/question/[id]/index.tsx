import actionGetQuestion from "@/API/redux/actions/question/ActionGetQuestion";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { QuestionListType, QuestionType } from "@/util/type/Question.type";
import {
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import { VOTE } from "@/API/constant/Vote.enum";
import { useSession } from "next-auth/react";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import CensoringTagItem from "@/components/CensoringTagItem";
import TabQuestionCensoring from "./(TabQuestion)";

function Question() {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { colorMode } = useColorMode();
  const [isHavePendingTag, setIsHavePendingTag] = useState(false);
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

  useEffect(() => {
    if (id)
      dispatch<any>(
        actionGetQuestion(
          { id: id as string },
          (data) => {
            let _isHavePendingTag = false;
            data.tags?.forEach((tag) => {
              if (tag.state === "pending") {
                _isHavePendingTag = true;
              }
            });
            setIsHavePendingTag(_isHavePendingTag);
          },
          () => {
            console.log("error");
          }
        )
      );
  }, []);

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
        },
        () => {
          console.log("error");
        }
      )
    );
  };

  useEffect(() => {
    if (id) {
      fecthQuestionData(id);
    }
  }, [id]);
  const [state, setState] = useStateWithCallback<{
    count: number;
    question: QuestionType;
    isDarkMode: boolean;
    voteType: VOTE;
    isVoted: boolean;
    relatedQuestions: QuestionListType;
  }>({
    count: 0,
    // @ts-ignore
    question: null,
    isDarkMode: colorMode === "dark",
    isVoted: false,
  });
  const isDarkMode = colorMode === "dark";
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <>
      {state.question ? (
        <Container
        maxW={{ base: "fit-content", md: "100%" }}>
          <Head>
            <title>{state.question.title}</title>
            <meta
              name={state.question.title}
              content={state.question.content}
            />
          </Head>
          <Heading size={"lg"}> {getTranslate("CENSORE")}</Heading>
          <Tabs variant="enclosed" w={"full"} mt={2}>
            <TabList>
              <Tab>{getTranslate("QUESTION")}</Tab>
              <Tab>{getTranslate("TAG")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                >
                  <Box flex={1}>
                    <TabQuestionCensoring question={state.question} />
                  </Box>
                  {/* <Box
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
                    <Text fontWeight={"bold"}>Notice</Text>
                    <Divider />
                    <Text>
                      As a moderator, you can edit the question content and
                      title, block or verify the question
                    </Text>
                    <Text>
                      Please make sure you have read the question carefully
                    </Text>
                    <Text>
                      If you have any question, please contact the question
                      author
                    </Text>
                  </Box> */}
                </Flex>
              </TabPanel>
              <TabPanel>
                <VStack alignItems={"start"}>
                  {state.question.tags?.map((tag) => (
                    <CensoringTagItem key={tag.id} tag={tag} />
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
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
