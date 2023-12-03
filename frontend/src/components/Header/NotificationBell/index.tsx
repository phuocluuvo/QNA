import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BellIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Spacer,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationListType } from "@/util/type/Notification.type";
import { ActionGetAllNotification } from "@/API/redux/actions/user/ActionGetAllNotification";
import NotificationItem from "@/components/NotifcationItem";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { ActionGetBadgeNotification } from "@/API/redux/actions/user/ActionGetNotificationBadge";
import { Colors } from "@/assets/constant/Colors";
import { ActionTypes } from "@/API/constant/ActionTypes.enum";
import { LayoutContext } from "@/provider/LayoutProvider";
import { CommonParams } from "@/API/type/params/Common.params";
import { ActionReadAllNotification } from "@/API/redux/actions/user/ActionReadAllNotification";
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

function NotificationBell() {
  const router = useRouter();
  const session = useSession();
  const dispatch = useDispatch();
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );
  const notificationType = useSelector(
    (state: { notificationReducer: { type: ActionTypes } }) =>
      state.notificationReducer.type
  );
  const [hydrated, setHydrated] = useState(false);
  const { badgeNumber, setBadgeNumber } = React.useContext(LayoutContext);
  const { colorMode } = useColorMode();
  const [isRead, setIsRead] = React.useState("");
  const query = router.query;
  const [notifcation, setNotifcation] =
    React.useState<NotificationListType | null>(null);
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
  function getNotifcation() {
    const defaultLimit = 5;
    const defaultPage = 1;
    // const defaultSortBy = "title";
    // const defaultOrderBy = "ASC";

    const queryParams: CommonParams = {
      limit: defaultLimit,
      page: defaultPage,
      // @ts-ignore
      ...(isRead && {
        "filter.isRead": isRead,
      }),
      // sortBy: `${defaultSortBy}:${defaultOrderBy}`,
    };
    session.data?.user &&
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
  useEffect(() => {
    getNotifcation();
  }, [isRead]);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <Box display={session.data?.user ? "flex" : "none"}>
      <Popover isLazy placement="bottom">
        <PopoverTrigger>
          <Box pos="relative">
            {badgeNumber > 0 ? (
              <Text
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  color: "white",
                  background: "red",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                  border:
                    "1px solid " + Colors(colorMode === "dark").PRIMARY_BG,
                }}
              >
                {badgeNumber}
              </Text>
            ) : null}
            <IconButton
              variant={"ghost"}
              onClick={() => getNotifcation()}
              aria-label="Search database"
              icon={<BellIcon />}
            />
          </Box>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <HStack>
              <Select
                variant="filled"
                size={"sm"}
                w={"fit-content"}
                style={{
                  fontSize: "xs",
                }}
                onChange={(e) => {
                  setIsRead(e.target.value);
                }}
              >
                {
                  //@ts-ignore
                  filterData.map((item) => (
                    <option
                      selected={item.value == isRead}
                      value={item.value ? item.value : ""}
                    >
                      <span>
                        {getTranslate("NOTIFICATIONS") + `(${item.label})`}
                      </span>
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
          </PopoverHeader>
          <PopoverBody>
            {notificationType === ActionTypes.SUCCESS_GET_NOTIFICATION_LIST &&
              notifcation?.data.map((item, index) => (
                <NotificationItem
                  type="small"
                  key={item.id}
                  index={index}
                  notification={item}
                  itemSize={notifcation?.data.length}
                />
              ))}
            {notificationType === ActionTypes.SUCCESS_GET_NOTIFICATION_LIST &&
              notifcation?.data.length === 0 && (
                <Text textAlign={"center"}>{getTranslate("NO_DATA")}</Text>
              )}
            {notificationType === ActionTypes.FAILURE_GET_NOTIFICATION_LIST && (
              <Text textAlign={"center"}>{getTranslate("NO_DATA")}</Text>
            )}
          </PopoverBody>
          <PopoverFooter>
            <Box
              onClick={() => {
                router.push("/user/notification?select=");
              }}
              cursor={"pointer"}
              w={"full"}
              textAlign={"center"}
              color={"blue"}
            >
              {getTranslate("SEE_ALL")}
            </Box>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Box>
  );
}

export default NotificationBell;
