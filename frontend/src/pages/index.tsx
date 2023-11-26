import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { clientNamespaces } from "ni18n";
import {
  Button,
  Collapse,
  Flex,
  HStack,
  Heading,
  Spacer,
  Stack,
  Text,
  VStack,
  styled,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import QuestionItem from "@/components/QuestionItem";
import TabsQuestion from "@/components/TabsQuestion";
import { useDispatch } from "react-redux";
import actionGetQuestionList from "@/API/redux/actions/question/ActionGetQuestionList";
import { QuestionListType } from "@/util/type/Question.type";
import { useRouter } from "next/router";
import { Colors } from "@/assets/constant/Colors";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import FilterColumn from "@/components/FilterColumn";
import { BiFilterAlt } from "react-icons/bi";
import { GetQuesionParams } from "@/API/type/params/Question.params";
import {
  SORT_DATA_EN,
  SORT_DATA_VI,
  SORT_ORDER_DATA_EN,
  SORT_ORDER_DATA_VI,
} from "@/assets/constant/Filter.data";
import TagList from "@/components/TagList";
import { useSession } from "next-auth/react";
import Annoucements from "@/components/Annoucements";

const limitations = [5, 10, 15, 20];

export default function Home() {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const [hydrated, setHydrated] = useState(false);
  const [questionList, setQuestionList] = useState<QuestionListType | null>(
    null
  );
  const router = useRouter();
  const query = router.query;
  const pageNumber = Number(query.page);
  const filter = query.select;
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (questionList?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(questionList?.meta.totalPages)];
  const session = useSession();
  const { getTranslate, getCurrentLanguage } = LanguageHelper(Pages.HOME);
  const [valueSort, setValueSort] = useState("title");
  const [isDecending, setIsDecending] = useState("DESC");
  const { isOpen, onToggle } = useDisclosure();
  useEffect(() => {
    const defaultLimit = 10;
    const defaultPage = 1;
    const defaultSortBy = "created_at";
    const defaultOrderBy = "DESC";

    const queryParams: GetQuesionParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      ...(router.query.select && {
        "filter.type": `$eq:${router.query.select}`,
      }),
      sortBy: router.query.sortBy
        ? `${router.query.sortBy}:${router.query.orderBy || defaultOrderBy}`
        : `${defaultSortBy}:${defaultOrderBy}`,
    };

    setValueSort((router.query.sortBy as string) ?? "created_at");
    setIsDecending((router.query.orderBy as string) ?? "DESC");

    dispatch(
      // @ts-ignore
      actionGetQuestionList(
        queryParams,
        (res: QuestionListType) => {
          setQuestionList(res);
        },
        () => {
          console.log("error");
        }
      )
    );
  }, [router.query]);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  const QuestionNumberTitle = () => {
    return (
      questionList?.meta &&
      (questionList.meta.totalItems > 0
        ? getTranslate("THERE_ARE_QUESTIONS").replace(
            "{0}",
            questionList.meta.totalItems.toString() ?? "0"
          )
        : getTranslate("THERE_IS_QUESTION").replace(
            "{0}",
            questionList.meta.totalItems.toString() ?? "0"
          ))
    );
  };
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
  return (
    <Fragment>
      <Head>
        <title>Question Dân It</title>
        <meta
          name="description"
          content="The website answers the question about IT"
        />
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
      </Head>
      <VStack alignItems={"end"} flex={{ base: 1, md: 0.8 }}>
        <Stack
          direction={{ base: "column", md: "row" }}
          w={"full"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <VStack alignItems={"start"}>
            <Heading size={"lg"} fontWeight={"medium"}>
              {getTranslate("ALL_QUESTION")}
            </Heading>
            <Text>{QuestionNumberTitle()}</Text>
          </VStack>
          <VStack flex={1} alignItems={"flex-end"}>
            <HStack>
              <Button
              variant={"main_button"}
                size={"sm"}
                onClick={() => {
                  router.push({
                    pathname: "/question/create",
                  });
                }}
              >
                {getTranslate("ASK_QUESTION")}
              </Button>
              <HStack spacing={0}>
                <FilterButton
                  style={{
                    borderColor:
                      filter === "no_answer"
                        ? Colors(colorMode === "dark").PRIMARY
                        : "transparent",
                    padding: "5px 10px",
                    borderEndEndRadius: 0,
                    borderStartEndRadius: 0,
                  }}
                  size={"sm"}
                  isActive={filter === "no_answer" || !filter}
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
          </VStack>
        </Stack>
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
                  getCurrentLanguage().code === "en"
                    ? SORT_DATA_EN
                    : SORT_DATA_VI
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
        <Flex
          alignItems={"start"}
          w={"full"}
          justifyContent={"start"}
          wrap={"wrap"}
        >
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            mb={{ base: 3, md: 10 }}
            w={"full"}
          >
            <HStack spacing={3}>
              {questionList
                ? questionList?.meta.totalPages > 1 &&
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
          {questionList?.data.map((question, index) => (
            <QuestionItem
              key={index}
              question={question}
              isLast={index === questionList?.data.length - 1}
              isDarkMode={colorMode === "dark"}
            />
          ))}
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            mt={10}
            mb={10}
            w={"full"}
          >
            <HStack spacing={3}>
              {questionList
                ? questionList?.meta.totalPages > 1 &&
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
        </Flex>
      </VStack>
      <VStack flex={{ base: 1, md: 0.2 }} w={"full"} p={0} m={0}>
        <TabsQuestion
          router={router}
          getTranslate={getTranslate}
          containerStyles={{
            flex: 1,
          }}
        />
        <Annoucements />
        <TagList
          router={router}
          getTranslate={getTranslate}
          containerStyles={{
            flex: 1,
            w: "full",
            my: 5,
          }}
        />
      </VStack>
    </Fragment>
  );
}
const FilterButton = styled(Button, {
  baseStyle: {
    padding: "5px 10px",
  },
});
// @ts-ignore
export async function getServerSideProps({ params, query, ...props }) {
  return {
    props: {
      // @ts-ignore
      ...clientNamespaces(["home-page"]),
    },
  };
}
