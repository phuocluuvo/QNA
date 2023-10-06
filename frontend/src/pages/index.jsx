import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { clientNamespaces } from "ni18n";
import { Flex, HStack, useColorMode } from "@chakra-ui/react";

import QuestionItem from "@/components/QuestionItem";
import TabsQuestion from "@/components/TabsQuestion";
import { useDispatch } from "react-redux";
import actionGetQuestionList from "@/API/redux/actions/question/ActionGetQuestionList";
export default function Home() {
  const dispatch = useDispatch();

  const { colorMode } = useColorMode();
  const [hydrated, setHydrated] = useState(false);
  const [questionList, setQuestionList] = useState(null);
  useEffect(() => {
    dispatch(
      actionGetQuestionList((res) => {
        setQuestionList(res.data);
      })
    );
  }, []);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  const pageNumClick = (page, limit) => {
    router.push({
      pathname: router.pathname,
      query: { limit: limit, page: page },
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
      >
        <Flex
          m="auto"
          alignItems={"start"}
          justifyContent={"start"}
          wrap={"wrap"}
          flex={{ base: 1, md: 0.8 }}
        >
          {questionList.postList.map((question, index) => (
            <QuestionItem
              key={index}
              question={question}
              isLast={index === questionList.postList.length - 1}
              isDarkMode={colorMode === "dark"}
            />
          ))}
        </Flex>
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
// export const getStaticProps = async (props) => {
//   return {
//     props: {
//       // ...(await loadTranslations(ni18nConfig, props.locale, [
//       //   "server-namespace",
//       // ])),
//       ...clientNamespaces(["home-page"]),
//     },
//   };
// };

export async function getServerSideProps({ params, query, ...props }) {
  // const postList = await getPosts(query.limit, query.page);
  const postList = undefined;
  return {
    props: {
      postList: postList ? postList : [],
      pagination: {
        current_page: 1,
        limit: 10,
        total_page_number: 1,
      },
      ...clientNamespaces(["home-page"]),
    },
  };
}
