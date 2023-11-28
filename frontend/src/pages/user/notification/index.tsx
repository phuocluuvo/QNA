"use client";
import { ActionGetAllNotification } from "@/API/redux/actions/user/ActionGetAllNotification";
import { ActionReadAllNotification } from "@/API/redux/actions/user/ActionReadAllNotification";
import { CommonParams } from "@/API/type/params/Common.params";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import NotificationItem from "@/components/NotifcationItem";
import { LayoutContext } from "@/provider/LayoutProvider";
import { LanguageHelper } from "@/util/Language/Language.util";
import { NotificationListType } from "@/util/type/Notification.type";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Select,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const limitations = [5, 10, 15, 20];
const filterData = [
  {
    label: "All",
    value: null,
  },
  {
    label: "Unread",
    value: "false",
  },
  {
    label: "Read",
    value: "true",
  },
];

function NotificationPage() {
  const [hydrated, setHydrated] = useState(false);

  const dispatch = useDispatch();
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );
  const [notifcation, setNotifcation] =
    React.useState<NotificationListType | null>(null);
  const { colorMode } = useColorMode();
  const router = useRouter();
  const query = router.query;
  const { badgeNumber, setBadgeNumber } = React.useContext(LayoutContext);
  const pageNumber = Number(query.page);
  const limit = Number(query.limit)
    ? Number(query.limit)
    : (notifcation?.meta.itemsPerPage as number);
  const numberOfPages: number[] = [...Array(notifcation?.meta.totalPages)];
  const [isRead, setIsRead] = React.useState("");
  function getNotifcation() {
    const defaultLimit = 10;
    const defaultPage = 1;
    const defaultSortBy = "createdAt";
    const defaultOrderBy = "ASC";

    const queryParams: CommonParams = {
      limit: limit || defaultLimit,
      page: pageNumber || defaultPage,
      // @ts-ignore
      "filter.isRead": router.query.select,
      sortBy: router.query.sortBy
        ? `${router.query.sortBy}:${router.query.orderBy || defaultOrderBy}`
        : `${defaultSortBy}:${defaultOrderBy}`,
    };
    dispatch(
      // @ts-ignore
      ActionGetAllNotification(
        queryParams,
        (res) => {
          setNotifcation(res);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }
  function readAllNotifcation() {
    dispatch(
      // @ts-ignore
      ActionReadAllNotification(
        (res) => {
          setBadgeNumber(0);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }
  useEffect(() => {
    getNotifcation();
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
  function renderPagination() {
    return (
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        mb={{ base: 3, md: 0 }}
        mt={5}
        w={"full"}
      >
        <HStack spacing={3}>
          {notifcation
            ? notifcation?.meta.totalPages > 1 &&
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
        <HStack spacing={3} ml={5}>
          {limitations.map((_limit, index) => (
            <Button
              key={index}
              size={"xs"}
              alignItems={"center"}
              justifyContent={"center"}
              _hover={{
                color: Colors(colorMode === "dark").PRIMARY,
              }}
              color={
                limit === _limit
                  ? Colors(colorMode === "dark").PRIMARY
                  : "gray.300"
              }
              variant={"link"}
              onClick={() => pageNumClick(1, _limit)}
            >
              {_limit}
            </Button>
          ))}
        </HStack>
      </Flex>
    );
  }
  React.useEffect(() => {
    getNotifcation();
  }, []);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      style={{
        width: "full",
      }}
      flex={1}
    >
      <Heading>{getTranslate("NOTIFICATIONS")}</Heading>
      <HStack>
        <Select
          variant="filled"
          size={"sm"}
          w={"fit-content"}
          style={{
            fontSize: "xs",
          }}
          suppressHydrationWarning
          onChange={(e) => {
            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  select: e.target.value,
                  limit: 10,
                  page: 1,
                },
              },
              undefined,
              { shallow: true }
            );
          }}
        >
          {
            //@ts-ignore
            filterData.map((item) => (
              <option value={item.value ? item.value : ""}>
                <Text as={"span"}>
                  {getTranslate("NOTIFICATIONS") + `(${item.label})`}
                </Text>
              </option>
            ))
          }
        </Select>
        <Spacer />
        <Button
          size={"xs"}
          variant={"link"}
          onClick={() => readAllNotifcation()}
        >
          {getTranslate("MARK_ALL_AS_READ")}
        </Button>
      </HStack>
      {renderPagination()}
      {notifcation?.data.map((item, index) => (
        <NotificationItem
          key={item.id}
          index={index}
          notification={item}
          itemSize={notifcation?.data.length}
        />
      ))}
      {notifcation?.data.length === 0 && (
        <Text textAlign={"center"}>{getTranslate("NO_DATA")}</Text>
      )}
      {renderPagination()}
    </Box>
  );
}

export default NotificationPage;
