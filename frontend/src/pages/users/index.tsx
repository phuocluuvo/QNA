import { ActionGetUserList } from "@/API/redux/actions/user/ActionGetUserList";
import { CommonParams } from "@/API/type/params/Common.params";
import { Colors } from "@/assets/constant/Colors";
import {
  SORT_DATA_EN,
  SORT_DATA_USER_EN,
  SORT_DATA_USER_VI,
  SORT_DATA_VI,
  SORT_ORDER_DATA_EN,
  SORT_ORDER_DATA_VI,
} from "@/assets/constant/Filter.data";
import { Pages } from "@/assets/constant/Pages";
import FilterColumn from "@/components/FilterColumn";
import SelectOptions from "@/components/SelectOptions";
import UserItem from "@/components/UserItem";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { UserListType } from "@/util/type/User.type";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  Heading,
  Input,
  Spacer,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { useDispatch } from "react-redux";
const limitations = [20];
type State = {
  users: UserListType | null;
  search: string;
};
function UsersListPage() {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );
  const [state, setState] = useStateWithCallback<State>({
    users: null,
    search: "",
  });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const query = router.query;
  const pageNumber = Number(query.page);
  const filter = query.select;
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (state.users?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(state.users?.meta.totalPages)];
  const session = useSession();
  const [valueSort, setValueSort] = useState("fullname");
  const [isDecending, setIsDecending] = useState("ASC");
  const { isOpen, onToggle } = useDisclosure();
  function searchUsers(search: string) {
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
        };
        dispatch(
          // @ts-ignore
          ActionGetUserList(
            queryParams,
            (res: UserListType) => {
              // @ts-ignore
              setState((oldState) =>
                helper.mappingState(oldState, { users: res })
              );
            },

            (err: any) => {
              console.log(err);
            }
          )
        );
      }
    );
  }
  React.useEffect(() => {
    const defaultLimit = limitations[0];
    const defaultPage = 1;
    const defaultSortBy = "fullname";
    const defaultOrderBy = "ASC";

    const queryParams: CommonParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      ...(router.query.select && {
        "filter.role": `$eq:${router.query.select}`,
      }),
      sortBy: router.query.sortBy
        ? `${router.query.sortBy}:${router.query.orderBy || defaultOrderBy}`
        : `${defaultSortBy}:${defaultOrderBy}`,
      search: state.search,
    };
    dispatch(
      // @ts-ignore
      ActionGetUserList(
        queryParams,
        (res: UserListType) => {
          // @ts-ignore
          setState((oldState) => helper.mappingState(oldState, { users: res }));
        },
        (err: any) => {}
      )
    );
  }, [router.query]);
  const pageNumClick = (pageNumber: number, limit: number) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, limit: limit, page: pageNumber },
      },
      undefined,
      { shallow: true }
    );
  };
  const applyFilter = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sortBy: valueSort, orderBy: isDecending },
      },
      undefined,
      { shallow: true }
    );
  };
  return (
    <>
      <Head>
        <title>User - Question Dân It</title>
      </Head>
      <Box
        display={"flex"}
        flexDir={"column"}
        style={{
          width: "full",
        }}
        flex={1}
      >
        {" "}
        <Heading size={"lg"} fontWeight={"medium"}>
          {getTranslate("USERS")}
        </Heading>
        <VStack flex={1} alignItems={"flex-end"}>
          <HStack>
            <SelectOptions
              getTranslate={getTranslate}
              containerStyle={{
                fontSize: "xs",
                variant: "filled",
                w: "fit-content",
              }}
              data={[
                {
                  label: getTranslate("ALL"),
                  value: "",
                },
                {
                  label: getTranslate("USER"),
                  value: "user",
                },
                {
                  label: getTranslate("MORDERATOR"),
                  value: "moderator",
                },
              ]}
              onSelect={(e) => {
                router.push(
                  {
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      select: e.target.value,
                      limit: limitations[0],
                      page: 1,
                    },
                  },
                  undefined,
                  { shallow: true }
                );
              }}
            />
            <Button
              aria-label="Search database"
              leftIcon={<BiFilterAlt />}
              onClick={onToggle}
            >
              {getTranslate("FILTER")}
            </Button>
          </HStack>
          <Collapse in={isOpen} animateOpacity>
            <VStack w={"full"} alignItems={"flex-end"}>
              <HStack
                spacing={10}
                p="20px 40px"
                color="white"
                w={"full"}
                bg={Colors(colorMode === "dark").PRIMARY_BG}
                rounded="md"
                shadow="md"
                justifyContent={"start"}
                alignItems={"start"}
              >
                <FilterColumn
                  title={getTranslate("ORDER_BY")}
                  value={isDecending}
                  setValue={setIsDecending}
                  defaultValue={(router.query.orderBy as string) ?? "ASC"}
                  dataList={
                    getCurrentLanguage().code === "en"
                      ? SORT_ORDER_DATA_EN
                      : SORT_ORDER_DATA_VI
                  }
                />
                <FilterColumn
                  title={getTranslate("SORT_BY")}
                  value={valueSort}
                  defaultValue={(router.query.sortBy as string) ?? "fullname"}
                  setValue={setValueSort}
                  dataList={
                    getCurrentLanguage().code === "en"
                      ? SORT_DATA_USER_EN
                      : SORT_DATA_USER_VI
                  }
                />
              </HStack>
              <Button
                size={"sm"}
                variant={"main_button"}
                onClick={() => applyFilter()}
              >
                {"APPLY"}
              </Button>
            </VStack>
          </Collapse>
        </VStack>
        {/* description */}
        <Text
          maxW={{ base: "100%", md: "50%" }}
          style={{
            marginBottom: "20px",
          }}
        >
          {getTranslate("USERS_DESCRIPTION")}
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
              searchUsers(e.target.value);
            }}
            autoFocus={true}
            placeholder={"Search user"}
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
          {state.users?.data.map((user, index) => (
            <UserItem key={user.id} user={user} />
          ))}
        </Flex>
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          mb={{ base: 3, md: 10 }}
          w={"full"}
        >
          <HStack spacing={3}>
            {state.users
              ? state.users?.meta.totalPages > 1 &&
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
      </Box>
    </>
  );
}

export default UsersListPage;
