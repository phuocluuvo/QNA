import actionGetTagList from "@/API/redux/actions/tags/ActionGetTagList";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { TagListType, TagType } from "@/util/type/Tag.type";
import { Box, BoxProps, HStack, Heading, Tag, Text } from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
type Props = {
  tags?: string;
  containerStyles?: BoxProps;
  router: NextRouter;
  getTranslate: (key: string) => string;
};
function TagList(props: Props) {
  const dispatch = useDispatch();
  const [tags, setTags] = useStateWithCallback<TagListType | null>([]);
  function fecthTags() {
    dispatch(
      actionGetTagList(
        {
          page: 1,
          limit: 10,
        },
        (res: TagListType) => {
          // @ts-ignore
          setTags(res);
        },
        () => {}
      )
    );
  }
  React.useEffect(() => {
    fecthTags();
  }, []);
  return (
    <Box {...props.containerStyles}>
      <Heading size={"sm"} mb={2}>
        {props.getTranslate("RELATED_TAGS")}
      </Heading>
      {tags?.data?.map((tag: TagType) => (
        <HStack>
          <Tag key={tag.id}>{tag.name}</Tag>
          <Text> x {tag.questionsNumber}</Text>
        </HStack>
      ))}
    </Box>
  );
}

export default TagList;
