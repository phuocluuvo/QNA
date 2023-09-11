import { Colors } from "@/assets/constant/Colors";
import { Box, HStack, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Logo() {
  const { colorMode } = useColorMode();
  return (
    <HStack as={Link} href="/">
      <Image src="/images/favicon.ico" alt="logo" width={50} height={50} />
      <Text
        size="xl"
        fontWeight="bold"
        minW={150}
        color={Colors(colorMode === "dark").PRIMARY}
        _hover={{
          textDecoration: "none",
          color: Colors(colorMode === "dark").PRIMARY,
        }}
      >
        QuestionDanIT
      </Text>
    </HStack>
  );
}

export default Logo;
