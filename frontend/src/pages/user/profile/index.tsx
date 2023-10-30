import actionGetProfile from "@/API/redux/actions/user/ActionGetProfile";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import helper from "@/util/helper";
import { UserType } from "@/util/type/User.type";
import {
  Avatar,
  Box,
  Container,
  Image,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
const DEFAULT_USER: UserType = {
  fullname: "",
  email: "",
  id: "",
  createAt: "",
  dob: "",
  updateAt: "",
  username: "",
  avatar: "",
};
function DashBoard() {
  const [state, setState] = React.useState<UserType>(DEFAULT_USER);
  const dispatch = useDispatch();
  const toast = useToast();

  React.useEffect(() => {
    dispatch(
      actionGetProfile(
        (res: UserType) => {
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, {
              fullname: res.fullname,
              email: res.email,
              id: res.id,
              createAt: res.createAt,
              dob: res.dob,
              updateAt: res.updateAt,
              username: res.username,
              avatar: res.avatar,
            })
          );
        },
        () => {}
      )
    );
  }, []);
  return (
    <Container>
      <Box pos="relative" w={"fit-content"}>
        <Avatar
          src={state.avatar}
          boxSize="150px"
          objectFit="cover"
          borderRadius="12"
        />
        <Text
          cursor={"pointer"}
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
      <Text>name: {state.fullname}</Text>
      <Text>email: {state.email}</Text>
    </Container>
  );
}

export default DashBoard;
