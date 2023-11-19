import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { clientNamespaces } from "ni18n";
import { Flex, HStack, Text, VStack, useColorMode } from "@chakra-ui/react";
import QuestionItem from "@/components/QuestionItem";
import { useRouter } from "next/router";
import { QuestionListType, QuestionType } from "@/util/type/Question.type";
import TabsQuestion from "@/components/TabsQuestion";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { useDispatch } from "react-redux";
import actionGetQuestionList from "@/API/redux/actions/question/ActionGetQuestionList";
export default function Search() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [questions, setQuestions] = useState<QuestionListType | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const dispatch = useDispatch();
  useEffect(() => {
    let search = router.query.q as string;
    if (search) {
      dispatch(
        // @ts-ignore
        actionGetQuestionList(
          {
            limit: 10,
            page: 1,
            search: search,
          },
          (res) => {
            if (res.data.length === 0) {
              setIsNotFound(true);
              setQuestions(null);
            } else {
              setIsNotFound(false);
              setQuestions(res);
            }
          },
          () => {}
        )
      );
    }

    if (isNotFound) {
      dispatch(
        // @ts-ignore
        actionGetQuestionList(
          {
            limit: 3,
            page: 1,
          },
          (res) => {
            setQuestions(res);
          },
          () => {}
        )
      );
    }
  }, [router.query.q, isNotFound]);
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
            Result for "{router.query.q}" (
            {questions ? questions.data.length : 0} results)
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
            {questions?.data.map((question, index) => (
              <QuestionItem
                key={index}
                question={question}
                isLast={index === questions.data.length - 1}
                isDarkMode={colorMode === "dark"}
              />
            ))}
          </Flex>
          <TabsQuestion
            router={router}
            getTranslate={getTranslate}
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
  // const items = await getPosts(query.limit, query.page);
  const items = undefined;
  return {
    props: {
      data: items ? items : [],
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
