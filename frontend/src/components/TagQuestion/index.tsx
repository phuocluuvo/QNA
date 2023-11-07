import { TagType } from "@/util/type/Tag.type";
import { Tag, TagProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  tag: TagType | string;
  style?: TagProps;
};

function TagQuestion({ tag, style }: Props) {
  const router = useRouter();
  const isTagNames = typeof tag === "string";
  return (
    <Tag
      key={isTagNames ? tag : tag.id}
      size={"sm"}
      colorScheme={"telegram"}
      py={1}
      px={2}
      pos={"relative"}
      zIndex={10}
      rounded={"full"}
      cursor={"pointer"}
      _hover={{
        bgColor: "orange.400",
        color: "white",
        transition: "all 0.3s ease-in-out",
      }}
      {...style}
      onClick={() =>
        router.push(
          router.basePath + `/search/tag/${isTagNames ? tag : tag.name}`
        )
      }
    >
      {typeof tag !== "string" ? tag.name : tag}
    </Tag>
  );
}

export default TagQuestion;
