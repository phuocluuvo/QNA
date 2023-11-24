import { ActionGetUserHistory } from "@/API/redux/actions/user/ActionGetActivityHistory";
import { CommonParams } from "@/API/type/params/Common.params";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import ActivityItem from "@/components/ActivityItem";
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
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
const limitations = [5, 10, 15, 20];

function TabActivity({
  getTranslate,
}: {
  getTranslate: (label: string) => string;
}) {
  const [history, setHistory] = React.useState<HistoryActivityListType | null>(
    null
  );
  const { colorMode } = useColorMode();
  const router = useRouter();
  const query = router.query;
  const pageNumber = Number(query.page);
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (history?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(history?.meta.totalPages)];
  const dispatch = useDispatch();

  const pageNumClick = (pageNumber: number, limit: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, limit: limit, page: pageNumber },
    });
  };
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
    };
    // if (router.query.tab === "activity")
    dispatch(
      // @ts-ignore
      ActionGetUserHistory(
        queryParams,
        // @ts-ignore
        (res) => {
          setHistory(res);
        },
        // @ts-ignore
        (err) => {
          console.log(err);
        }
      )
    );
  }, [query]);
  return (
    <>
      <TableContainer mt={5}>
        <Table
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
              <Th>Type</Th>
              <Th>Date</Th>
              <Th isNumeric>Point Received</Th>
            </Tr>
          </Thead>
          <Tbody>
            {history?.data.map((item: HistoryActivityType) => (
              <ActivityItem item={item} key={item.id} />
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        mb={{ base: 3, md: 10 }}
        w={"full"}
      >
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

export default TabActivity;
