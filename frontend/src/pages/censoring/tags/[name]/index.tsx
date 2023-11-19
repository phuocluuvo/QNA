import actionGetTag from "@/API/redux/actions/tags/ActionGetTag";
import { TagListType, TagType } from "@/util/type/Tag.type";
import { Badge, Box, Container, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function TagCensorePage() {
  const router = useRouter();
  const [tagDetail, setTagDetail] = React.useState<TagType | null>(null);
  const dispatch = useDispatch();
  const getTag = () => {
    dispatch(
      actionGetTag(
        router.query.name as string,
        (res: TagListType) => {
          if (res.data.length > 0) {
            setTagDetail(res.data.at(0) as TagType);
          }
        },
        () => {
          console.log("error");
        }
      )
    );
  };
  useEffect(() => {
    getTag();
  }, [router.query.id]);
  return (
    <Container>
      <Heading>{tagDetail?.name}</Heading>
      <Box>
        <Heading size="md">Censoring</Heading>
        <Text>{tagDetail?.content}</Text>
        <Badge colorScheme="green">{tagDetail?.state}</Badge>
        <Text>used by {tagDetail?.questionsNumber}</Text>
      </Box>
    </Container>
  );
}

export default TagCensorePage;
