import actionGetTagList from "@/API/redux/actions/tags/ActionGetTagList";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import SelectOptions from "@/components/SelectOptions";
import TagItem from "@/components/TagItem";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { TagListType } from "@/util/type/Tag.type";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  Heading,
  Input,
  Spacer,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
type State = {
  tags: TagListType | null;
  search: string;
};
const limitations = [36];
function TagsPage() {
  const [state, setState] = useStateWithCallback<State>({
    tags: null,
    search: "",
  });

  const { getTranslate } = LanguageHelper(Pages.HOME);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [close, setClose] = React.useState(false);
  const dispacth = useDispatch();
  const router = useRouter();
  const query = router.query;
  const pageNumber = Number(query.page);
  const filter = query.select;
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (state.tags?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(state.tags?.meta.totalPages)];

  const { colorMode } = useColorMode();
  React.useEffect(() => {
    fetchTags();
  }, [router.query]);
  function fetchTags() {
    const defaultLimit = limitations[0];
    const defaultPage = 1;
    const queryParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      ...(router.query.select && {
        "filter.type": `$eq:${router.query.select}`,
      }),
    };

    dispacth(
      actionGetTagList(
        queryParams,
        (res: TagListType) => {
          // @ts-ignore
          setState((oldState) => helper.mappingState(oldState, { tags: res }));
        },
        // @ts-ignore
        (err: any) => {
          console.log(err);
        }
      )
    );
  }
  function searchTags(search: string) {
    setState(
      // @ts-ignoref
      (oldState) => helper.mappingState(oldState, { search: search }),
      ({ search }) => {
        const defaultLimit = limitations[0];
        const defaultPage = 1;
        const queryParams = {
          limit: limit || defaultLimit,
          page: pageNumber || defaultPage,
          search: search,
          searchBy: "name",
        };
        dispacth(
          actionGetTagList(
            queryParams,
            (res: TagListType) => {
              // @ts-ignore
              setState((oldState) =>
                helper.mappingState(oldState, { tags: res })
              );
            },
            // @ts-ignore
            (err: any) => {
              console.log(err);
            }
          )
        );
      }
    );
  }
  const pageNumClick = (pageNumber: number, limit: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, limit: limit, page: pageNumber },
    });
  };
  return (
    <>
      <Head>
        <title>Question Dân IT - Tags</title>
        <meta
          name="description"
          content="The website answers the question about IT"
        />
      </Head>
      <VStack alignItems={"start"}>
        <Heading size={"lg"} fontWeight={"medium"}>
          {getTranslate("TAGS")}
        </Heading>
        <Text
          maxW={{ base: "100%", md: "50%" }}
          style={{
            marginBottom: "20px",
          }}
        >
          {getTranslate("TAG_DESCRIPTION")}
        </Text>
        <HStack
          w={{
            base: "100%",
            md: "30%",
          }}
          style={{
            alignItems: "center",
            alignContent: "center",
            padding: "5px",
            border: "1px solid #ccc",

            borderRadius: "5px",
            marginBottom: "20px",
          }}
          _focusWithin={{
            boxShadow: "0 0 0 2px #3182ce",
          }}
        >
          <Search2Icon
            style={{
              color: "gray",
              marginRight: "10px",
            }}
          />
          <Input
            flex={1}
            ref={inputRef}
            type="search"
            variant={"unstyled"}
            value={state.search}
            onChange={(e) => {
              searchTags(e.target.value);
            }}
            autoFocus={true}
            placeholder={"Search tags"}
            style={{
              width: "20%",
            }}
          />
        </HStack>
        <Flex
          flexDir={{ base: "column", md: "row" }}
          flexWrap={"wrap"}
          w={"full"}
          gap={5}
        >
          {state.tags?.data.map((tag) => {
            return <TagItem key={tag.id} tag={tag} />;
          })}
          <Flex
            alignItems={"center"}
            justifyContent={"center"}
            mb={{ base: 3, md: 10 }}
            w={"full"}
          >
            <HStack spacing={3}>
              {state.tags
                ? state.tags?.meta.totalPages > 1 &&
                  numberOfPages.map((_, index) => (
                    <Button
                      key={index}
                      size={"xs"}
                      variant={"outline"}
                      bg={
                        pageNumber
                          ? pageNumber === index + 1
                            ? "orange.500"
                            : Colors(colorMode === "dark").PRIMARY_BG
                          : index == 0
                          ? "orange.500"
                          : Colors(colorMode === "dark").PRIMARY_BG
                      }
                      color={
                        pageNumber
                          ? pageNumber === index + 1
                            ? "white"
                            : Colors(colorMode === "dark").BORDER
                          : index == 0
                          ? "white"
                          : Colors(colorMode === "dark").BORDER
                      }
                      onClick={() => pageNumClick(index + 1, limit)}
                    >
                      {index + 1}
                    </Button>
                  ))
                : null}
            </HStack>
            <Spacer />
          </Flex>
        </Flex>
      </VStack>
    </>
  );
}

export default TagsPage;
