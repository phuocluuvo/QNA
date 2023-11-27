import api from "@/API/api";
import actionGetAllAnnouncements from "@/API/redux/actions/announcement/actionAnnouncement";
import { markdownToPlainText } from "@/util/helper";
import {
  AnnouncementListType,
  AnnouncementType,
} from "@/util/type/Annoucement.type";
import {
  Box,
  Divider,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useColorMode,
  Spacer,
  HStack,
  Heading,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function Annoucements() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const [annoucements, setAnnouncements] = useState<AnnouncementListType>();
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementType>();
  useEffect(() => {
    dispatch(
      // @ts-ignore
      actionGetAllAnnouncements(
        (res) => {
          setAnnouncements(res);
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }, []);
  return (
    <Box
      bg={
        colorMode === "dark" ? "rgba(100,50,36, 0.5)" : "rgba(253,247,231, 0.5)"
      }
      style={{
        width: "100%",
        borderRadius: "5px",
        border:
          colorMode === "dark"
            ? "1px solid rgb(100,50,36)"
            : "1px solid rgb(245,214,137)",
      }}
    >
      <Heading
        w="full"
        style={{
          fontSize: "12px",
          backgroundColor:
            colorMode === "dark" ? "rgb(100,50,36)" : "rgb(250,236,198)",
          padding: "10px",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
        }}
      >
        Annoucements 🎉
      </Heading>
      <VStack divider={<Divider />} padding="10px">
        {annoucements?.data.map((annoucement) => (
          <Box
            onClick={() => {
              setSelectedAnnouncement(annoucement);
              onOpen();
            }}
            cursor={"pointer"}
            style={{
              padding: "10px",
              width: "100%",
            }}
          >
            <Text fontSize={"sm"}>{annoucement.title}</Text>
            <Text fontSize={"sm"} opacity={0.8} noOfLines={3}>
              {markdownToPlainText(annoucement.description)}
            </Text>
            <HStack>
              <Spacer />
              <Button
                size={"sm"}
                variant={"link"}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                Learn More
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
      <Modal size={"3xl"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedAnnouncement?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text></Text>
            <Box data-color-mode={colorMode}>
              <EditerMarkdown
                source={selectedAnnouncement?.description}
                style={{
                  fontSize: "16px",
                  backgroundColor: "transparent",
                }}
              />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              variant={"ghost"}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Annoucements;
