import { TagType } from "@/util/type/Tag.type";
import { Tag, TagProps, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  tag: TagType | string;
  style?: TagProps;
  displayQuestionNumber?: boolean;
};

function TagQuestion({ tag, style, displayQuestionNumber = false }: Props) {
  const router = useRouter();
  const isTagNames = typeof tag === "string";
  return (
    <>
      <Tag
        key={isTagNames ? tag : tag.id}
        size={"sm"}
        colorScheme={"telegram"}
        py={1}
        px={2}
        pos={"relative"}
        zIndex={2}
        rounded={"full"}
        cursor={"pointer"}
        transition="all 0.2s ease-in-out"
        _hover={{
          bgColor: "orange.400",
          color: "white",
          transition: "all 0.2s ease-in-out",
        }}
        {...style}
        onClick={() =>
          router.push(
            router.basePath + `/search/tag/${isTagNames ? tag : tag.name}`
          )
        }
      >
        {typeof tag !== "string" ? tag.name : tag}
      </Tag>{" "}
      {!isTagNames && displayQuestionNumber ? (
        <Text> x {tag.questionsNumber}</Text>
      ) : null}
    </>
  );
}

export default TagQuestion;
