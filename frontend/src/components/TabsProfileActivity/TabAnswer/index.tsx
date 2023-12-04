import api from "@/API/api";
import { Colors } from "@/assets/constant/Colors";
import {
  SORT_DATA_EN,
  SORT_DATA_VI,
  SORT_ORDER_DATA_EN,
  SORT_ORDER_DATA_VI,
} from "@/assets/constant/Filter.data";
import { Pages } from "@/assets/constant/Pages";
import AnswerItem from "@/components/AnswerItem";
import FilterColumn from "@/components/FilterColumn";
import { LanguageHelper } from "@/util/Language/Language.util";
import { AnswerListType } from "@/util/type/Answer.type";
import { UserType } from "@/util/type/User.type";
import {
  Button,
  Collapse,
  Divider,
  Flex,
  HStack,
  Spacer,
  Text,
  VStack,
  styled,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
type sortByData = {
  questions: "votes" | "createdAt";
  answers: "votes" | "createdAt";
  tags: "questionsNumber" | "createdAt";
  dateActivity: string;
};
const limitations = [5, 10, 15, 20];
function TabAnswer({ user }: { user: UserType }) {
  const [hydrated, setHydrated] = useState(false);
  const [answerList, setAnswerList] = useState<AnswerListType | null>(null);
  const [sortBy, setSortBy] = useState<sortByData>({
    questions: "votes",
    answers: "votes",
    tags: "questionsNumber",
    dateActivity: "all",
  });
  const [valueSort, setValueSort] = useState("title");
  const [isDecending, setIsDecending] = useState("DESC");
  const dispatch = useDispatch();
  const { isOpen, onToggle } = useDisclosure();
  const { getTranslate, getCurrentLanguage } = LanguageHelper(Pages.HOME);
  const router = useRouter();
  const query = router.query;
  const filter = query.select;
  const pageNumber = Number(query.page);
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (answerList?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(answerList?.meta.totalPages)];
  const { colorMode } = useColorMode();
  useEffect(() => {
    const defaultLimit = 10;
    const defaultPage = 1;
    const defaultSortBy = "created_at";
    const defaultOrderBy = "DESC";

    const queryParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      "filter.user.id": `${user.id}`,
      sortBy: router.query.sortBy
        ? `${router.query.sortBy}:${router.query.orderBy || defaultOrderBy}`
        : `${defaultSortBy}:${defaultOrderBy}`,
    };

    setValueSort((router.query.sortBy as string) ?? "created_at");
    setIsDecending((router.query.orderBy as string) ?? "DESC");
    setTimeout(() => {
      api
        .getAllAnswerByUser(user.id as string, sortBy.questions, queryParams)
        .then((_res) => {
          console.log("answer list", _res?.data);
          setAnswerList(_res?.data);
        });
    }, 500);
  }, [user.id, router.query, sortBy.questions]);
  const pageNumClick = (pageNumber: number, limit: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, limit: limit, page: pageNumber },
      },
      undefined,
      { shallow: true }
    );
  };
  const applyFilter = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sortBy: valueSort, orderBy: isDecending },
      },
      undefined,
      { shallow: true }
    );
  };
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <SectionContainer height="full">
      <HStack w={"full"} justifyContent={"space-between"} alignItems={"center"}>
        <TitleData>{getTranslate("ALL_ANSWER")}</TitleData>
        <HStack spacing={0}>
          {/* All button */}
          <FilterButton
            size={"sm"}
            style={{
              borderColor:
                filter === "no_answer"
                  ? Colors(colorMode === "dark").PRIMARY
                  : "transparent",
              padding: "5px 10px",
              borderEndEndRadius: 0,
              borderStartEndRadius: 0,
            }}
            isActive={!filter}
            onClick={() => {
              router.replace(
                {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    select: "",
                    limit: 10,
                    page: 1,
                  },
                },
                undefined,
                { shallow: true }
              );
            }}
          >
            {getTranslate("ALL")}
          </FilterButton>
          <FilterButton
            style={{
              borderColor:
                filter === "no_answer"
                  ? Colors(colorMode === "dark").PRIMARY
                  : "transparent",
              padding: "5px 10px",
              borderRadius: 0,
            }}
            size={"sm"}
            isActive={filter === "no_answer"}
            onClick={() => {
              router.replace(
                {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    select: "no_answer",
                    limit: 10,
                    page: 1,
                  },
                },
                undefined,
                { shallow: true }
              );
            }}
          >
            {getTranslate("UNANSWERED")}
          </FilterButton>
          <FilterButton
            size={"sm"}
            style={{
              borderColor:
                filter === "no_approved"
                  ? Colors(colorMode === "dark").PRIMARY
                  : "transparent",
              padding: "5px 10px",
              borderEndStartRadius: 0,
              borderStartStartRadius: 0,
            }}
            isActive={filter === "no_approved"}
            onClick={() => {
              router.replace(
                {
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    select: "no_approved",
                    limit: 10,
                    page: 1,
                  },
                },
                undefined,
                { shallow: true }
              );
            }}
          >
            {getTranslate("UNAPPROVED")}
          </FilterButton>
        </HStack>

        <Button
          size={"sm"}
          aria-label="Search database"
          leftIcon={<BiFilterAlt />}
          onClick={onToggle}
        >
          {getTranslate("FILTER")}
        </Button>
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <VStack w={"full"} alignItems={"flex-end"}>
          <HStack
            spacing={10}
            p="20px 40px"
            color="white"
            w={"full"}
            bg={Colors(colorMode === "dark").PRIMARY_BG}
            rounded="md"
            shadow="md"
            justifyContent={"start"}
            alignItems={"start"}
          >
            <FilterColumn
              title={getTranslate("ORDER_BY")}
              value={isDecending}
              setValue={setIsDecending}
              defaultValue={(router.query.orderBy as string) ?? "ASC"}
              dataList={
                getCurrentLanguage().code === "en"
                  ? SORT_ORDER_DATA_EN
                  : SORT_ORDER_DATA_VI
              }
            />

            <FilterColumn
              title={getTranslate("SORT_BY")}
              value={valueSort}
              defaultValue={
                (router.query.sortBy as string)
                  ? (router.query.sortBy as string)
                  : "title"
              }
              setValue={setValueSort}
              dataList={
                getCurrentLanguage().code === "en" ? SORT_DATA_EN : SORT_DATA_VI
              }
            />
          </HStack>
          <Button
            size={"sm"}
            variant={"main_button"}
            onClick={() => applyFilter()}
          >
            {"APPLY"}
          </Button>
        </VStack>
      </Collapse>
      <VerticalDataContainer
        minHeight={
          answerList && answerList?.meta.totalItems > 0
            ? "fit-content"
            : "150px"
        }
        divider={<Divider />}
      >
        {answerList && answerList?.meta.totalItems > 0 ? (
          answerList?.data.map((item) => (
            <AnswerItem
              type="minimals"
              isAuthor={true}
              getTranslate={getTranslate}
              fecthAnswer={() => {}}
              answer={item}
              dispatch={dispatch}
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
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        mt={10}
        mb={10}
        w={"full"}
      >
        <HStack spacing={3}>
          {answerList
            ? answerList?.meta.totalPages > 1 &&
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
              alignItems={"center"}
              justifyContent={"center"}
              _hover={{
                color: Colors(colorMode === "dark").PRIMARY,
              }}
              size={"xs"}
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
    </SectionContainer>
  );
}
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
const TitleData = styled(Text, {
  baseStyle: {
    fontSize: "20px",
    fontWeight: "bold",
    width: "100%",
    marginBottom: "10px",
  },
});
const FilterButton = styled(Button, {
  baseStyle: {
    padding: "5px 10px",
  },
});
export default TabAnswer;
