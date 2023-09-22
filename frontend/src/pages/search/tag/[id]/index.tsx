"use client";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import QuestionItem from "@/components/QuestionItem";
import Head from "next/head";
import { useColorMode } from "@chakra-ui/system";
import questionDataList from "@/util/mock/QuestionDataList.mock";
import { PostType } from "@/util/type/Post.type";
import { Container, VStack } from "@chakra-ui/react";

function TagPage() {
  const router = useRouter();
  const { id } = router.query;
  const [listQuestionByTag, setListQuestionByTag] = useState<PostType[]>([]);
  const { colorMode } = useColorMode();
  useEffect(() => {
    // get list question by object tag
    const listQuestionByTag = questionDataList.postList.filter((question) =>
      question?.tags?.find((tag) => tag.name === id)
    );
    setListQuestionByTag(listQuestionByTag);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Result for {router.query.id}</title>
        <meta name="description" content={`Result for ${router.query.id}`} />
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
      </Head>
      <VStack>
        {listQuestionByTag.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            isLast={index === listQuestionByTag.length - 1}
            isDarkMode={colorMode === "dark"}
          />
        ))}
      </VStack>
    </Fragment>
  );
}

export default TagPage;
