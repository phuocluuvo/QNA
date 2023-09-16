import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import { HStack, IconButton, Input, useColorMode } from "@chakra-ui/react";
import React from "react";
function SearchBar(props) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const { colorMode } = useColorMode();

  return (
    <HStack
      display="flex"
      justifyContent="center"
      alignItems="center"
      border={"1px solid"}
      borderColor={
        isFocused ? "gray.500" : colorMode === "light" ? "gray.100" : "gray.700"
      }
      maxW={isFocused ? { base: "80%", md: "50%" } : "200px"}
      flex={isFocused ? 1 : "unset"}
      transition="all 0.5s"
      background={colorMode === "light" ? "gray.100" : "gray.700"}
      rounded={"10px"}
      onClick={() => {}}
      zIndex={isFocused ? "999" : "0"}
      px={2}
      py={1}
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
        position={"relative"}
        size={"xs"}
        onClick={() => {
          setSearch("");
        }}
        icon={<CloseIcon />}
      />
    </HStack>
  );
}

export default SearchBar;
