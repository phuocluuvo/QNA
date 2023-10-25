import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { clientNamespaces } from "ni18n";
import {
  Button,
  Flex,
  HStack,
  Select,
  Spacer,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import QuestionItem from "@/components/QuestionItem";
import TabsQuestion from "@/components/TabsQuestion";
import { useDispatch } from "react-redux";
import actionGetQuestionList from "@/API/redux/actions/question/ActionGetQuestionList";
import { QuestionListType } from "@/util/type/Question.type";
import { useRouter } from "next/router";
import { Colors } from "@/assets/constant/Colors";
import SelectOptions from "@/components/SelectOptions";
const limitations = [5, 10, 15, 20];
const sortOptions = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
  {
    label: "Most voted",
    value: "most-voted",
  },
  {
    label: "Least voted",
    value: "least-voted",
  },
];
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
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (questionList?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(questionList?.meta.totalPages)];
  useEffect(() => {
    dispatch(
      // @ts-ignore
      actionGetQuestionList(
        {
          limit: limit ? limit : 10,
          page: pageNumber ? pageNumber : 1,
        },
        (res: QuestionListType) => {
          setQuestionList(res);
        }
      )
    );
  }, [router.query.limit, router.query.page]);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const pageNumClick = (pageNumber: number, limit: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, limit: limit, page: pageNumber },
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
      <HStack
        spacing={3}
        px={{ base: 0, md: 10 }}
        height={"full"}
        w={"full"}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
      >
        <VStack alignItems={"end"} flex={{ base: 1, md: 0.8 }}>
          <SelectOptions
            containerStyle={{
              fontSize: "xs",
              variant: "filled",
              w: "fit-content",
            }}
            data={sortOptions}
            onSelect={(e) => {
              router.push({
                pathname: router.pathname,
                query: { ...router.query, sort: e.target.value },
              });
            }}
          />
          <Flex alignItems={"start"} justifyContent={"start"} wrap={"wrap"}>
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              mb={10}
              w={"full"}
            >
              <HStack spacing={3}>
                {questionList
                  ? questionList?.meta.totalPages > 0 &&
                    numberOfPages.map((_, index) => (
                      <Button
                        key={index}
                        w={10}
                        h={10}
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
            {questionList?.items.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                isLast={index === questionList?.items.length - 1}
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
                        w={10}
                        h={10}
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

        <TabsQuestion
          containerStyles={{
            pos: "sticky",
            top: "11%",
            flex: { base: 0, md: 0.2 },
            display: { base: "none", md: "flex" },
          }}
        />
      </HStack>
    </Fragment>
  );
}

// @ts-ignore
export async function getServerSideProps({ params, query, ...props }) {
  return {
    props: {
      // @ts-ignore
      ...clientNamespaces(["home-page"]),
    },
  };
}
