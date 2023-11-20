import { actionGetAllCollectionByID } from "@/API/redux/actions/question/ActionBookmark";
import { Pages } from "@/assets/constant/Pages";
import BookmarkItem from "@/components/BookmarkItem";
import { LanguageHelper } from "@/util/Language/Language.util";
import { BookmarkListType } from "@/util/type/Bookmark.type";
import { CollectionType } from "@/util/type/Collection.type";
import { Box, Text, VStack, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function OtherTab({
  collection,
  collections,
}: {
  collection: CollectionType;
  collections: Array<CollectionType>;
}) {
  const router = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const dispatch = useDispatch();
  const [bookmarks, setBookmarks] = React.useState<BookmarkListType | null>(
    null
  );
  const { colorMode } = useColorMode();
  useEffect(() => {
    if (router.query.tab === collection.name)
      dispatch(
        actionGetAllCollectionByID(
          collection.id,
          (res) => {
            setBookmarks(res);
          },
          () => {}
        )
      );
  }, [router.query]);
  return (
    <VStack alignItems={"flex-start"} flex={1} w={"full"}>
      <Text>{collection.name}</Text>
      <Text>{bookmarks?.data.length} question</Text>
      <Box w={"full"}>
        {bookmarks?.data.map((bookmark, index) => (
          <BookmarkItem
            colorMode={colorMode}
            bookmarksLength={bookmarks.data.length}
            bookmark={bookmark}
            router={router}
            index={index}
            collections={collections}
          />
        ))}
      </Box>
    </VStack>
  );
}

export default OtherTab;
