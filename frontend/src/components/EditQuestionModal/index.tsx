import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  newTitle: string;
  newContent: string;
  newTags: string[];
  setNewTitle(title: string): void;
  setNewContent(content: string): void;
  setNewTags(tags: string[]): void;
};
function EditQuesitonModal({
  isOpen,
  onClose,
  newTitle,
  newContent,
  newTags,
  setNewTitle,
  setNewContent,
  setNewTags,
}: Props) {
  const { getTranslate } = LanguageHelper(Pages.HOME);
  return (
    <div>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
            />
            <Input
              type="text"
              value={newContent}
              onChange={(e) => {
                setNewContent(e.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {getTranslate("CLOSE")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default EditQuesitonModal;
