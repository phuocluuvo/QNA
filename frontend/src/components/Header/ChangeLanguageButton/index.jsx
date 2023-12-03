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
import { US, VN } from "country-flag-icons/react/1x1";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
function ChangeLanguageButton({ listLanguage, translate, title, onClick }) {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const setCookie = (locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;
  };
  const { getCurrentLanguage } = LanguageHelper(Pages.HOME);
  return (
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
            onClick={() => {
              const locale = router.locale === "en" ? "" : "en";
              setCookie(locale);
              router.push(router.asPath, undefined, { locale });
            }}
          >
            {language.code === "en" ? (
              <US
                title="United States"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              <VN title="Viet Nam" style={{ width: "20px", height: "20px" }} />
            )}{" "}
            {translate(language.name)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default ChangeLanguageButton;
