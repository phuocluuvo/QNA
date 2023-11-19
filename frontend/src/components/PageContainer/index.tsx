import { Container, Flex, HStack, VStack } from "@chakra-ui/react";
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
    const intervalId = setInterval(() => {
      checkUser &&
        dispatch(
          // @ts-ignore
          ActionGetBadgeNotification(
            (res: any) => {
              setBadgeNumber(res);
            },
            (err: any) => {}
          )
        );
    }, 3000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
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
