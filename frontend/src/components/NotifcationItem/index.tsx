import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Tooltip,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationType } from "@/util/type/Notification.type";
import helper from "@/util/helper";
import { BiPin } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/router";
import { ActionReadNotification } from "@/API/redux/actions/user/ActionReadNotification";
import { useDispatch } from "react-redux";
import { RiMailLine } from "react-icons/ri";
import { LayoutContext } from "@/provider/LayoutProvider";
import { OBJECT_ACTIVITY_TYPE } from "@/util/type/HistoryActivity.enum";
import actionGetQuestion from "@/API/redux/actions/question/ActionGetQuestion";
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
    let type = item.activity.objectType;
    switch (type) {
      case OBJECT_ACTIVITY_TYPE.QUESTION: {
        let itemObject = item.activity.question;
        itemRender = (
          <Box
            style={{
              height: 100,
              width: "100%",
              position: "relative",
            }}
          >
            <Heading size={"sm"}>{itemObject?.title} </Heading>
            <Box
              dangerouslySetInnerHTML={{
                __html: itemObject?.content as string,
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
                  router.push(`/question/${itemObject?.id}`);
                }}
              >
                show more
              </Text>
            </Box>
          </Box>
        );
        break;
      }
      case OBJECT_ACTIVITY_TYPE.ANSWER: {
        let itemObject = item.activity.answer;
        itemRender = (
          <Box
            style={{
              height: 100,
              width: "100%",
              position: "relative",
            }}
          >
            <Box
              dangerouslySetInnerHTML={{
                __html: itemObject?.content as string,
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
                    `/question/${itemObject?.question.id}#${itemObject?.id}`
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
              height: 100,
              width: "100%",
              position: "relative",
            }}
          >
            <Heading size={"sm"}>{question?.title} </Heading>
            <Box
              dangerouslySetInnerHTML={{
                __html: question?.content as string,
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
                  // router.push(`/question/${itemObject?.id}`);
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
        <HStack w={"full"} onClick={onOpen}>
          <Text fontSize={"sm"} display={"flex"}>
            {/* @ts-ignore */}
            <Image
              src="/images/favicon.ico"
              alt="logo"
              width={20}
              height={20}
              style={{ display: item.isAnnouncement ? "block" : "none" }}
            />
            {helper.getTranslationFromNotificationEn(item.title)}
          </Text>
          <Spacer />
          <HStack>
            <Text
              fontSize={"sm"}
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
          </HStack>
        </HStack>
        <Text fontSize={"sm"}>
          {/* @ts-ignore */}
          {helper.getTranslationFromNotificationEn(item.description)}
        </Text>
        <IconButton
          aria-label=""
          onClick={() => {
            readNotification();
          }}
          size={"xs"}
          icon={<RiMailLine />}
        />
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        size={"xl"}
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NotificationItem;
