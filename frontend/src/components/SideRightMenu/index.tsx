import { Box, Button, VStack, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { RiQuestionnaireFill } from "react-icons/ri";
import { FaTags } from "react-icons/fa";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { LayoutContext } from "@/provider/LayoutProvider";
function SideRightMenu() {
  const route = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);

  const { showLeftMenu } = React.useContext(LayoutContext);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  function changeRoute(path: string) {
    route.push(path);
  }

  function checkRoute() {
    return (
      route.pathname === "/" ||
      route.pathname === "/tags" ||
      route.pathname === "/user/profile"
    );
  }

  return (
    <Box
      w={isMobile ? 10 : "fit-content"}
      display={{
        base: showLeftMenu || !checkRoute() ? "none" : "flex",
        md: !checkRoute() ? "none" : "flex",
      }}
    >
      <Box
        pos={"sticky"}
        top={"32"}
        w={isMobile ? 10 : "fit-content"}
        style={{
          height: "fit-content",
        }}
      >
        <VStack
          w={isMobile ? 10 : 150}
          style={{
            height: "fit-content",
          }}
          spacing={{
            base: 0,
            md: 5,
          }}
        >
          <Button
            leftIcon={<RiQuestionnaireFill />}
            variant={"ghost"}
            isActive={route.pathname === "/"}
            w={isMobile ? "fit-content" : 150}
            justifyContent={"flex-start"}
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              paddingBlock: 10,
              paddingInline: 20,
            }}
            _hover={{
              textDecoration: "none",
              fontWeight: "bold",
              paddingBlock: 10,
              paddingInline: 20,
            }}
            onClick={() => changeRoute("/")}
          >
            {isMobile ? null : getTranslate("QUESTIONS")}
          </Button>
          <Button
            leftIcon={<FaTags />}
            variant={"ghost"}
            isActive={route.pathname === "/tags"}
            w={isMobile ? "fit-content" : 150}
            justifyContent={"flex-start"}
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              paddingBlock: 10,
              paddingInline: 20,
            }}
            _hover={{
              textDecoration: "none",
              fontWeight: "bold",
              paddingBlock: 10,
              paddingInline: 20,
            }}
            onClick={() => changeRoute("/tags")}
          >
            {isMobile ? null : getTranslate("TAGS")}
          </Button>
          <Button
            leftIcon={<FaTags />}
            variant={"ghost"}
            isActive={route.pathname === "/user/profile"}
            w={isMobile ? "fit-content" : 150}
            justifyContent={"flex-start"}
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              paddingBlock: 10,
              paddingInline: 20,
            }}
            _hover={{
              textDecoration: "none",
              fontWeight: "bold",
              paddingBlock: 10,
              paddingInline: 20,
            }}
            onClick={() => changeRoute("/user/profile")}
          >
            {isMobile ? null : getTranslate("USERS")}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default SideRightMenu;
