import { ActionGetUserHistory } from "@/API/redux/actions/user/ActionGetActivityHistory";
import actionGetProfile from "@/API/redux/actions/user/ActionGetProfile";
import { Pages } from "@/assets/constant/Pages";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import {
  HistoryActivityListType,
  HistoryActivityType,
} from "@/util/type/HistoryActivity";
import { UserType } from "@/util/type/User.type";
import { TimeIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Container,
  HStack,
  Heading,
  Image,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Toast,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { BiCake } from "react-icons/bi";
import { FaBirthdayCake, FaClock, FaRegClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
const DEFAULT_USER: UserType = {
  fullname: "",
  email: "",
  id: "",
  createdAt: "",
  dob: "",
  updatedAt: "",
  username: "",
  avatar: "",
};
function DashBoard() {
  const [state, setState] = React.useState<UserType>(DEFAULT_USER);
  const [history, setHistory] = React.useState<HistoryActivityListType | null>(
    null
  );
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
  const { getCurrentLanguage } = LanguageHelper(Pages.HOME);
  React.useEffect(() => {
    dispatch(
      // @ts-ignore
      ActionGetUserHistory(
        {
          limit: 5,
          page: 1,
        },
        (res) => {
          setHistory(res);
        },
        (err) => {
          console.log(err);
        }
      )
    );
    dispatch(
      actionGetProfile(
        (res: UserType) => {
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
          <Heading>{state.fullname}</Heading>
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
      <TableContainer mt={5}>
        <Table
          variant="striped"
          size={{
            base: "sm",
            md: "lg",
          }}
        >
          <TableCaption>
            {history?.data.length} activities in {history?.meta.itemCount} pages
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Activity</Th>
              <Th>Date</Th>
              <Th isNumeric>Point Received</Th>
            </Tr>
          </Thead>
          <Tbody>
            {history?.data.map((item: HistoryActivityType) => (
              <Tr>
                <Td>
                  {getCurrentLanguage().code === "vi"
                    ? helper.getTranslationFromHistoryAcitvityVi(
                        item.activityType
                      )
                    : helper.getTranslationFromHistoryAcitvityEn(
                        item.activityType
                      )}
                </Td>
                <Td>
                  {helper.formatDate(
                    item.createdAt,
                    false,
                    "HH:mm:ss - DD/MM/YYYY"
                  )}
                </Td>
                <Td isNumeric>{item.pointChange}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default DashBoard;
