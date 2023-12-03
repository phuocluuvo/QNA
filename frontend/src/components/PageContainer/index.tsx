import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  StackDivider,
  Text,
  VStack,
  styled,
} from "@chakra-ui/react";
import React from "react";
import SideRightMenu from "../SideRightMenu";
import { LayoutContext } from "@/provider/LayoutProvider";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import authorInfo from "@/util/authors.info.json";
import { ActionGetBadgeNotification } from "@/API/redux/actions/user/ActionGetNotificationBadge";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { RiMailFill } from "react-icons/ri";
type Props = {
  children: React.ReactNode;
};
function PageContainer({ children }: Props) {
  const { setBadgeNumber } = React.useContext(LayoutContext);
  const dispatch = useDispatch();
  const session = useSession();
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      let checkUser =
        sessionStorage.getItem("next-auth.session-token")?.toString() ?? null;
      if (checkUser !== "undefined") {
        dispatch(
          // @ts-ignore
          ActionGetBadgeNotification(
            (res: any) => {
              setBadgeNumber(res);
            },
            (err: any) => {}
          )
        );
      } else {
        setBadgeNumber(0);
      }
    }, 3000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <Container
      as={VStack}
      divider={<StackDivider />}
      maxW={{ base: "98vw", md: "85%" }}
      height={"full"}
    >
      <Box display={"flex"} w={"100%"} flex={1} height={"100%"} mb={20}>
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
          height: "fit-content",
          margin: "20px",
        }}
      >
        <HStack
          style={{
            height: "fit-content",
          }}
          alignSelf={"center"}
          justifyContent={"center"}
        >
          {authorInfo.map((author) => (
            <VStack flex={0.5}>
              <Text
                _hover={{
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
                w={"full"}
                fontSize={"xs"}
                colorScheme="gray"
                opacity={0.2}
              >
                {author.name}
              </Text>
              <VStack
                w={"full"}
                justifyContent={"start"}
                alignItems={"start"}
                spacing={5}
              >
                <LinkCustom href={author.github} target="_blank">
                  <FaGithub size={20} />
                  {author.github}
                </LinkCustom>
                <LinkCustom href={author.linkedin} target="_blank">
                  <FaLinkedin size={20} />
                  {author.linkedin ?? ""}
                </LinkCustom>
                <LinkCustom href={`mailto:${author.gmail}`} target="_blank">
                  <RiMailFill size={20} />
                  {author.gmail}
                </LinkCustom>
                <LinkCustom href={author.facebook} target="_blank">
                  <FaFacebook size={20} />
                  {author.facebook}
                </LinkCustom>
              </VStack>
            </VStack>
          ))}
        </HStack>
        <Text fontSize="sm" align="left" w="full" mt={10}>
          © {new Date().getFullYear()} QuestionAndAnswerIt. All rights reserved.
        </Text>
      </Box>
    </Container>
  );
}

const LinkCustom = styled(Link, {
  baseStyle: {
    fontWeight: "thin",
    fontSize: "12px",
    display: "flex",
    justifyContent: "start",
    opacity: 0.5,
    transition: "all 0.2s ease-in-out",
    _hover: {
      fontWeight: "bold",
    },
  },
});

export default PageContainer;
