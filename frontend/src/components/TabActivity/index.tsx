import api from "@/API/api";
import { ActionGetUserHistory } from "@/API/redux/actions/user/ActionGetActivityHistory";
import { CommonParams } from "@/API/type/params/Common.params";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import {
  HistoryActivityListType,
  HistoryActivityType,
} from "@/util/type/HistoryActivity";
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Button,
  Flex,
  HStack,
  Spacer,
  useColorMode,
  Text,
  Box,
  Input,
  Stack,
  Grid,
  VStack,
  styled,
} from "@chakra-ui/react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { DashBoardUserType } from "@/util/type/User.type";
import { useDispatch } from "react-redux";
import { actionGetUserDashBoardById } from "@/API/redux/actions/user/ActionGetProfile";
import StasGroup from "../StasGroup";
const limitations = [5, 10, 15, 20];
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);
function TabActivity({
  getTranslate,
}: {
  getTranslate: (key: string) => string;
}) {
  const [dashboard, setDashboard] = React.useState<DashBoardUserType>();
  const [selectedFilter, setSelectedFilter] = useState(filterData[0]);
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
  const [history, setHistory] = React.useState<HistoryActivityListType | null>(
    null
  );
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const [filterDates, setFilterDates] = useState({
    dateTo:
      helper.formatDate(currentDate.toDateString(), false, "YYYY-MM-DD") || "",
    dateFrom:
      helper.formatDate(new Date().toDateString(), false, "YYYY-MM-DD") || "",
  });
  const { colorMode } = useColorMode();
  const router = useRouter();
  const query = router.query;
  const pageNumber = Number(query.page);
  const session = useSession();
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (history?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(history?.meta.totalPages)];

  const pageNumClick = (pageNumber: number, limit: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, limit: limit, page: pageNumber },
    });
  };
  const dispatch = useDispatch();
  const { getCurrentLanguage } = LanguageHelper(Pages.HOME);
  React.useEffect(() => {
    const defaultLimit = 10;
    const defaultPage = 1;
    const defaultSortBy = "title";
    const defaultOrderBy = "ASC";

    const queryParams: CommonParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      ...(router.query.select && {
        "filter.type": `$eq:${router.query.select}`,
      }),
      sortBy: router.query.sortBy
        ? `${router.query.sortBy}:${router.query.orderBy || defaultOrderBy}`
        : `${defaultSortBy}:${defaultOrderBy}`,
      ...(filterDates.dateFrom && {
        "filter.createdAt": `$gte:${filterDates.dateFrom}`,
      }),
      ...(filterDates.dateTo && {
        "filter.createdAt": `$lte:${filterDates.dateTo}`,
      }),
    };

    api.getActivityHistory(queryParams).then((res) => {
      console.log("__getActivityHistoryUser", res);
      // @ts-ignore
      setHistory(res?.data);
    });
    if (session.data?.user.id) {
      api
        .getAcitvityDashboardByUser(session.data?.user.id as string, "all")
        .then((_res) => {
          setActivityData(_res?.data);
        });
      dispatch(
        actionGetUserDashBoardById(
          session.data?.user.id as string,
          (res) => {
            setDashboard(res);
          },
          () => {}
        )
      );
    }
  }, [query, filterDates]);
  return (
    <>
      <Stack
        width="full"
        direction={{ base: "column-reverse", md: "column-reverse" }}
        style={{ height: "100%" }}
        gap={6}
        mb={5}
      >
        {dashboard ? (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
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
                    border: "1px solid " + Colors(colorMode === "dark").PRIMARY,
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
                      labels: activityData.map((item) =>
                        helper.formatDate(item.activity_date)
                      ),
                      datasets: [
                        {
                          label: "Activity Points",
                          data: activityData.map((item) => item.total_points),
                          fill: false,
                          backgroundColor: Colors(colorMode === "dark").PRIMARY,
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
      </Stack>
      {/* filter by date to date */}
      <HStack w={"full"}>
        <Input
          maxW={"200px"}
          type="date"
          value={filterDates.dateFrom}
          onChange={(e) => {
            const newDateFrom = new Date(e.target.value);
            const currentTo = new Date(filterDates.dateTo);
            if (newDateFrom < currentTo) {
              // @ts-ignore
              setFilterDates((oldState) =>
                helper.mappingState(oldState, {
                  dateFrom: e.target.value,
                })
              );
            }
          }}
        />
        <Input
          maxW={"200px"}
          type="date"
          value={filterDates.dateTo}
          onChange={(e) => {
            const newDateTo = new Date(e.target.value);
            const currentFrom = new Date(filterDates.dateFrom);
            if (newDateTo > currentFrom) {
              // @ts-ignore
              setFilterDates((oldState) =>
                helper.mappingState(oldState, {
                  dateTo: e.target.value,
                })
              );
            }
          }}
        />
        <Text
          style={{
            display:
              filterDates.dateFrom && filterDates.dateTo ? "unset" : "none",
          }}
        >
          Filter Dates:{" "}
          <Text
            as="span"
            style={{
              color: Colors(colorMode === "dark").PRIMARY,
            }}
          >
            {filterDates.dateFrom}
          </Text>{" "}
          -{" "}
          <Text
            as="span"
            style={{
              color: Colors(colorMode === "dark").PRIMARY,
            }}
          >
            {filterDates.dateTo}
          </Text>
        </Text>
      </HStack>
      <TableContainer mt={5} w="full">
        <Table
          variant="striped"
          size={{
            base: "sm",
            md: "lg",
          }}
        >
          <TableCaption>
            {history?.meta.totalItems} activities in {history?.meta.totalPages}{" "}
            pages
          </TableCaption>
          <Thead>
            <Tr>
              <Th>{getTranslate("ACTIVITY")}</Th>
              <Th>Date</Th>
              <Th isNumeric>Point Received</Th>
            </Tr>
          </Thead>
          <Tbody>
            {history?.data.map((item: HistoryActivityType) => (
              <Tr>
                <Td>
                  {getCurrentLanguage().code === "vi"
                    ? helper.getTranslationFromHistoryAcitvityVi(
                        item.activityType
                      )
                    : helper.getTranslationFromHistoryAcitvityEn(
                        item.activityType
                      )}
                </Td>
                <Td>
                  {helper.formatDate(
                    item.createdAt,
                    false,
                    "HH:mm:ss - DD/MM/YYYY"
                  )}
                </Td>
                <Td isNumeric>{item.pointChange}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>
      <Flex alignItems={"center"} justifyContent={"center"} w={"full"}>
        <HStack spacing={3}>
          {history
            ? history?.meta.totalPages > 1 &&
              numberOfPages.map((_, index) => {
                if (
                  index < 1 || // first page
                  index > numberOfPages.length - 2 || // last page
                  (pageNumber && Math.abs(pageNumber - index - 1) <= 1) // 1 page around current page
                ) {
                  return (
                    <Button
                      key={index}
                      size={"xs"}
                      variant={"outline"}
                      bg={
                        pageNumber
                          ? pageNumber === index + 1
                            ? "orange.500"
                            : Colors(colorMode === "dark").PRIMARY_BG
                          : index == 0
                          ? "orange.500"
                          : Colors(colorMode === "dark").PRIMARY_BG
                      }
                      color={
                        pageNumber
                          ? pageNumber === index + 1
                            ? "white"
                            : Colors(colorMode === "dark").BORDER
                          : index == 0
                          ? "white"
                          : Colors(colorMode === "dark").BORDER
                      }
                      onClick={() => pageNumClick(index + 1, limit)}
                    >
                      {index + 1}
                    </Button>
                  );
                } else if (
                  (index === 1 && pageNumber > 3) || // after first page and current page is greater than 3
                  (index === numberOfPages.length - 2 &&
                    pageNumber < numberOfPages.length - 2) // before last page and current page is less than total pages - 2
                ) {
                  return <Text key={index}>...</Text>;
                } else {
                  return null;
                }
              })
            : null}
        </HStack>
        <Spacer />
        <HStack spacing={3} ml={5}>
          {limitations.map((_limit, index) => (
            <Button
              key={index}
              size={"xs"}
              alignItems={"center"}
              justifyContent={"center"}
              _hover={{
                color: Colors(colorMode === "dark").PRIMARY,
              }}
              color={
                limit === _limit
                  ? Colors(colorMode === "dark").PRIMARY
                  : "gray.300"
              }
              variant={"link"}
              onClick={() => pageNumClick(1, _limit)}
            >
              {_limit}
            </Button>
          ))}
        </HStack>
      </Flex>
    </>
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
export default TabActivity;
