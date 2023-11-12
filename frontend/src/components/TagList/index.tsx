import actionGetTagList from "@/API/redux/actions/tags/ActionGetTagList";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { TagListType, TagType } from "@/util/type/Tag.type";
import {
  Box,
  BoxProps,
  HStack,
  Heading,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NextRouter, useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import TagQuestion from "../TagQuestion";
type Props = {
  tags?: string;
  containerStyles?: BoxProps;
  router: NextRouter;
  getTranslate: (key: string) => string;
};
function TagList(props: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [tags, setTags] = useStateWithCallback<TagListType | null>(null);
  function fecthTags() {
    dispatch(
      actionGetTagList(
        {
          page: 1,
          limit: 10,
        },
        (res: TagListType) => {
          let results = res.data.filter(
            (tag: TagType) => tag.questionsNumber > 0
          );
          // sort results
          results.sort((a: TagType, b: TagType) => {
            return b.questionsNumber - a.questionsNumber;
          });
          res = {
            ...res,
            data: results,
          };
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
      <VStack spacing={2} align={"flex-start"} mb={2}>
        {tags?.data.map((tag: TagType) => (
          <HStack key={tag.id}>
            <TagQuestion tag={tag} displayQuestionNumber={true} />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

export default TagList;
