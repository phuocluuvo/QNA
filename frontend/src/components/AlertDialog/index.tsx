import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  buttonStyle?: ButtonProps;
  buttonText?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  content: JSX.Element | string;
  confirmText?: string;
  cancelText?: string;
  confirmAction?: () => void;
  confirmButtonStyle?: ButtonProps;
  cancelButtonStyle?: ButtonProps;
  title?: string;
}

function CustomAlertDialog({
  buttonStyle,
  buttonText,
  title,
  content,
  isOpen = false,
  onOpen = () => {},
  onClose = () => {},
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmAction = () => {},
  confirmButtonStyle,
  cancelButtonStyle,
}: Props) {
  const cancelRef = React.useRef();

  return (
    <>
      <Button {...buttonStyle} colorScheme="red" onClick={onOpen}>
        {buttonText}
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        isOpen={isOpen}
        // @ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{content}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                // @ts-ignore
                ref={cancelRef}
                {...confirmButtonStyle}
                onClick={() => {
                  confirmAction();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
              <Button {...cancelButtonStyle} onClick={onClose} ml={3}>
                {cancelText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default CustomAlertDialog;
