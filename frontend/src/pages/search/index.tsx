import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { clientNamespaces } from "ni18n";
import QuestionDataList from "../../util/mock/QuestionDataList.mock";
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { Colors } from "@/assets/constant/Colors";
import QuestionItem from "@/components/QuestionItem";
import { useRouter } from "next/router";
import { PostType } from "@/util/type/Post.type";
import TabsQuestion from "@/components/TabsQuestion";
export default function Search() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [questions, setQuestions] = useState<Array<PostType>>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  useEffect(() => {
    if (router.query.q) {
      let questions = QuestionDataList.postList.filter((question) =>
        question.title
          .toLocaleLowerCase()
          .includes(router.query.q?.toString().toLocaleLowerCase() || "")
      );
      if (questions.length === 0) {
        //get random 3 question
        let randomQuestion = QuestionDataList.postList
          .sort(() => Math.random() - Math.random())
          .slice(0, 3);
        setIsNotFound(true);
        setQuestions(randomQuestion);
      } else {
        setIsNotFound(false);
        setQuestions(questions);
      }
    }
  }, [router.query.q]);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }

  return (
    <Fragment>
      <Head>
        <title>Result for {router.query.q}</title>
        <meta name="description" content={`Result for ${router.query.q}`} />
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
      </Head>
      <VStack>
        {isNotFound ? (
          <>
            <Text
              fontSize={"xl"}
              fontWeight={"bold"}
              w={"full"}
              paddingLeft={{ base: 1, md: 10 }}
            >
              No result for "{router.query.q}"
            </Text>
            <Text
              fontSize={"sm"}
              fontStyle={"italic"}
              w={"full"}
              paddingLeft={{ base: 1, md: 10 }}
            >
              These are some random questions that you might be interested in
            </Text>
          </>
        ) : (
          <Text
            fontSize={"xl"}
            fontWeight={"bold"}
            // color={Colors(colorMode === "dark").PRIMARY}
            w={"full"}
            paddingLeft={{ base: 1, md: 10 }}
          >
            Result for "{router.query.q}" ({questions.length} results)
          </Text>
        )}
        <HStack
          spacing={3}
          px={{ base: 0, md: 10 }}
          height={"full"}
          w={"full"}
          alignItems={"flex-start"}
        >
          <Flex
            alignItems={"start"}
            justifyContent={"start"}
            wrap={"wrap"}
            flex={{ base: 1, md: 0.8 }}
          >
            {questions.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                isLast={index === questions.length - 1}
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
      </VStack>
    </Fragment>
  );
}
// export const getStaticProps = async (props) => {
//   return {
//     props: {
//       // ...(await loadTranslations(ni18nConfig, props.locale, [
//       //   "server-namespace",
//       // ])),
//       ...clientNamespaces(["Search-page"]),
//     },
//   };
// };

// @ts-ignore
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
      // @ts-ignore
      ...clientNamespaces(["Search-page"]),
    },
  };
}
