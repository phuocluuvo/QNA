import { Colors } from "@/assets/constant/Colors";
import { Dimensions } from "@/assets/constant/Dimensions";
import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Code,
  HStack,
  IconButton,
  Input,
  Spacer,
  Tag,
  Text,
  Tooltip,
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
    if (!search) {
      router.push({
        pathname: "/",
      });
    } else {
      if (search.startsWith("/") && search.endsWith("/")) {
        // Remove the slashes and use the remaining string as the pathname
        const pathname = search.slice(1, -1);
        router.push({
          pathname: router.basePath + `/search/tag/${pathname}`,
        });
      } else {
        router.push({
          pathname: "/search",
          query: { q: search },
        });
      }
      setIsFocused(false);
    }
  }

  return (
    <>
      <HStack
        display="flex"
        justifyContent="center"
        pos={"relative"}
        alignItems="center"
        border={"1px solid"}
        borderColor={
          isFocused
            ? "gray.500"
            : colorMode === "light"
            ? "gray.100"
            : "gray.700"
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
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
        {/* result box */}
        <Box
          width={{ base: "90vw", md: "100%" }}
          style={{
            position: "absolute",
            zIndex: 999,
            top: "120%",
            left: "0",
            height: "auto",
            maxHeight: "100px",
            zIndex: "999",
            background: "white",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.3)",
            display: isFocused ? "block" : "none",
          }}
        >
          <HStack
            w={"full"}
            padding="10px"
            bg={Colors(colorMode === "dark").PRIMARY_BG}
          >
            <Code>/tag-name/</Code>
            <Text color={"InfoText"} fontSize={"xs"}>
              {" "}
              - to search by tag
            </Text>
          </HStack>
        </Box>
      </HStack>
    </>
  );
}

export default SearchBar;
