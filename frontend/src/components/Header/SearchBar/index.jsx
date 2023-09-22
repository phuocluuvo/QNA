import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Input,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
function SearchBar(props) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const { colorMode } = useColorMode();
  const router = useRouter();
  function handleSearch() {
    if (!search) return;
    else
      router.push({
        pathname: "/search",
        query: { q: search },
      });
  }

  return (
    <HStack
      display="flex"
      justifyContent="center"
      alignItems="center"
      border={"1px solid"}
      borderColor={
        isFocused ? "gray.500" : colorMode === "light" ? "gray.100" : "gray.700"
      }
      maxW={{ base: "100%", md: "50%" }}
      flex={1}
      transition="all 0.5s ease-in-out"
      background={colorMode === "light" ? "gray.100" : "gray.700"}
      rounded={"10px"}
      onClick={() => {}}
      zIndex={isFocused ? "999" : "0"}
      p={1}
    >
      <Search2Icon color={"gray.500"} />
      <Input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        flex={1}
        value={search}
        variant={"unstyled"}
        borderColor={"transparent"}
        rounded={"3px"}
        width="100%"
        height={{ base: "30px", md: "30px" }}
        display="flex"
        justifyContent="center"
        alignItems="center"
        placeholder={props.getTranslate("SEARCH")}
      />
      <IconButton
        opacity={search ? 1 : 0}
        visibility={search ? "visible" : "hidden"}
        display={search ? "flex" : "none"}
        size={"xs"}
        onClick={() => {
          setSearch("");
        }}
        icon={<CloseIcon />}
      />
      <Button
        // opacity={isFocused ? 1 : 0}
        // visibility={isFocused ? "visible" : "hidden"}
        // display={isFocused ? "flex" : "none"}
        variant="main_button"
        color="white"
        size="sm"
        disabled={!search}
        onClick={handleSearch}
      >
        {props.getTranslate("SEARCH")}
      </Button>
    </HStack>
  );
}

export default SearchBar;
