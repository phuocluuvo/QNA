import { Container, Flex, HStack, VStack } from "@chakra-ui/react";
import React from "react";
import SideRightMenu from "../SideRightMenu";
import { LayoutContext } from "@/provider/LayoutProvider";
type Props = {
  children: React.ReactNode;
};
function PageContainer({ children }: Props) {
  return (
    <Container maxW={{ base: "fit-content", md: "100%" }} display={"flex"}>
      <SideRightMenu />
      <Flex
        gap={3}
        px={{ base: 5, md: 10 }}
        height={"full"}
        w={"full"}
        direction={{ base: "column", md: "row" }}
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
      >
        {children}
      </Flex>
    </Container>
  );
}

export default PageContainer;
