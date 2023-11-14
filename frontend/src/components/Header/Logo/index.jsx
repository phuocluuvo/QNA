import { Colors } from "@/assets/constant/Colors";
import { LayoutContext } from "@/provider/LayoutProvider";
import {
  Box,
  HStack,
  Text,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Logo() {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { showLeftMenu, setShowLeftMenu } = React.useContext(LayoutContext);
  function checkRoute() {
    return router.pathname === "/" || router.pathname === "/tags";
  }
  return (
    <HStack
      zIndex={2}
      cursor={"pointer"}
      onClick={() =>
        isMobile
          ? checkRoute()
            ? setShowLeftMenu(!showLeftMenu)
            : router.push("/")
          : router.push("/")
      }
      // as={Link} href="/"
    >
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
