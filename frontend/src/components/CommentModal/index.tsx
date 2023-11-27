import { CommentType } from "@/util/type/Comment.type";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  HStack,
  VStack,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import helper from "@/util/helper";
import { useSession } from "next-auth/react";
import Author from "../Author";
import dynamic from "next/dynamic";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function CommentModal({
  comments,
  isOpen,
  onClose,
}: {
  comments: CommentType[];
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
            spacing={0}
            divider={<Divider />}
          >
            {comments?.length > 0 &&
              comments.map((comment) => (
                <VStack w={"full"}>
                  <VStack
                    key={comment.id}
                    w={"full"}
                    opacity={0.8}
                    _hover={{
                      opacity: 1,
                    }}
                    p={2}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    borderRadius={"md"}
                    alignItems={"flex-start"}
                  >
                    <EditerMarkdown
                      source={comment.content}
                      style={{
                        textAlign: "left",
                        width: "100%",
                        wordBreak: "break-word",
                        backgroundColor: "transparent",
                        color: "black",
                      }}
                    />
                    <Text fontSize={"xs"}>
                      {helper.formatDate(
                        comment.createdAt,
                        false,
                        "H:mm A - ddd, DD/MM/YYYY"
                      )}
                    </Text>
                  </VStack>
                  <HStack w={"full"} justifyContent={"flex-end"} mb={5}>
                    <Spacer />
                    <Author type="normal" user={comment.user} />
                  </HStack>
                </VStack>
              ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant={"ghost"} colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CommentModal;
