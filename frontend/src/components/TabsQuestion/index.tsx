import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Box,
  useColorMode,
  BoxProps,
} from "@chakra-ui/react";
import { Colors } from "@/assets/constant/Colors";
type Props = {
  questions?: string;
  containerStyles?: BoxProps;
};
function TabsQuestion({ questions, containerStyles }: Props) {
  const { colorMode } = useColorMode();

  return (
    <Box
      {...containerStyles}
      rounded={"md"}
      height={"50vh"}
      bg={Colors(colorMode === "dark").PRIMARY_BG}
    >
      <Tabs position="relative" variant="unstyled">
        <TabList>
          <Tab>New</Tab>
          <Tab>Unanswer</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default TabsQuestion;
