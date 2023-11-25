import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { UserType } from "@/util/type/User.type";
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Spacer,
  Text,
  VStack,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import Author from "../Author";
import { QuestionType } from "@/util/type/Question.type";
import { FaFlag, FaRegFlag } from "react-icons/fa";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function AlertContent({ question }: { question: QuestionType }) {
  const { colorMode } = useColorMode();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const renderItemBaseOnType = (type: string) => {
    switch (type) {
      case "blocked":
        return (
          <VStack
            style={{
              whiteSpace: "pre-line",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              padding: "10px",
              marginBlock: "10px",
              alignItems: "flex-start",
            }}
            divider={<Divider />}
          >
            <Box data-color-mode={colorMode}>
              <Badge colorScheme="red">{getTranslate("BLOCKED")}</Badge>
              <EditerMarkdown
                source={question.comments[0].content}
                style={{
                  fontSize: "16px",
                  backgroundColor: "transparent",
                }}
              />
            </Box>
            <HStack w={"full"} spacing={0}>
              <IconButton
                variant={"ghost"}
                colorScheme="red"
                aria-label="delete"
                icon={<FaRegFlag />}
                onClick={onOpen}
              />
              <Author
                user={question.comments[0].user}
                nameStyle={{
                  fontSize: "12px",
                }}
                type="simple"
                sizeAvatar={"xs"}
                bottomText={"Verified at " + question.comments[0].createdAt}
              />
            </HStack>
          </VStack>
        );
      case "pending":
        return (
          <HStack
            style={{
              whiteSpace: "pre-line",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              backgroundColor: "rgba(255, 255, 0, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              padding: "10px",
              marginBlock: "10px",
            }}
          >
            <Badge colorScheme="yellow">{getTranslate("PENDING")}</Badge>
            <Text>This question is pending for review</Text>
            {/* <EditerMarkdown
              source={question.comments[0].content}
              style={{
                fontSize: "12px",
              }}
            /> */}
          </HStack>
        );
      default:
        return <></>;
    }
  };
  return (
    <>
      {renderItemBaseOnType(question.state)}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AlertContent;
