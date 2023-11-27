import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
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
  Radio,
  RadioGroup,
  useToast,
  Textarea,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Author from "../Author";
import { QuestionType } from "@/util/type/Question.type";
import { FaFlag } from "react-icons/fa";
import api from "@/API/api";
import { useSession } from "next-auth/react";
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
  const [flagReasonSelect, setFlagReasonSelect] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [flagNumber, setFlagNumber] = useState(3);
  const toast = useToast();
  const session = useSession();
  useEffect(() => {
    if (session.data) {
      api.getFlagNumber(question.id).then((res) => {
        if (res?.data) {
          setFlagNumber(3 - res.data);
        }
      });
    }
  }, []);
  const submitComment = () => {
    api
      .createCancelBlockedComment({
        content: flagReason,
        question_id: question.id,
      })
      .then((res) => {
        console.log(res);
        if (res) {
          api.getFlagNumber(question.id).then((res) => {
            if (res?.data) {
              console.log("getFlagNumber", res.data);
              setFlagNumber(3 - res.data);
            }
          });
          api.unBlockQuestion(question.id).then((res) => {
            console.log(res);
          });
          toast({
            title: "Send Comment success",
            description:
              "Your response is under processing! Please wait 1 - 2 days!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        } else
          toast({
            title: "Send Comment fail",
            description: "There is some thing wrong! Please try again!",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        onClose();
      })
      .catch((err) => {
        toast({
          title: "Send Comment fail",
          description: "There is some thing wrong! Please try again!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.log(err);
      });
  };
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
              marginRight: "30px",
            }}
            divider={<Divider />}
          >
            <Box data-color-mode={colorMode}>
              <Badge colorScheme="red">{getTranslate("BLOCKED")}</Badge>
              <EditerMarkdown
                source={question.comments[0]?.content}
                style={{
                  fontSize: "16px",
                  backgroundColor: "transparent",
                }}
              />
            </Box>
            <HStack w={"full"} spacing={0}>
              <Tooltip
                label={
                  flagNumber <= 0
                    ? "You can't flag this question anymore"
                    : "Flag this question. You have " + flagNumber + " left"
                }
              >
                <HStack
                  spacing={0}
                  display={
                    question.user.id !== session.data?.user.id ? "none" : "flex"
                  }
                >
                  <Heading fontSize={"sm"} color={"darkred"}>
                    {flagNumber.toString()}
                  </Heading>
                  <IconButton
                    variant={"ghost"}
                    colorScheme="red"
                    aria-label="delete"
                    icon={<FaFlag />}
                    isDisabled={flagNumber === 0}
                    onClick={onOpen}
                  />
                </HStack>
              </Tooltip>
              {question.comments[0]?.user && (
                <Author
                  user={question.comments[0]?.user}
                  nameStyle={{
                    fontSize: "12px",
                  }}
                  type="simple"
                  sizeAvatar={"xs"}
                  bottomText={"Verified at " + question.comments[0]?.createdAt}
                />
              )}
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
  useEffect(() => {
    let count = 0;
    question.comments.forEach((comment) => {
      if (comment.type === "undelete") count += 1;
    });
    if (count <= 3) setFlagNumber((prevFlagNumber) => prevFlagNumber - count);
    else setFlagNumber(0);
  }, [question]);
  return (
    <>
      {renderItemBaseOnType(question.state)}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>I require this question need...</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup
              onChange={(e) => {
                setFlagReasonSelect(e);
              }}
            >
              <Radio value="intervention">Moderator interventions</Radio>
            </RadioGroup>
            <Textarea
              placeholder="Please enter your reason"
              display={flagReasonSelect === "intervention" ? "block" : "none"}
              onChange={(e) => setFlagReason(e.target.value)}
              value={flagReason}
              minLength={10}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                submitComment();
              }}
              isDisabled={flagReason.length < 10}
            >
              Submit ({flagNumber} left)
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AlertContent;
