import actionGetQuestionList from "@/API/redux/actions/question/ActionGetQuestionList";
import { GetQuesionParams } from "@/API/type/params/Question.params";
import { Colors } from "@/assets/constant/Colors";
import {
  SORT_ORDER_DATA_EN,
  SORT_ORDER_DATA_VI,
  SORT_DATA_ADMIN_EN,
  SORT_DATA_ADMIN_VI,
} from "@/assets/constant/Filter.data";
import { Pages } from "@/assets/constant/Pages";
import FilterColumn from "@/components/FilterColumn";
import QuestionItem from "@/components/QuestionItem";
import SelectOptions from "@/components/SelectOptions";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { QuestionListType } from "@/util/type/Question.type";
import {
  HStack,
  VStack,
  Heading,
  Button,
  useDisclosure,
  Flex,
  Spacer,
  useColorMode,
  Collapse,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
const limitations = [10, 20, 30, 40];
function QuestionCensoring() {
  const dispatch = useDispatch();
  const router = useRouter();
  const query = router.query;
  const pageNumber = Number(query.page);
  const [questionList, setQuestionList] = useState<QuestionListType | null>(
    null
  );
  const { colorMode } = useColorMode();
  const filter = query.select;
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (questionList?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(questionList?.meta.totalPages)];
  const { getTranslate, getCurrentLanguage } = LanguageHelper(Pages.HOME);
  const [valueSort, setValueSort] = useState("pending");
  const [isDecending, setIsDecending] = useState("ASC");
  const { isOpen, onToggle } = useDisclosure();
  const session = useSession();

  function getPendingQuesiton() {}

  useEffect(() => {
    const defaultLimit = 10;
    const defaultPage = 1;
    const defaultSortBy = "pending";
    const defaultOrderBy = "ASC";

    const queryParams: GetQuesionParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      ...(router.query.select && {
        "filter.state": `$eq:${router.query.select}`,
      }),
      sortBy: router.query.sortBy
        ? `${router.query.sortBy}:${router.query.orderBy || defaultOrderBy}`
        : `${defaultSortBy}:${defaultOrderBy}`,
    };

    setValueSort((router.query.select as string) ?? "pending");
    setIsDecending((router.query.orderBy as string) ?? "ASC");
    helper.gaurdsRouteRoles(
      session.data?.user.role ?? "user",
      () => {
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
      },
      () => {
        router.push("/");
      }
    );
  }, [router.query]);
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
    <VStack alignItems={"end"} flex={{ base: 1, md: 1 }}>
      <HStack
        w={"full"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
      >
        <VStack alignItems={"start"}>
          <Heading size={"lg"} fontWeight={"medium"}>
            {getTranslate("ALL_QUESTION")} [{valueSort}]
          </Heading>
        </VStack>
        <VStack flex={1} alignItems={"flex-end"}>
          <HStack>
            <SelectOptions
              defaultValues="pending"
              getTranslate={getTranslate}
              data={[
                {
                  value: "pending",
                  label: getTranslate("PENDING"),
                },
                {
                  value: "verified",
                  label: getTranslate("VERIFIED"),
                },
                {
                  value: "blocked",
                  label: getTranslate("BLOCKED"),
                },
              ]}
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
                  ? SORT_DATA_ADMIN_EN
                  : SORT_DATA_ADMIN_VI
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
            isVerifyItem={true}
            key={index}
            onClick={() => {
              router.push("/censoring/question/" + question.id);
            }}
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
  );
}

export default QuestionCensoring;
