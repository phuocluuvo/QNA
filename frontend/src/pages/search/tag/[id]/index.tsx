import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { clientNamespaces } from "ni18n";
import {
  Box,
  Button,
  Code,
  Collapse,
  Flex,
  HStack,
  Heading,
  IconButton,
  Spacer,
  Tag,
  Text,
  VStack,
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
import SelectOptions from "@/components/SelectOptions";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import FilterColumn from "@/components/FilterColumn";
import { BiFilter, BiFilterAlt } from "react-icons/bi";
import { GetQuesionParams } from "@/API/type/params/Question.params";
import {
  SORT_DATA_EN,
  SORT_DATA_VI,
  SORT_ORDER_DATA_EN,
  SORT_ORDER_DATA_VI,
} from "@/assets/constant/Filter.data";
import TagList from "@/components/TagList";
import { TagType } from "@/util/type/Tag.type";
import actionSearchTags from "@/API/redux/actions/tags/ActionSearchTag";
import actionGetTag from "@/API/redux/actions/tags/ActionGetTag";
const limitations = [5, 10, 15, 20];

export default function TagPage() {
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

  const { getTranslate, getCurrentLanguage } = LanguageHelper(Pages.HOME);
  const [valueSort, setValueSort] = useState("title");
  const [isDecending, setIsDecending] = useState("ASC");
  const [tagDetail, setTagDetail] = useState<TagType | null>(null);
  const { isOpen, onToggle } = useDisclosure();
  useEffect(() => {
    const defaultLimit = 10;
    const defaultPage = 1;
    const defaultSortBy = "title";
    const defaultOrderBy = "ASC";
    console.log("router.query", router.query);
    const queryParams: GetQuesionParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      ...(router.query.id && {
        "filter.tags": `${router.query.id}`,
      }),
      sortBy: router.query.sortBy
        ? `${router.query.sortBy}:${router.query.orderBy || defaultOrderBy}`
        : `${defaultSortBy}:${defaultOrderBy}`,
    };

    setValueSort((router.query.sortBy as string) ?? "title");
    setIsDecending((router.query.orderBy as string) ?? "ASC");

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

    dispatch(
      actionGetTag(
        router.query.id as string,
        (res: TagType) => {
          setTagDetail(res);
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
    router.push({
      pathname: router.pathname,
      query: { ...router.query, limit: limit, page: pageNumber },
    });
  };
  const applyFilter = () => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sortBy: valueSort, orderBy: isDecending },
    });
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
      <Flex
        gap={3}
        px={{ base: 5, md: 10 }}
        height={"full"}
        w={"full"}
        direction={{ base: "column", md: "row" }}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
      >
        <VStack alignItems={"end"} flex={{ base: 1, md: 0.8 }}>
          <VStack alignItems={"start"}>
            <Heading size={"md"} fontWeight={"medium"}>
              All question from <Tag size={"lg"}>{tagDetail?.name}</Tag>
            </Heading>
            <Text
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                fontSize: "xs",
              }}
            >
              {tagDetail?.content}
            </Text>
          </VStack>
          <HStack
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
          >
            <Text>{QuestionNumberTitle()}</Text>
            <VStack flex={1} alignItems={"flex-end"}>
              <HStack>
                <SelectOptions
                  getTranslate={getTranslate}
                  containerStyle={{
                    fontSize: "xs",
                    variant: "filled",
                    w: "fit-content",
                  }}
                  onSelect={(e) => {
                    router.push({
                      pathname: router.pathname,
                      query: { ...router.query, select: e.target.value },
                    });
                  }}
                />
                <Button
                  aria-label="Search database"
                  leftIcon={<BiFilterAlt />}
                  onClick={onToggle}
                >
                  {getTranslate("FILTER")}
                </Button>
              </HStack>
            </VStack>
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
                  defaultValue={(router.query.sortBy as string) ?? "title"}
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
                  ? questionList?.meta.totalPages > 0 &&
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
                  ? questionList?.meta.totalPages > 0 &&
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
        <VStack
          flex={{ base: 1, md: 0.2 }}
          w={"full"}
          style={{
            position: "sticky",
            top: "11%",
          }}
          p={0}
          m={0}
        >
          <TabsQuestion
            router={router}
            getTranslate={getTranslate}
            containerStyles={{
              flex: 1,
            }}
          />
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
      </Flex>
    </Fragment>
  );
}
