import { Colors } from "@/assets/constant/Colors";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  IconButton,
  useColorMode,
  HStack,
  Avatar,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
type DrawerMenuProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
  closeButton?: React.ReactNode;
  onCloseButtonClick?: () => void;
};
export default function DrawerMenu({
  isOpen,
  onOpen,
  onClose,
  children,
  closeButton,
  onCloseButtonClick,
}: DrawerMenuProps) {
  const { colorMode } = useColorMode();
  const session = useSession();
  return (
    <>
      <IconButton
        aria-label="Open menu"
        icon={<HamburgerIcon />}
        onClick={onCloseButtonClick}
        variant="ghost"
        color={Colors(colorMode === "dark").PRIMARY}
        _hover={{ bg: "transparent" }}
        transition="all 0.5s"
        transform={isOpen ? "rotate(90deg)" : ""}
      />
      <Drawer
        size={{
          sm: "full",
          md: "sm",
        }}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent
          backdropFilter={"blur(10px)"}
          backgroundColor={"blackAlpha.300"}
        >
          <IconButton
            as={DrawerCloseButton}
            aria-label="Open menu"
            icon={<CloseIcon />}
            onClick={onCloseButtonClick}
            variant="ghost"
            position={"absolute"}
            color={Colors(colorMode === "dark").PRIMARY}
            _hover={{ bg: "transparent" }}
            transition="all 0.5s"
            transform={isOpen ? "rotate(90deg)" : ""}
          />
          <DrawerHeader>
            {session.data?.user ? (
              <HStack>
                <Avatar src={session.data.user.avatar} />
                <span>Hi, {session.data.user.fullname}</span>
              </HStack>
            ) : null}
          </DrawerHeader>

          <DrawerBody>{children}</DrawerBody>

          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
}
