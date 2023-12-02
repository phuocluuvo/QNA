"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationType } from "@/util/type/Notification.type";
import helper, { markdownToPlainText } from "@/util/helper";
import { BiPin } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/router";
import { ActionReadNotification } from "@/API/redux/actions/user/ActionReadNotification";
import { useDispatch } from "react-redux";
import { RiMailLine } from "react-icons/ri";
import { LayoutContext } from "@/provider/LayoutProvider";
import { OBJECT_ACTIVITY_TYPE } from "@/util/type/HistoryActivity.enum";
import _ from "lodash";
import dynamic from "next/dynamic";
import Author from "../Author";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function NotificationItem({
  notification,
  type = "normal",
}: {
  notification: NotificationType;
  index: number;
  type?: "normal" | "small";
  itemSize?: number;
}) {
  const { colorMode } = useColorMode();

  const [hydrated, setHydrated] = useState(false);
  const [item, setItem] = React.useState<NotificationType>(notification);
  const [isShowDetail, setIsShowDetail] = React.useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { setBadgeNumber } = React.useContext(LayoutContext);
  const router = useRouter();
  const dispatch = useDispatch();

  const getContentBasedOnType = () => {
    let itemRender = <></>;
    let _type = item.activity.objectType;
    switch (_type) {
      case OBJECT_ACTIVITY_TYPE.QUESTION: {
        let itemObject = item.activity.question;
        let _type = itemObject?.state;
        itemRender = (
          <Box
            style={{
              height: 100,
              width: "100%",
              position: "relative",
            }}
          >
            <Text>
              Your quesiton{" "}
              <Button
                variant={"link"}
                colorScheme="blue"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(`/question/${itemObject?.id}`);
                }}
              >
                {itemObject?.title}
              </Button>{" "}
              got a{" "}
              <Text
                as="span"
                style={{
                  fontWeight: "bold",
                  color: _type === "verified" ? "green" : "red",
                }}
              >
                {_type?.toLocaleLowerCase()}
              </Text>{" "}
              from{" "}
              <Button
                variant={"link"}
                colorScheme="blue"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(`/user/${item.activity.user?.id}`);
                }}
              >
                {item.activity.user?.fullname}
              </Button>
            </Text>
            {itemObject?.content ? (
              <EditerMarkdown
                source={itemObject?.content}
                style={{
                  fontSize: "16px",
                  backgroundColor: "transparent",
                  maxHeight: "100%",
                  overflow: "hidden",
                  color: colorMode === "dark" ? "white" : "black",
                }}
                data-color-mode={colorMode}
              />
            ) : (
              <></>
            )}
          </Box>
        );
        break;
      }
      case OBJECT_ACTIVITY_TYPE.ANSWER: {
        let itemObject = item.activity.answer;
        itemRender = (
          <Box
            style={{
              height: "fit-content",
              maxHeight: 300,
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Heading size={"sm"}>{itemObject?.question.title}</Heading>

            <EditerMarkdown
              source={itemObject?.content}
              style={{
                fontSize: "16px",
                backgroundColor: "transparent",
                color: colorMode === "dark" ? "white" : "black",
              }}
            />
            <Box
              style={{
                position: "absolute",
                bottom: "-10px",
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                left: "50%",
                width: "100%",
                transform: "translateX(-50%)",
                background: `linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0),
                 ${
                   colorMode === "dark"
                     ? "rgba(0, 0, 0, 1)"
                     : "rgba(255, 255, 255, 1)"
                 }
                )`,
              }}
            >
              <Text
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(
                    `/question/${itemObject?.question.id}#${itemObject?.id}`,
                    undefined,
                    {
                      shallow: false,
                    }
                  );
                }}
              >
                show more
              </Text>
            </Box>
          </Box>
        );
        break;
      }
      case OBJECT_ACTIVITY_TYPE.COMMENT: {
        let itemObject = item.activity.comment;
        let question = itemObject?.question;

        itemRender = (
          <Box
            style={{
              height: "fit-content",
              maxHeight: 300,
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Text>
              Your quesiton{" "}
              <Button
                variant={"link"}
                colorScheme="blue"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(`/question/${question?.id}`);
                }}
              >
                {question?.title}
              </Button>{" "}
              got a comment from{" "}
              <Button
                variant={"link"}
                colorScheme="blue"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(`/user/${item.activity.user?.id}`);
                }}
              >
                {item.activity.user?.fullname}
              </Button>
            </Text>

            <Box
              data-color-mode={colorMode}
              style={{
                border: "1px solid",
                borderRadius: "10px",
                padding: "10px",
                position: "relative",
                display: "flex",
              }}
              height={"80%"}
              my={2}
              borderColor={
                colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"
              }
            >
              {itemObject?.content ? (
                <EditerMarkdown
                  source={itemObject?.content}
                  style={{
                    fontSize: "12px",
                    backgroundColor: "transparent",
                    color: colorMode === "dark" ? "white" : "black",
                  }}
                />
              ) : (
                <></>
              )}
            </Box>
          </Box>
        );
        break;
      }
      case OBJECT_ACTIVITY_TYPE.VOTE_QUESTION: {
        let itemObject = item.activity.question;
        itemRender = (
          <Box
            style={{
              height: "fit-content",
              maxHeight: 300,
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Text>Your quesiton:</Text>
            <Button
              variant={"link"}
              colorScheme="blue"
              style={{
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => {
                router.push(`/question/${itemObject?.id}`);
              }}
            >
              <Text maxW={"full"} textOverflow={"ellipsis"} noOfLines={1}>
                {itemObject?.title}
              </Text>
            </Button>
            <Text>
              Got a vote from{" "}
              <Button
                variant={"link"}
                colorScheme="blue"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(`/user/${item.activity.user?.id}`);
                }}
              >
                {item.activity.user?.fullname}
              </Button>
            </Text>
            <EditerMarkdown
              source={itemObject?.content}
              style={{
                fontSize: "16px",
                backgroundColor: "transparent",
                color: colorMode === "dark" ? "white" : "black",
              }}
            />
            <Box
              style={{
                position: "absolute",
                bottom: "-10px",
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                left: "50%",
                width: "100%",
                transform: "translateX(-50%)",
                background: `linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0),
                 ${
                   colorMode === "dark"
                     ? "rgba(0, 0, 0, 1)"
                     : "rgba(255, 255, 255, 1)"
                 }
                )`,
              }}
            >
              <Text
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(`/question/${itemObject?.id}`, undefined, {
                    shallow: false,
                  });
                }}
              >
                show more
              </Text>
            </Box>
          </Box>
        );
        break;
      }
      case OBJECT_ACTIVITY_TYPE.VOTE_ANSWER: {
        let itemObject = item.activity.answer;
        itemRender = (
          <Box
            style={{
              height: "fit-content",
              maxHeight: 300,
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Text>Question:</Text>
            <Button
              variant={"link"}
              colorScheme="blue"
              style={{
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => {
                router.push(`/question/${itemObject?.question.id}`);
              }}
            >
              <Text maxW={"full"} textOverflow={"ellipsis"} noOfLines={1}>
                {itemObject?.question.title.slice(0, 100) + "..."}
              </Text>
            </Button>
            <Text>
              Got a vote from{" "}
              <Button
                variant={"link"}
                colorScheme="blue"
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(`/user/${item.activity.user?.id}`);
                }}
              >
                {item.activity.user?.fullname}
              </Button>
            </Text>
            <EditerMarkdown
              source={itemObject?.content}
              style={{
                fontSize: "14px",
                backgroundColor: "transparent",
                color: colorMode === "dark" ? "white" : "black",
              }}
            />
            <Box
              style={{
                position: "absolute",
                bottom: "-10px",
                height: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                left: "50%",
                width: "100%",
                transform: "translateX(-50%)",
                background: `linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0),
                 ${
                   colorMode === "dark"
                     ? "rgba(0, 0, 0, 1)"
                     : "rgba(255, 255, 255, 1)"
                 }
                )`,
              }}
            >
              <Text
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
                onClick={() => {
                  router.push(
                    `/question/${itemObject?.question.id}#${itemObject?.id}`,
                    undefined,
                    {
                      shallow: false,
                    }
                  );
                }}
              >
                show more
              </Text>
            </Box>
          </Box>
        );
        break;
      }
      default:
        itemRender = <></>;
    }
    return itemRender;
  };
  function readNotification() {
    dispatch(
      // @ts-ignore
      ActionReadNotification(
        item.id,
        (res: NotificationType) => {
          setItem({
            ...item,
            isRead: res.isRead,
          });
          if (typeof res.notificationsNumber === "number")
            setBadgeNumber(res.notificationsNumber);
        },
        () => {}
      )
    );
  }
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  const titleNotifiction = () => {
    let title = "";
    switch (item?.activity?.objectType) {
      case OBJECT_ACTIVITY_TYPE.QUESTION:
        title = "Your question just got " + item.activity?.question?.state;
        break;
      case OBJECT_ACTIVITY_TYPE.ANSWER:
        title = "Answer";
        break;
      case OBJECT_ACTIVITY_TYPE.COMMENT:
        title = "Your question just got a comment!";
        break;
      case OBJECT_ACTIVITY_TYPE.VOTE_QUESTION:
        title = "Your question just got a vote!";
        break;
      case OBJECT_ACTIVITY_TYPE.VOTE_ANSWER:
        title = "Your answer just got a vote!";
        break;
      case OBJECT_ACTIVITY_TYPE.TAG:
        title = "Your tag just got verify! Let create a question with it!";
      default:
        title = "Notification";
        break;
    }
    return title;
  };
  return (
    <>
      <Button
        alignItems={"flex-start"}
        variant={type === "small" ? "ghost" : "unstyled"}
        style={{
          border: "1px solid",
          borderColor: item.isAnnouncement ? "red" : "gray",
          borderRadius: "10px",
          padding: "10px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "fit-content",
          marginTop: "10px",
          width: "100%",
          ...(type === "small" && {
            padding: "5px",
            height: "fit-content",
            marginTop: "0px",
            border: "none",
          }),
        }}
        opacity={!item.isRead ? 1 : 0.5}
      >
        <Stack
          direction={type === "normal" ? "row" : "column"}
          w={"full"}
          onClick={onOpen}
        >
          <Text fontSize={"sm"} display={"flex"}>
            {/* @ts-ignore */}
            <Image
              src="/images/favicon.ico"
              alt="logo"
              width={20}
              height={20}
              style={{ display: item.isAnnouncement ? "block" : "none" }}
            />
            {titleNotifiction()}
          </Text>
          <Spacer />
          <HStack>
            <Text
              fontSize={"xs"}
              style={{
                color: "gray",
              }}
            >
              at{" "}
              {helper.formatDate(item.createdAt, false, "hh:mm:ss DD/MM/YYYY")}
            </Text>
            {item.isAnnouncement && (
              <Tooltip hasArrow label={"Pin by admin"} aria-label="A tooltip">
                <IconButton
                  size={"xs"}
                  display={item.isAnnouncement ? "flex" : "none"}
                  aria-label="Search database"
                  icon={<BiPin />}
                  style={{
                    color: item.isAnnouncement ? "red" : "gray",
                  }}
                />
              </Tooltip>
            )}
            <Spacer />
            <IconButton
              aria-label=""
              onClick={() => {
                readNotification();
              }}
              size={"xs"}
              icon={<RiMailLine />}
            />
          </HStack>
        </Stack>
        <Text fontSize={"sm"}>
          {/* @ts-ignore */}
          {item.activity?.objectType === OBJECT_ACTIVITY_TYPE.COMMENT && (
            <Text
              w={"fit-content"}
              isTruncated
              style={{
                fontSize: "16px",
                backgroundColor: "transparent",
                color: colorMode === "dark" ? "white" : "black",
                display: type === "small" ? "none" : "unset",
              }}
            >
              {markdownToPlainText(item.activity.comment?.content ?? "").slice(
                0,
                100
              )}
              ...
            </Text>
          )}
          {item.activity?.objectType === OBJECT_ACTIVITY_TYPE.ANSWER && (            
            <Text
              isTruncated
              w={"100%"}
              maxW={"50vw"}
              display={type === "small" ? "none" : ""}
            >
              {/* @ts-ignore */}
              {markdownToPlainText(item.activity.answer?.content)}
              ...
            </Text>
          )}
          {item.activity?.objectType === OBJECT_ACTIVITY_TYPE.QUESTION && (
            <Text
              as="span"
              style={{
                fontWeight: "bold",
              }}
            >
              {item.activity.question?.user?.username}
            </Text>
          )}
        </Text>
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        size={"2xl"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Notification</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              onClose();
              router.push({
                pathname: "/user/notification",
                query: {
                  ...router.query,
                  id: undefined,
                },
              });
            }}
          />
          <ModalBody>
            {/* @ts-ignore */}
            {isOpen && item.activity && getContentBasedOnType()}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NotificationItem;
