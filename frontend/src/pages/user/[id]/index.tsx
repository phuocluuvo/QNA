import { actionGetUserDashBoardById } from "@/API/redux/actions/user/ActionGetProfile";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { HistoryActivityListType } from "@/util/type/HistoryActivity";
import { DashBoardUserType, UserType } from "@/util/type/User.type";
import { TimeIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  HStack,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { BiCake } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { actionGetUserById } from "@/API/redux/actions/user/ActionGetUserById";
import TabProfile from "@/components/TabUsersProfile";
const DEFAULT_USER: UserType = {
  fullname: "",
  email: "",
  id: "",
  createdAt: "",
  dob: "",
  updatedAt: "",
  username: "",
  avatar: "",
  activityPoint: 0,
  role: "user",
};

function DashBoard() {
  const [state, setState] = React.useState<UserType>(DEFAULT_USER);
  const [history, setHistory] = React.useState<HistoryActivityListType | null>(
    null
  );

  const [dashboard, setDashboard] = React.useState<DashBoardUserType>();
  const { colorMode } = useColorMode();
  const router = useRouter();
  const query = router.query;
  const dispatch = useDispatch();
  const toast = useToast();
  function getFormatedDateFromNow(date: string | undefined) {
    return moment(date).diff(moment(), "minutes") > -60
      ? moment(date).diff(moment(), "minutes") * -1
      : moment(date).diff(moment(), "hours") > -24
      ? moment(date).diff(moment(), "hours") * -1
      : moment(date).diff(moment(), "days") * -1;
  }
  function getFormatedUnitFromNow(date: string | undefined) {
    return moment(date).diff(moment(), "minutes") > -60
      ? "minutes"
      : moment(date).diff(moment(), "hours") > -24
      ? "hours"
      : "days";
  }

  const { getTranslate } = LanguageHelper(Pages.HOME);
  React.useEffect(() => {
    const userId = router.query.id;
    dispatch(
      actionGetUserById(
        userId as string,
        (res: UserType) => {
          console.log(res);
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, {
              fullname: res.fullname,
              email: res.email,
              id: res.id,
              createdAt: res.createdAt,
              dob: res.dob,
              updatedAt: res.updatedAt,
              username: res.username,
              avatar: res.avatar,
              activityPoint: res.activityPoint,
              title: res.title,
              about: res.about,
            })
          );
        },
        () => {}
      )
    );
    userId &&
      dispatch(
        actionGetUserDashBoardById(
          userId as string,
          (res) => {
            setDashboard(res);
          },
          () => {}
        )
      );
  }, [router.query]);
  return (
    <Box
      style={{
        width: "100%",
      }}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        maxW={"full"}
        justifyItems={"start"}
      >
        <Box pos="relative" w={"fit-content"}>
          <Avatar
            src={state.avatar}
            boxSize={{
              base: "100px",
              md: "150px",
            }}
            objectFit="cover"
            borderRadius="12"
            name={state.fullname}
          />
          <Text
            cursor={"pointer"}
            fontSize={{
              base: "xs",
              md: "sm",
            }}
            onClick={() => {
              navigator.clipboard.writeText(state.username).then(() => {
                toast({
                  title: "Copied",
                  description: "Copied to clipboard",
                  status: "success",
                  duration: 800,
                  isClosable: true,
                  position: "top-right",
                  size: "sm",
                });
              });
            }}
            pos={"absolute"}
            color={"whiteAlpha.900"}
            zIndex={2}
            bottom={2}
            left={2}
            textOverflow={"ellipsis"}
          >
            @{state.username}
          </Text>
          <Box
            style={{
              background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))",
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              width: "100%",
              height: "60px",
              borderRadius: "12px",
            }}
          />
        </Box>
        <VStack spacing={1} alignItems={"start"}>
          <HStack justifyItems={"flex-start"}>
            <Heading>{state.fullname}</Heading>
          </HStack>
          <Text
            style={{
              fontSize: "16px",
            }}
          >
            {state.title}
          </Text>
          <Heading size={"sm"}>
            {state.activityPoint}{" "}
            <span
              style={{
                color: Colors(colorMode === "dark").PRIMARY,
              }}
            >
              {getTranslate("ACTIVITY_POINTS")}
            </span>
          </Heading>

          <Stack
            direction={{
              base: "column",
              md: "row",
            }}
            alignItems={"flex-start"}
            spacing={1}
            w={"full"}
          >
            <HStack justifyContent={"center"} minW={"fit-content"}>
              <BiCake />
              <Text
                fontSize={{
                  base: "xs",
                  md: "sm",
                }}
              >
                {`Member for ${getFormatedDateFromNow(state.createdAt)} 
              ${getFormatedUnitFromNow(state.createdAt)}`}
              </Text>
            </HStack>
            <HStack justifyContent={"center"} minW={"fit-content"}>
              <TimeIcon />
              <Text
                fontSize={{
                  base: "xs",
                  md: "sm",
                }}
              >
                {`Last seen ${getFormatedDateFromNow(state.updatedAt)} 
              ${getFormatedUnitFromNow(state.updatedAt)} ago`}
              </Text>
            </HStack>
          </Stack>
        </VStack>
      </Stack>
      <Tabs
        variant="enclosed"
        defaultIndex={
          query.tab === "profile" ? 1 : query.tab === "saves" ? 2 : 0
        }
      >
        <TabList>
          <Tab
            onClickCapture={() => {
              router.push({
                pathname: "/user/profile",
                query: null,
              });
            }}
          >
            {getTranslate("PROFILE")}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {dashboard ? (
              <TabProfile user={state} dashboard={dashboard} />
            ) : null}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default DashBoard;
