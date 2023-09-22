import { TagType } from "@/util/type/Tag.type";
import { Tag, TagProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  tag: TagType;
  style?: TagProps;
};

function TagQuestion({ tag, style }: Props) {
  const router = useRouter();
  return (
    <Tag
      key={tag.id}
      size={"md"}
      colorScheme={"telegram"}
      py={1}
      px={2}
      my={2}
      rounded={"full"}
      cursor={"pointer"}
      _hover={{
        bgColor: "orange.400",
        color: "white",
        transition: "all 0.3s ease-in-out",
      }}
      {...style}
      onClick={() => router.push(router.basePath + `/search/tag/${tag.name}`)}
    >
      {tag.name}
    </Tag>
  );
}

export default TagQuestion;
