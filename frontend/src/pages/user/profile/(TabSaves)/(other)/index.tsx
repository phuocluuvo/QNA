import api from "@/API/api";
import { actionGetAllCollectionByID } from "@/API/redux/actions/question/ActionBookmark";
import { Pages } from "@/assets/constant/Pages";
import BookmarkItem from "@/components/BookmarkItem";
import { LayoutContext } from "@/provider/LayoutProvider";
import { LanguageHelper } from "@/util/Language/Language.util";
import { BookmarkListType, BookmarkType } from "@/util/type/Bookmark.type";
import { CollectionType } from "@/util/type/Collection.type";
import {
  Box,
  HStack,
  Text,
  VStack,
  useColorMode,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Button,
  Spacer,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";

function OtherTab({
  collection,
  collections,
  updateCollections,
}: {
  collection: CollectionType;
  collections: Array<CollectionType>;
  updateCollections: (collections: Array<CollectionType>) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const router = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const [_bookmarks, setBookmarks] = React.useState<BookmarkType[] | null>(
    null
  );
  const [newCollectionName, setNewCollectionName] = React.useState<string>("");
  const { bookmarks, deleteCollectionWithBookmarks } =
    useContext(LayoutContext);
  const { colorMode } = useColorMode();
  useEffect(() => {
    // filter bookmark by collection
    const filterBookmark = bookmarks.filter((bookmark) => {
      return bookmark.collection?.id === collection.id;
    });
    setBookmarks(filterBookmark);
  }, [collection, bookmarks]);
  function deleteCollection() {
    api.deleteCollection(collection.id).then((res) => {
      if (res && res.status === 200) {
        const newCollections = collections.filter(
          (item) => item.id !== collection.id
        );
        updateCollections(newCollections);
        onClose();
      }
    });
  }
  function renameCollection() {
    api.updateColectionName(collection.id, newCollectionName).then((res) => {
      if (res && res.status === 200) {
        const newCollections = collections.map((item) => {
          if (item.id === collection.id) {
            item.name = newCollectionName;
          }
          return item;
        });
        updateCollections(newCollections);
        onClose();
      }
    });
  }
  return (
    <VStack alignItems={"flex-start"} flex={1} w={"full"}>
      <HStack w={"full"}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {collection.name?.trim() === ""
            ? getTranslate("NO_NAME")
            : collection.name}
        </Text>
        <Spacer />
        {/* Edit Button */}
        <Button
          size={{
            base: "xs",
            md: "md",
          }}
          onClick={onOpen}
          leftIcon={<FaEdit />}
        >
          Edit
        </Button>
      </HStack>
      <Text>{_bookmarks?.length} question</Text>
      <Box w={"full"}>
        {_bookmarks?.map((bookmark, index) => (
          <BookmarkItem
            colorMode={colorMode}
            bookmarksLength={_bookmarks.length}
            bookmark={bookmark}
            router={router}
            index={index}
            collections={collections}
          />
        ))}
      </Box>
      <AlertDialog
        isOpen={isOpen}
        // @ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Edit List
            </AlertDialogHeader>

            <AlertDialogBody>
              <Input
                placeholder="New List name"
                onChange={(e) => {
                  setNewCollectionName(e.target.value);
                }}
                type="text"
                value={newCollectionName}
              />
            </AlertDialogBody>

            <AlertDialogFooter>
              {/*  @ts-ignore */}
              <Button variant={"ghost"} ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  renameCollection();
                }}
                ml={3}
              >
                Save
              </Button>
              <Spacer />
              <Button
                variant={"outline"}
                colorScheme="red"
                onClick={() => {
                  deleteCollection();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}

export default OtherTab;
