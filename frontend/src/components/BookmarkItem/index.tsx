import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { BookmarkType } from "@/util/type/Bookmark.type";
import { CollectionType } from "@/util/type/Collection.type";
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  VStack,
  HStack,
  Button,
  Tag,
  Box,
  styled,
  Text,
  Spacer,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  Input,
  Select,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiMenu2Line } from "react-icons/ri";

function BookmarkItem({
  bookmark,
  router,
  index,
  bookmarksLength,
  colorMode,
  collections,
}: {
  bookmark: BookmarkType;
  router: NextRouter;
  index: number;
  bookmarksLength: number;
  colorMode: "light" | "dark";
  collections?: Array<CollectionType>;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [newCollectionName, setNewCollectionName] = React.useState("");
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const moveCollection = (collectionName: string) => {
    console.log(collectionName);
  };
  return (
    <>
      <Box
        maxW={"100%"}
        minW={{ base: "100%", md: "50vw" }}
        flex={1}
        style={{
          display: "flex",
          width: "100%",
          padding: "15px 15px",
          border: "1px solid",
          borderBottom: index !== bookmarksLength - 1 ? "none" : "1px solid",
          borderColor: Colors(colorMode === "dark").BORDER,
          borderTopLeftRadius: index === 0 ? "10px" : "none",
          borderTopRightRadius: index === 0 ? "10px" : "none",
          borderBottomLeftRadius:
            index === bookmarksLength - 1 ? "10px" : "none",
          borderBottomRightRadius:
            index === bookmarksLength - 1 ? "10px" : "none",
        }}
      >
        <VStack
          w={"full"}
          alignItems={"flex-start"}
          justifyItems={"flex-start"}
          spacing={0.5}
        >
          <TopItemContainer>
            <HStack w={"100%"} justifyContent={"flex-start"}>
              <SmallText>{bookmark.question.votes} votes</SmallText>
              <SmallText
                style={{
                  padding: "2px 5px",
                  borderRadius: "5px",
                  border: "1px solid green",
                }}
              >
                {bookmark.question.answersNumber} answer(s)
              </SmallText>
              <SmallText>{bookmark.question.views} views</SmallText>
            </HStack>
            <SmallText
              minW={"fit-content"}
              display={{
                sm: "none",
                md: "block",
              }}
            >
              Saved in
              <Text
                as="span"
                style={{
                  color: Colors(colorMode === "dark").PRIMARY,
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {bookmark.collection === null
                  ? "For later"
                  : bookmark.collection}
              </Text>
            </SmallText>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BiDotsVerticalRounded />}
                variant="ghost"
              />
              <MenuList>
                <MenuItem>Unsaved</MenuItem>
                <MenuItem onClick={onOpen}>Move to...</MenuItem>
              </MenuList>
            </Menu>
          </TopItemContainer>
          <Button
            style={{
              textAlign: "left",
              width: "100%",
              justifyContent: "flex-start",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              paddingBlock: "10px",
            }}
            variant={"link"}
            fontSize={{
              base: "xs",
              md: "lg",
            }}
            onClick={() => {
              router.push(`/question/${bookmark.question.id}`);
            }}
          >
            {bookmark.question.title}
          </Button>
          <Box display={"flex"} w={"full"}>
            {bookmark?.question?.tagNames?.map((tag) => (
              <Tag size={"sm"} variant={"solid"}>
                {tag}
              </Tag>
            ))}
          </Box>
          <SmallText
            display={{
              md: "none",
            }}
            minW={"fit-content"}
          >
            Saved in
            <Text
              as="span"
              style={{
                color: Colors(colorMode === "dark").PRIMARY,
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              {bookmark.collection === null
                ? getTranslate("FOR_LATER")
                : bookmark.collection}
            </Text>
          </SmallText>
        </VStack>
        <AlertDialog
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />

          <AlertDialogContent>
            <AlertDialogHeader>Move to...</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Text>Collection name</Text>
              <Text
                style={{
                  color: Colors(colorMode === "dark").PRIMARY,
                  fontWeight: "bold",
                }}
              >
                Move current question to {newCollectionName}?
              </Text>
              <Select
                variant={"filled"}
                placeholder={"Select collection"}
                onChange={(e) => {
                  setNewCollectionName(e.target.value);
                }}
              >
                {collections?.map((collection) => (
                  <option value={collection.name}>
                    {collection.name ?? "No Name"}
                  </option>
                ))}
                <option value={"null"}>{"For later"}</option>
              </Select>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Box>
    </>
  );
}
const SmallText = styled("p", {
  baseStyle: {
    fontSize: "xs",
  },
});

const TopItemContainer = styled("div", {
  baseStyle: {
    justifyContent: "space-between",
    display: "flex",
    width: "100%",
    position: "relative",
    alignItems: "center",
  },
});

export default BookmarkItem;
