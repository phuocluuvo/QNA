import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
function ChangeLanguageButton({ listLanguage, translate, title, onClick }) {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  return (
    <>
      <Menu size={"sm"}>
        <MenuButton
          display={"flex"}
          minW={"fit-content"}
          rightIcon={!isMobile ? <ChevronDownIcon /> : null}
          as={Button}
        >
          <Text>{title}</Text>
        </MenuButton>
        <MenuList>
          {listLanguage.map((language) => (
            <MenuItem
              as={Link}
              href={router.asPath}
              locale={language.code}
              passHref
              key={language.code}
              data-id={`${language.code}-button`}
            >
              {translate(language.name)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
}

export default ChangeLanguageButton;
