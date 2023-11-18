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
import { RiQuestionnaireFill } from "react-icons/ri";
import {
  FaBell,
  FaHashtag,
  FaQuestion,
  FaTag,
  FaTags,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { LayoutContext } from "@/provider/LayoutProvider";
import { useSession } from "next-auth/react";
import { BiCheckShield, BiData, BiUser } from "react-icons/bi";
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
    return (
      route.pathname === "/" ||
      route.pathname === "/tags" ||
      route.pathname === "/user/profile" ||
      route.pathname === "/user/notification" ||
      route.pathname === "/users" ||
      route.pathname === "/question/[id]" ||
      route.pathname.includes("/censoring/question") ||
      route.pathname.includes("/censoring/tags") ||
      route.pathname.includes("/censoring/users")
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
              route.pathname === "/users" || route.pathname === "/user/profile"
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
        </VStack>
        {sesssion.data?.user?.role === "admin" ? (
          <VStack>
            <Accordion
              allowMultiple
              w={"100%"}
              mt={5}
              defaultIndex={
                route.pathname.includes("/censoring/question") ? [0] : []
              }
            >
              <AccordionItem>
                <AccordionButton
                  m={0}
                  w={isMobile ? "full" : "100%"}
                  style={{
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                  px={{ base: 0, md: "3" }}
                  _hover={{
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  <Box
                    display={"flex"}
                    flex="1"
                    alignItems={"center"}
                    justifyContent={{
                      base: "center",
                      md: "start",
                    }}
                  >
                    <HStack>
                      <BiCheckShield />
                      {isMobile ? null : (
                        <Text>{getTranslate("CENSORING")}</Text>
                      )}
                    </HStack>
                  </Box>
                </AccordionButton>

                <AccordionPanel m={0} p={0}>
                  <VStack>
                    <Button
                      leftIcon={<FaQuestion />}
                      variant={"ghost"}
                      isActive={route.pathname.includes("/censoring/question")}
                      w={isMobile ? "fit-content" : "100%"}
                      justifyContent={"flex-start"}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      _hover={{
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => changeRoute("/censoring/question")}
                    >
                      {isMobile ? null : getTranslate("QUESTIONS")}
                    </Button>
                    <Button
                      leftIcon={<FaTag />}
                      variant={"ghost"}
                      isActive={route.pathname === "/censoring/tags"}
                      w={isMobile ? "fit-content" : "100%"}
                      justifyContent={"flex-start"}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      _hover={{
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => changeRoute("/censoring/tags")}
                    >
                      {isMobile ? null : getTranslate("TAGS")}
                    </Button>
                    <Button
                      leftIcon={<FaUserCheck />}
                      variant={"ghost"}
                      isActive={route.pathname === "/censoring/users"}
                      w={isMobile ? "fit-content" : "100%"}
                      justifyContent={"flex-start"}
                      style={{
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      _hover={{
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => changeRoute("/censoring/users")}
                    >
                      {isMobile ? null : getTranslate("USERS")}
                    </Button>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <Button
              display={sesssion.data?.user?.id ? "block" : "none"}
              leftIcon={<BiData />}
              variant={"ghost"}
              isActive={route.pathname === "/admin/dashboard"}
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
              onClick={() => changeRoute("/admin/dashboard")}
            >
              {isMobile ? null : getTranslate("DASHBOARD")}
            </Button>
          </VStack>
        ) : null}
      </Box>
    </Box>
  );
}

export default SideRightMenu;
