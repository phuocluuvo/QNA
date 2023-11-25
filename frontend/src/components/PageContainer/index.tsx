import {
  Box,
  Container,
  Flex,
  HStack,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import SideRightMenu from "../SideRightMenu";
import { LayoutContext } from "@/provider/LayoutProvider";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { ActionGetBadgeNotification } from "@/API/redux/actions/user/ActionGetNotificationBadge";
type Props = {
  children: React.ReactNode;
};
function PageContainer({ children }: Props) {
  const { setBadgeNumber } = React.useContext(LayoutContext);
  const dispatch = useDispatch();
  const session = useSession();
  React.useEffect(() => {
    let checkUser =
      sessionStorage.getItem("next-auth.session-token")?.toString() ?? null;
    // const intervalId = setInterval(() => {
    //   checkUser &&
    //     dispatch(
    //       // @ts-ignore
    //       ActionGetBadgeNotification(
    //         (res: any) => {
    //           setBadgeNumber(res);
    //         },
    //         (err: any) => {}
    //       )
    //     );
    // }, 3000);

    // // Clear the interval when the component unmounts
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);
  return (
    <Container
      as={VStack}
      divider={<StackDivider />}
      maxW={{ base: "98vw", md: "85%" }}
      height={"full"}
    >
      <Box display={"flex"} w={"100%"} flex={1} height={"100%"}>
        <SideRightMenu />
        <Flex
          gap={3}
          px={{ base: 5, md: 10 }}
          height={"100%"}
          w={"full"}
          minH={"70vh"}
          flex={1}
          direction={{ base: "column", md: "row" }}
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
        >
          {children}
        </Flex>
      </Box>
      <Box
        w={"full"}
        style={{
          height: "100px",
          marginTop: "20px",
        }}
      />
    </Container>
  );
}

export default PageContainer;
