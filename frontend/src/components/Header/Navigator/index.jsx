import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import React from "react";
import LinkButton from "@/components/LinkButton";
import { Colors } from "@/assets/constant/Colors";
function Navigator({ isLogged = false, getTranslate, isMobile }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const handleClick = () => (isOpen ? onClose() : onOpen());

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
        {isLogged ? (
          <LinkButton
            href="/users/logout"
            text={getTranslate("LOGOUT")}
            onClick={handleClick}
          />
        ) : (
          <>
            <LinkButton
              style={{ paddingX: 0 }}
              href="/users/login"
              text={getTranslate("LOGIN")}
            />
            <LinkButton
              style={{ paddingX: 0 }}
              textStyle={{ color: Colors(colorMode).PRIMARY }}
              href="/users/sign-up"
              text={getTranslate("SIGNUP")}
            />
          </>
        )}
      </VStack>
    </Flex>
  ) : (
    <>
      {isLogged ? (
        <IconButton
          variant="ghost"
          icon={<Avatar size={"xs"} name="Louis" />}
        />
      ) : (
        <HStack spacing={0}>
          <LinkButton
            href="/about"
            style={{
              paddingX: 0,
            }}
            text={getTranslate("ABOUT")}
          />
          <LinkButton
            style={{ paddingX: 0 }}
            href="/users/login"
            text={getTranslate("LOGIN")}
          />
          <LinkButton
            style={{
              paddingX: 0,
            }}
            textStyle={{ color: Colors(colorMode).PRIMARY }}
            href="/users/sign-up"
            text={getTranslate("SIGNUP")}
          />
        </HStack>
      )}
    </>
  );
}

export default Navigator;
