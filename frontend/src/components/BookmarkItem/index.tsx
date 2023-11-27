import api from "@/API/api";
import { actionAddBookmarkToCollection } from "@/API/redux/actions/question/ActionBookmark";
import { Colors } from "@/assets/constant/Colors";
import { Pages } from "@/assets/constant/Pages";
import { LayoutContext } from "@/provider/LayoutProvider";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { BookmarkType } from "@/util/type/Bookmark.type";
import { CollectionType } from "@/util/type/Collection.type";
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
  LockIcon,
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
  useToast,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiMenu2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const [newCollection, setNewCollection] = React.useState({
    name: "",
    id: "",
  });
  const { moveBookmarkToCollection, removeBookmark } =
    useContext(LayoutContext);
  const toast = useToast();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const deleteBookmark = () => {
    api.deleteBookmark(bookmark.id).then((res) => {
      console.log("Bookmark deleted", res);
      removeBookmark(bookmark);
      toast({
        title: "Success",
        description: `This question is removed successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };
  const moveCollection = (collectionName: string) => {
    let form = newCollection.id
      ? {
          bookmarkId: bookmark.id,
          collectionId: newCollection.id,
        }
      : {};
    dispatch(
      actionAddBookmarkToCollection(
        {
          bookmarkId: bookmark.id,
          // @ts-ignore
          collectionId: newCollection
            ? newCollection.id
              ? newCollection.id
              : null
            : null,
        },
        (res: BookmarkType) => {
          moveBookmarkToCollection(
            bookmark.collection,
            res.collection ? res.collection : null,
            bookmark
          );
          toast({
            title: "Success",
            description: `Move question to ${
              newCollection ? newCollection.name : "Save for later"
            } successfully`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        },
        // @ts-ignore
        (err) => {
          console.log(err);
        }
      )
    );
  };
  return (
    <>
      <Box
        maxW={"100%"}
        minW={{ base: "100%", md: "50vw" }}
        flex={1}
        bgColor={
          bookmark.question.state === "blocked" ? "rgba(255,0,0,0.3)" : ""
        }
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
              <Tag
                display={
                  bookmark.question.state === "blocked" ? "flex" : "none"
                }
                colorScheme="red"
              >
                <LockIcon />
                <Text as="span">Blocked</Text>
              </Tag>
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
                {!bookmark.collection?.name
                  ? getTranslate("FOR_LATER")
                  : bookmark.collection?.name}
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
                <MenuItem
                  onClick={() => {
                    deleteBookmark();
                  }}
                >
                  Unsaved
                </MenuItem>
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
            colorScheme={bookmark.question.state === "blocked" ? "red" : "blue"}
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
              {!bookmark.collection?.name
                ? getTranslate("FOR_LATER")
                : bookmark.collection?.name}
            </Text>
          </SmallText>
        </VStack>
        <AlertDialog
          motionPreset="slideInBottom"
          // @ts-ignore
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
                Move current question to {newCollection.name}?
              </Text>
              <Select
                variant={"filled"}
                placeholder={"Select collection"}
                onChange={(e) => {
                  collections &&
                    setNewCollection(
                      // @ts-ignore
                      (oldState) =>
                        helper.mappingState(oldState, {
                          // @ts-ignore
                          name:
                            e.target.value == null
                              ? getTranslate("FOL_LATER")
                              : collections.find(
                                  (collection) =>
                                    collection.id === e.target.value
                                )?.name,
                          id: e.target.value,
                        })
                    );
                }}
              >
                {collections?.map((collection) => (
                  <option value={collection.id}>
                    <span>{collection.name ?? "No Name"}</span>
                  </option>
                ))}
                <option value={"null"}>
                  <span>{getTranslate("FOR_LATER")}</span>
                </option>
              </Select>
            </AlertDialogBody>
            <AlertDialogFooter>
              {/* @ts-ignore */}
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={() => {
                  moveCollection(newCollection.name);
                }}
              >
                {getTranslate("CONFIRM")}
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
