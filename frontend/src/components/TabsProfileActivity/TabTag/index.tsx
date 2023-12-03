import api from "@/API/api";
import { Pages } from "@/assets/constant/Pages";
import TagItem from "@/components/TagItem";
import { LanguageHelper } from "@/util/Language/Language.util";
import { TagType } from "@/util/type/Tag.type";
import { UserType } from "@/util/type/User.type";
import {
  Button,
  Divider,
  HStack,
  Text,
  VStack,
  styled,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
function TabTag({ user }: { user: UserType }) {
  const [hydrated, setHydrated] = useState(false);
  const [tagList, setTagList] = useState<TagType[]>([]);
  const { getTranslate, getCurrentLanguage } = LanguageHelper(Pages.HOME);
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      api.getAllTagsByUser(user.id as string, "createdAt").then((_res) => {
        setTagList(_res?.data);
      });
    }, 500);
  }, [user.id, router.query]);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <SectionContainer height="full">
      <HStack w={"full"} justifyContent={"space-between"} alignItems={"center"}>
        <TitleData>{getTranslate("ALL_TAG")}</TitleData>
      </HStack>
      <VerticalDataContainer divider={<Divider />}>
        {tagList && tagList?.length > 0 ? (
          tagList?.map((item) => <TagItem tag={item} type="simple" />)
        ) : (
          <Text
            style={{
              fontStyle: "italic",
            }}
          >
            This user has asked no question
          </Text>
        )}
      </VerticalDataContainer>
    </SectionContainer>
  );
}
const VerticalDataContainer = styled(VStack, {
  baseStyle: {
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "10px",
    height: "100%",
    minHeight: "150px",
    paddingBottom: "10px",
    justifyContent: "center",
    alignItems: "center",
  },
});
const SectionContainer = styled(VStack, {
  baseStyle: {
    flex: 1,
    width: "auto",
    height: "100%",
    justifyContent: "start",
    alignItems: "flex-start",
  },
});
const TitleData = styled(Text, {
  baseStyle: {
    fontSize: "20px",
    fontWeight: "bold",
    width: "100%",
    marginBottom: "10px",
  },
});
const FilterButton = styled(Button, {
  baseStyle: {
    padding: "5px 10px",
  },
});
export default TabTag;
