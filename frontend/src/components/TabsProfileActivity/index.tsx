import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  styled,
  useColorMode,
} from "@chakra-ui/react";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import TabActivity from "../TabActivity";
import { Colors } from "@/assets/constant/Colors";
import TabQuestion from "./TabQuestion";
import { useSession } from "next-auth/react";
import { UserType } from "@/util/type/User.type";
import TabAnswer from "./TabAnswer";
import TabTag from "./TabTag";
function TabsProfileActivity({ user }: { user: UserType }) {
  const { colorMode } = useColorMode();
  const session = useSession();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  return (
    <Tabs
      position="relative"
      variant="enclosed-colored"
      w={"full"}
      display={{ base: "unset", md: "flex" }}
    >
      <TabList
        display={{ sm: "none", md: "flex" }}
        flexDir={{ base: "row", md: "column" }}
        style={{
          borderBottomColor: "transparent",
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
        }}
      >
        <TabCustom
          _selected={{
            color: "white",
            backgroundColor: Colors(colorMode === "dark").PRIMARY,
          }}
        >
          {getTranslate("SUMMARY")}
        </TabCustom>
        <TabCustom
          _selected={{
            color: "white",
            backgroundColor: Colors(colorMode === "dark").PRIMARY,
          }}
        >
          {getTranslate("QUESTIONS")}
        </TabCustom>
        <TabCustom
          _selected={{
            color: "white",
            backgroundColor: Colors(colorMode === "dark").PRIMARY,
          }}
        >
          {getTranslate("ANSWER")}
        </TabCustom>
        <TabCustom
          _selected={{
            color: "white",
            backgroundColor: Colors(colorMode === "dark").PRIMARY,
          }}
        >
          {getTranslate("TAGS")}
        </TabCustom>
      </TabList>

      <TabPanels>
        <TabPanel
          padding={{
            base: "0px",
            md: "10px",
          }}
          w={"full"}
        >
          <TabActivity getTranslate={getTranslate} />
        </TabPanel>
        <TabPanel
          padding={{
            base: "0px",
            md: "10px",
          }}
          w={"full"}
        >
          {/* @ts-ignore */}
          <TabQuestion user={user} />
        </TabPanel>
        <TabPanel
          padding={{
            base: "0px",
            md: "10px",
          }}
          w={"full"}
        >
          <TabAnswer user={user} />
        </TabPanel>
        <TabPanel
          padding={{
            base: "0px",
            md: "10px",
          }}
          w={"full"}
        >
          <TabTag user={user} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
const TabCustom = styled(Tab, {
  baseStyle: {
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    justifyContent: "start",
    width: 44,
    backgroundColor: "transparent",
  },
});
export default TabsProfileActivity;
