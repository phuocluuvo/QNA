import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { UserType } from "@/util/type/User.type";
import { Avatar, Box, HStack, Heading, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

function TabProfile({ user }: { user: UserType }) {
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );
  const inputRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <Box flex={1} display={"flex"} w={"80vw"}>
      <HStack spacing={4} flex={1} w={"100%"}>
        <VStack justifyContent={"start"} alignItems={"start"}>
          <Heading size={"sm"}>Profile Public</Heading>
        </VStack>
      </HStack>
    </Box>
  );
}

export default TabProfile;
