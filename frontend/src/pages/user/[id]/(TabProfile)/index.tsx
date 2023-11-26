import api from "@/API/api";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import AnswerItem from "@/components/AnswerItem";
import QuestionItem from "@/components/QuestionItem";
import StasGroup from "@/components/StasGroup";
import TagItem from "@/components/TagItem";
import { LanguageHelper } from "@/util/Language/Language.util";
import { AnswerListType } from "@/util/type/Answer.type";
import { QuestionListType } from "@/util/type/Question.type";
import { TagListType, TagType } from "@/util/type/Tag.type";
import { DashBoardUserType, UserType } from "@/util/type/User.type";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  Heading,
  Spacer,
  Stack,
  Text,
  VStack,
  styled,
  useColorMode,
} from "@chakra-ui/react";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import helper from "@/util/helper";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);
const filterData = [
  {
    label: "This Month",
    value: "month",
  },
  {
    label: "This Quarter",
    value: "quarter",
  },
  {
    label: "This Year",
    value: "year",
  },
  {
    label: "All",
    value: "all",
  },
];
type sortByData = {
  questions: "votes" | "createdAt";
  answers: "votes" | "createdAt";
  tags: "questionsNumber" | "createdAt";
  dateActivity: string;
};
const _activityData = Array.from({ length: 5 }, (_, i) => ({
  date: moment().subtract(i, "days").format("YYYY-MM-DD"),
  count: Math.floor(Math.random() * 100), // replace with your count generation logic
}));
function TabProfile({
  user,
  dashboard,
}: {
  user: UserType;
  dashboard: DashBoardUserType;
}) {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const inputRef = useRef(null);
  const [question, setQuestion] = React.useState<QuestionListType>();
  const [answers, setAnswers] = React.useState<AnswerListType>();
  const [tags, setTags] = React.useState<TagType[]>();
  const [hydrated, setHydrated] = useState(false);
  const { colorMode } = useColorMode();

  const [activityData, setActivityData] = React.useState<
    Array<{
      activity_date: string;
      total_points: number;
    }>
  >([
    {
      activity_date: moment().format("YYYY-MM-DD"),
      total_points: 0,
    },
  ]);
  const [sortBy, setSortBy] = useState<sortByData>({
    questions: "votes",
    answers: "votes",
    tags: "questionsNumber",
    dateActivity: "all",
  });
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState(filterData[0]);
  useEffect(() => {
    setTimeout(() => {
      api.getAllAnswerByUser(user.id as string, sortBy.answers).then((_res) => {
        setAnswers(_res?.data);
      });
    }, 100);
  }, [sortBy.answers]);
  useEffect(() => {
    setTimeout(() => {
      api.getAcitvityDashboardByUser(user.id as string).then((_res) => {
        console.log(_res);
        setActivityData(_res?.data);
      });
    }, 100);
  }, [sortBy.questions]);
  useEffect(() => {
    setTimeout(() => {
      api
        .getAllQuesitonByUser(user.id as string, sortBy.questions)
        .then((_res) => {
          setQuestion(_res?.data);
        });
    }, 100);
  }, [sortBy.dateActivity]);
  useEffect(() => {
    setTimeout(() => {
      api.getAllTagsByUser(user.id as string, sortBy.tags).then((_res) => {
        setTags(_res?.data);
      });
    }, 100);
  }, [sortBy.tags]);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <Box flex={1} display={"flex"}>
      <HStack spacing={4} flex={1} w={"100%"}>
        <VStack justifyContent={"start"} alignItems={"start"} w={"full"}>
          <Stack
            width="full"
            direction={{ base: "column-reverse", md: "column-reverse" }}
            style={{ height: "100%" }}
            gap={6}
          >
            {/* static quater */}
            {dashboard ? (
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                templateRows={{
                  base: "repeat(1, 1fr)",
                  md: "repeat(1, 1fr)",
                }}
                gap={6}
              >
                {activityData && (
                  <VStack height={"full"}>
                    <TitleData>Activity Points:</TitleData>
                    <Box
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "10px",
                        border:
                          "1px solid " + Colors(colorMode === "dark").PRIMARY,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Line
                        title="Activity Points"
                        about="This is the activity points of this user"
                        datasetIdKey="id"
                        data={{
                          labels: activityData.map((item) =>helper.formatDate(item.activity_date)),
                          datasets: [
                            {
                              label: "Activity Points",
                              data: activityData.map((item) => item.total_points),
                              fill: false,
                              backgroundColor: Colors(colorMode === "dark")
                                .PRIMARY,
                              borderColor: Colors(colorMode === "dark").PRIMARY,
                              borderWidth: 1,
                            },
                          ],
                        }}
                        style={{
                          height: "100%",
                        }}
                      />
                    </Box>
                  </VStack>
                )}
                <VStack>
                  <HStack w={"full"}>
                    <Spacer />
                    <HStack spacing={0}>
                      {filterData.map((filter, index) => (
                        <Button
                          style={{
                            background:
                              selectedFilter.value === filter.value
                                ? Colors(colorMode === "dark").PRIMARY
                                : "transparent",
                            color:
                              selectedFilter.value === filter.value
                                ? "white"
                                : Colors(colorMode === "dark").PRIMARY,
                            padding: "5px 10px",
                          }}
                          key={index}
                          variant={"ghost"}
                          rounded={"md"}
                          onClick={() => setSelectedFilter(filter)}
                        >
                          {filter.label}
                        </Button>
                      ))}
                    </HStack>
                  </HStack>
                  <StasGroup
                    // @ts-ignore
                    filter={selectedFilter.value}
                    dashboard={dashboard}
                  />
                </VStack>
              </Grid>
            ) : null}
            <VStack w={"100%"}>
              <TitleData>{getTranslate("ABOUT")}:</TitleData>
              <Box
                data-color-mode={colorMode}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid " + Colors(colorMode === "dark").PRIMARY,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  minHeight: "fit-content",
                }}
              >
                {user.about === "" ? (
                  <Text
                    style={{
                      fontStyle: "italic",
                    }}
                  >
                    This user has not written anything about themselves yet
                  </Text>
                ) : (
                  <EditerMarkdown
                    source={user.about}
                    style={{
                      fontSize: "16px",
                      height: "fit-content",
                      minHeight: "200px",
                      width: "100%",
                      backgroundColor: "transparent",
                    }}
                  />
                )}
              </Box>
            </VStack>
          </Stack>
          <Stack
            width="full"
            direction={"column"}
            style={{ height: "100%" }}
            gap={6}
          >
            <SectionContainer height="full">
              <HStack
                w={"full"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <TitleData>Top Questions:</TitleData>
                <HStack>
                  <Button
                    style={{
                      background:
                        sortBy.questions === "votes"
                          ? Colors(colorMode === "dark").PRIMARY
                          : "transparent",
                      color:
                        sortBy.questions === "votes"
                          ? "white"
                          : Colors(colorMode === "dark").PRIMARY,
                      padding: "5px 10px",
                    }}
                    variant={"ghost"}
                    rounded={"md"}
                    onClick={() =>
                      setSortBy({
                        ...sortBy,
                        questions: "votes",
                      })
                    }
                  >
                    Vote
                  </Button>
                  <Button
                    style={{
                      background:
                        sortBy.questions === "createdAt"
                          ? Colors(colorMode === "dark").PRIMARY
                          : "transparent",
                      color:
                        sortBy.questions === "createdAt"
                          ? "white"
                          : Colors(colorMode === "dark").PRIMARY,
                      padding: "5px 10px",
                    }}
                    variant={"ghost"}
                    rounded={"md"}
                    onClick={() =>
                      setSortBy({
                        ...sortBy,
                        questions: "createdAt",
                      })
                    }
                  >
                    Date
                  </Button>
                </HStack>
              </HStack>
              <VerticalDataContainer
                minHeight={
                  question && question?.meta.totalItems > 0
                    ? "fit-content"
                    : "150px"
                }
                divider={<Divider />}
              >
                {question && question?.meta.totalItems > 0 ? (
                  question?.data.map((item) => (
                    <QuestionItem
                      type="minimals"
                      question={item}
                      isVerifyItem={true}
                      isDarkMode={colorMode === "dark"}
                    />
                  ))
                ) : (
                  <Text
                    style={{
                      fontStyle: "italic",
                    }}
                  >
                    This user has asked no question
                  </Text>
                )}
              </VerticalDataContainer>
            </SectionContainer>
            <SectionContainer height="full">
              <HStack w={"full"} justifyContent={"space-between"}>
                <TitleData>Top Answers:</TitleData>
                <HStack>
                  <Button
                    style={{
                      background:
                        sortBy.answers === "votes"
                          ? Colors(colorMode === "dark").PRIMARY
                          : "transparent",
                      color:
                        sortBy.answers === "votes"
                          ? "white"
                          : Colors(colorMode === "dark").PRIMARY,
                      padding: "5px 10px",
                    }}
                    variant={"ghost"}
                    rounded={"md"}
                    onClick={() =>
                      setSortBy({
                        ...sortBy,
                        answers: "votes",
                      })
                    }
                  >
                    Vote
                  </Button>
                  <Button
                    style={{
                      background:
                        sortBy.answers === "createdAt"
                          ? Colors(colorMode === "dark").PRIMARY
                          : "transparent",
                      color:
                        sortBy.answers === "createdAt"
                          ? "white"
                          : Colors(colorMode === "dark").PRIMARY,
                      padding: "5px 10px",
                    }}
                    variant={"ghost"}
                    rounded={"md"}
                    onClick={() =>
                      setSortBy({
                        ...sortBy,
                        answers: "createdAt",
                      })
                    }
                  >
                    Date
                  </Button>
                </HStack>
              </HStack>
              <VerticalDataContainer
                minHeight={
                  answers && answers?.meta.totalItems > 0
                    ? "fit-content"
                    : "150px"
                }
                height={"100%"}
                divider={<Divider />}
              >
                {answers && answers?.meta.totalItems > 0 ? (
                  answers?.data.map((item) => (
                    <AnswerItem
                      answer={item}
                      type="minimals"
                      fecthAnswer={() => {}}
                      dispatch={dispatch}
                      isAuthor={false}
                      getTranslate={getTranslate}
                    />
                  ))
                ) : (
                  <Text
                    style={{
                      fontStyle: "italic",
                    }}
                  >
                    This user has answered to no question
                  </Text>
                )}
              </VerticalDataContainer>
            </SectionContainer>
            <SectionContainer height="full">
              <HStack w={"full"} justifyContent={"space-between"}>
                <TitleData>Top Tags:</TitleData>
                <HStack>
                  <Button
                    style={{
                      background:
                        sortBy.tags === "questionsNumber"
                          ? Colors(colorMode === "dark").PRIMARY
                          : "transparent",
                      color:
                        sortBy.tags === "questionsNumber"
                          ? "white"
                          : Colors(colorMode === "dark").PRIMARY,
                      padding: "5px 10px",
                    }}
                    variant={"ghost"}
                    rounded={"md"}
                    onClick={() =>
                      setSortBy({
                        ...sortBy,
                        tags: "questionsNumber",
                      })
                    }
                  >
                    Vote
                  </Button>
                  <Button
                    style={{
                      background:
                        sortBy.tags === "createdAt"
                          ? Colors(colorMode === "dark").PRIMARY
                          : "transparent",
                      color:
                        sortBy.tags === "createdAt"
                          ? "white"
                          : Colors(colorMode === "dark").PRIMARY,
                      padding: "5px 10px",
                    }}
                    variant={"ghost"}
                    rounded={"md"}
                    onClick={() =>
                      setSortBy({
                        ...sortBy,
                        tags: "createdAt",
                      })
                    }
                  >
                    Date
                  </Button>
                </HStack>
              </HStack>
              <VerticalDataContainer
                minHeight={tags && tags?.length > 0 ? "fit-content" : "150px"}
                height={"100%"}
                divider={<Divider />}
              >
                {tags && tags?.length > 0 ? (
                  tags?.map((item) => <TagItem tag={item} type="simple" />)
                ) : (
                  <Text
                    style={{
                      fontStyle: "italic",
                    }}
                  >
                    This user has used/created no tags
                  </Text>
                )}
              </VerticalDataContainer>
            </SectionContainer>
          </Stack>
        </VStack>
      </HStack>
    </Box>
  );
}
const TitleData = styled(Text, {
  baseStyle: {
    fontSize: "20px",
    fontWeight: "bold",
    width: "100%",
    marginBottom: "10px",
  },
});
const VerticalDataContainer = styled(VStack, {
  baseStyle: {
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "10px",
    height: "100%",
    minHeight: "150px",
    paddingBottom: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
});

const SectionContainer = styled(VStack, {
  baseStyle: {
    flex: 1,
    width: "auto",
    height: "100%",
    justifyContent: "start",
    alignItems: "flex-start",
  },
});

export default TabProfile;
