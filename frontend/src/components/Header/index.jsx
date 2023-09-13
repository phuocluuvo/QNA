"use client";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Spacer,
  VStack,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import Navigator from "./Navigator";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import ChangeLanguageButton from "./ChangeLanguageButton";
import { Dimensions } from "@/assets/constant/Dimensions";
import Link from "next/link";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <VStack
        height={Dimensions.HEADER_HEIGHT}
        position={"fixed"}
        top={0}
        left={0}
        zIndex={10}
        spacing={0}
        w={"full"}
      >
        <HStack
          spacing={{ base: 2, md: 4 }}
          pl={{ base: 4, md: 20 }}
          py={4}
          pr={10}
          w={"full"}
          zIndex={999}
          height={"full"}
          borderBottomWidth="1px"
          borderBottomColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          justifyContent="space-between"
          bg={colorMode === "dark" ? "rgba(17, 25, 40, 0.75)" : "white"}
          backdropFilter="blur(16px) saturate(180%)"
        >
          <Logo />
          <Spacer />
          <HStack
            justifyContent="flex-end"
            w={"full"}
            px={4}
            py={8}
            left={0}
            pos={{ base: "absolute", md: "unset" }}
            top={"100%"}
            bg={{
              base: colorMode === "dark" ? "rgba(17, 25, 40, 0.75)" : "white",
              md: "transparent",
            }}
            backdropFilter="blur(16px) saturate(180%)"
            height={Dimensions.HEADER_HEIGHT}
          >
            <SearchBar getTranslate={getTranslate} />
            <Button as={Link} variant="main_button" color={"white"} href={'question/create'}>
              {getTranslate("CREATE")}
            </Button>
          </HStack>
          <ChangeLanguageButton
            title={getCurrentLanguage().code}
            translate={getTranslate}
            listLanguage={getListLanguage()}
          />
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="current"
            p={0}
          />
          <Navigator
            getTranslate={getTranslate}
            isLogged={false}
            isMobile={isMobile}
          />
        </HStack>
      </VStack>
      <Box height={32} />
    </>
  );
}

export default Header;
