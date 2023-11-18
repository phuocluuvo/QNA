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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
const limitations = [5, 10, 15, 20];

function TabActivity() {
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
          variant="striped"
          size={{
            base: "sm",
            md: "lg",
          }}
        >
          <TableCaption>
            {history?.meta.itemCount} activities in {history?.meta.itemCount}{" "}
            pages
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Activity</Th>
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
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        mb={{ base: 3, md: 10 }}
        w={"full"}
      >
        <HStack spacing={3}>
          {history
            ? history?.meta.totalPages > 1 &&
              numberOfPages.map((_, index) => (
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
              ))
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
