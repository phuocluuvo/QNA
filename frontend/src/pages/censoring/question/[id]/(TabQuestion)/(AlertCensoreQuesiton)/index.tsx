import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

function AlertCensoreQuesiton({
  isOpen,
  onClose,
  cancelRef,
  onClick,
  type = "verify",
}: {
  isOpen: boolean;
  onClose: () => void;
  cancelRef: any;
  onClick: () => void;
  type: "verify" | "reject";
}) {
  const router = useRouter();
  return (
    <AlertDialog
      isOpen={isOpen}
      //@ts-ignore
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {type === "verify" ? "Verify Question" : "Reject Question"}
          </AlertDialogHeader>

          <AlertDialogBody>
            {type === "verify"
              ? "Are you sure to verify this question?"
              : "Are you sure to reject this question?"}
          </AlertDialogBody>

          <AlertDialogFooter>
            {/* @ts-ignore */}
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme={type === "verify" ? "green" : "red"}
              onClick={() => {
                onClick();
                setTimeout(() => {
                  onClose();
                  router.push("/censoring/question");
                }, 200);
              }}
              ml={3}
            >
              {type === "verify" ? "Verify" : "Reject"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default AlertCensoreQuesiton;
