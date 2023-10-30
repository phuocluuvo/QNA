import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Toast,
  VStack,
  useColorMode,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import React from "react";
import LinkButton from "@/components/LinkButton";
import { Colors } from "@/assets/constant/Colors";
import { useSelector } from "react-redux";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import api from "@/API/api";
function Navigator({ getTranslate, isMobile }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const handleClick = () => (isOpen ? onClose() : onOpen());
  const userData = useSelector((state) => state.userReducer.data);
  const { data: session } = useSession();
  const routes = useRouter();
  const LogoutHandle = async () => {
    await api.signOut().then(async (res) => {
      await signOut({ redirect: false, callbackUrl: "/user/signin" })
        .then((res) => {
          console.log("logout success", res);
          localStorage.removeItem("userLogin");
          sessionStorage.removeItem("next-auth.session-token");
          Toast({
            title: "Logout success",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log("logout failed:", err);
        });
    }),
      (err) => {
        console.log("logout failed:", err);
      };
  };
  const DashboardHandle = () => {
    routes.push("/user/profile");
  };
  return isMobile ? (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w={{ base: isOpen ? "full" : "50px", md: "auto" }}
      height={{ base: isOpen ? "100vh" : "0", md: "auto" }}
      borderRadius={{ base: isOpen ? "0" : "0px 0px 0px  999px", md: "0" }}
      position={{ base: "absolute", md: "relative" }}
      top={{ base: "0", md: "auto" }}
      right={{ base: "0", md: "auto" }}
      zIndex="999"
      bg={
        colorMode === "dark"
          ? "rgba(17, 25, 40, 0.75)"
          : "rgba(255, 255, 255, 0.75)"
      }
      backdropFilter="blur(2px) saturate(180%)"
      transition={"all 0.5s"}
    >
      <Box
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        justifyContent="flex-end"
        width="full"
        height={"50px"}
        position={{ base: "fixed", md: "relative" }}
        top={{ base: "0", md: "auto" }}
        left={{ base: "0", md: "auto" }}
      >
        <IconButton
          aria-label="Open menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={handleClick}
          variant="ghost"
          color={Colors(colorMode === "dark").PRIMARY}
          _hover={{ bg: "transparent" }}
          transition="all 0.5s"
          transform={isOpen ? "rotate(90deg)" : ""}
        />
      </Box>
      <VStack
        spacing={4}
        display={{ base: isOpen ? "flex" : "none", md: "flex" }}
        opacity={{ base: isOpen ? "1" : "0", md: "1" }}
        width={{ base: "full", md: "auto" }}
        alignItems="center"
        justifyContent={{ base: "center", md: "flex-end" }}
      >
        <LinkButton
          href="/about"
          text={getTranslate("ABOUT")}
          onClick={handleClick}
        />
        {session?.user ? (
          <LinkButton
            href="/auth/logout"
            text={getTranslate("LOGOUT")}
            onClick={LogoutHandle}
          />
        ) : (
          <>
            {/* check if current routes is login */}
            {routes.pathname === "/auth/signin" ? null : (
              <LinkButton
                style={{ paddingX: 0 }}
                href="/auth/signin"
                onClick={signIn}
                text={getTranslate("LOGIN")}
              />
            )}
            <LinkButton
              style={{ paddingX: 0 }}
              textStyle={{ color: Colors(colorMode).PRIMARY }}
              href="/auth/signup"
              text={getTranslate("SIGNUP")}
            />
          </>
        )}
      </VStack>
    </Flex>
  ) : session?.user ? (
    <Menu>
      <IconButton
        as={MenuButton}
        variant="ghost"
        icon={
          <Avatar
            size={"xs"}
            name={session.user.fullname ? session.user.fullname : "Unknown"}
            src={session.user.avatar}
          />
        }
      />
      <MenuList>
        <MenuItem onClick={DashboardHandle}>
          {getTranslate("DASHBOARD")}
        </MenuItem>
        <MenuItem onClick={LogoutHandle}>{getTranslate("LOGOUT")}</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <HStack spacing={0}>
      <LinkButton
        href="/about"
        style={{
          paddingX: 0,
        }}
        text={getTranslate("ABOUT")}
      />
      {routes.pathname === "/auth/signin" ? null : (
        <LinkButton
          style={{ paddingX: 0 }}
          href="/auth/signin"
          onClick={signIn}
          text={getTranslate("LOGIN")}
        />
      )}
      <LinkButton
        style={{
          paddingX: 0,
        }}
        textStyle={{ color: Colors(colorMode).PRIMARY }}
        href="/auth/signup"
        text={getTranslate("SIGNUP")}
      />
    </HStack>
  );
}

export default Navigator;
