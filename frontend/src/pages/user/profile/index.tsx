import actionGetProfile from "@/API/redux/actions/user/ActionGetProfile";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { HistoryActivityListType } from "@/util/type/HistoryActivity";
import { UserType } from "@/util/type/User.type";
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
  styled,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { BiCake } from "react-icons/bi";
import { useDispatch } from "react-redux";
import TabActivity from "./(TabAcivity)";
import TabProfile from "./(TabProfile)";
import SavesQuestion from "./(TabSaves)";
import UserInfoProfile from "./(UserInfo)";
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

  const router = useRouter();
  const query = router.query;
  const dispatch = useDispatch();

  const { getTranslate } = LanguageHelper(Pages.HOME);
  React.useEffect(() => {
    dispatch(
      actionGetProfile(
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
            })
          );
        },
        () => {}
      )
    );
  }, []);
  return (
    <Box
      style={{
        width: "100%",
      }}
    >
      <UserInfoProfile user={state} />
      <Tabs
        variant="enclosed"
        defaultIndex={
          query.tab === "profile" ? 1 : query.tab === "saves" ? 2 : 0
        }
        pt={"10px"}
      >
        <TabList>
          <CustomTab
            onClickCapture={() => {
              router.push({
                pathname: "/user/profile",
                query: { ...router.query, tab: "activity" },
              });
            }}
          >
            {getTranslate("ACTIVITY")}
          </CustomTab>
          <CustomTab
            onClickCapture={() => {
              router.push({
                pathname: "/user/profile",
                query: null,
              });
            }}
          >
            {getTranslate("PROFILE")}
          </CustomTab>
          <CustomTab
            onClickCapture={() => {
              router.push({
                pathname: "/user/profile",
                query: { ...router.query, tab: "saves" },
              });
            }}
          >
            {getTranslate("SAVED")}
          </CustomTab>
        </TabList>
        <TabPanels>
          <CustomTabPanel>
            <TabActivity getTranslate={getTranslate} />
          </CustomTabPanel>
          <CustomTabPanel>
            <TabProfile user={state} router={router} />
          </CustomTabPanel>
          <CustomTabPanel>
            <SavesQuestion user={state} />
          </CustomTabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
const CustomTabPanel = styled(TabPanel, {
  baseStyle: {
    small: {
      fontSize: "sm",
    },
  },
});

const CustomTab = styled(Tab, {
  baseStyle: {
    fontWeight: "bold",
    fontSize: "md",

    _focus: {
      boxShadow: "none",
    },
  },
});

export default DashBoard;
