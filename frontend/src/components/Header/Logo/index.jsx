import { Colors } from "@/assets/constant/Colors";
import { LayoutContext } from "@/provider/LayoutProvider";
import {
  Box,
  HStack,
  Text,
  VStack,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function Logo() {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const session = useSession();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { showLeftMenu, setShowLeftMenu } = React.useContext(LayoutContext);
  function checkRoute() {
    return router.pathname === "/" || router.pathname === "/tags";
  }
  return (
    <HStack
      zIndex={2}
      minW={"fit-content"}
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
      <VStack spacing={0} justifyContent={"start"} alignItems={"start"}>
        <Text
          fontSize="xl"
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
        <Text
          fontSize="sm"
          fontWeight="bold"
          color={Colors(colorMode === "dark").DOWN_VOTE_RED}
          _hover={{
            textDecoration: "none",
            color: Colors(colorMode === "dark").DOWN_VOTE_RED,
          }}
        >
          {session.data?.user.role === "admin" &&
            `Welcome, Admin ${session.data?.user.username}`}
        </Text>
      </VStack>
    </HStack>
  );
}

export default Logo;
