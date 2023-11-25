import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Spacer,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { RiBookmark2Fill, RiQuestionnaireFill } from "react-icons/ri";
import {
  FaBell,
  FaHashtag,
  FaQuestion,
  FaSave,
  FaTag,
  FaTags,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { LayoutContext } from "@/provider/LayoutProvider";
import { useSession } from "next-auth/react";
import {
  BiBookBookmark,
  BiCheckShield,
  BiData,
  BiSave,
  BiUser,
} from "react-icons/bi";
import Annoucements from "../Annoucements";
function SideRightMenu() {
  const route = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);

  const { showLeftMenu } = React.useContext(LayoutContext);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  function changeRoute(path: string) {
    route.push(path);
  }
  const sesssion = useSession();
  function checkRoute() {
    return !route.pathname.startsWith("/auth");
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
          spacing={0}
        >
          <Button
            leftIcon={<RiQuestionnaireFill />}
            variant={"ghost"}
            isActive={
              route.pathname === "/" || route.pathname === "/question/[id]"
            }
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
            leftIcon={<FaUser />}
            variant={"ghost"}
            isActive={
              route.pathname === "/users" ||
              (route.pathname === "/user/profile" &&
                route.query.tab !== "saves")
            }
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
            onClick={() => changeRoute("/users")}
          >
            {isMobile ? null : getTranslate("USERS")}
          </Button>
          {/* Save for later */}
          <Button
            display={sesssion.data?.user ? "flex" : "none"}
            leftIcon={<RiBookmark2Fill />}
            variant={"ghost"}
            isActive={route.query.tab === "saves"}
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
            onClick={() => changeRoute("/user/profile?tab=saves")}
          >
            {isMobile ? null : getTranslate("SAVED")}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default SideRightMenu;
