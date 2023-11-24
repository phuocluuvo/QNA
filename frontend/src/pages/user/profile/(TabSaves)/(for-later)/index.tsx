import { Pages } from "@/assets/constant/Pages";
import BookmarkItem from "@/components/BookmarkItem";
import { LayoutContext } from "@/provider/LayoutProvider";
import { LanguageHelper } from "@/util/Language/Language.util";
import { BookmarkListType, BookmarkType } from "@/util/type/Bookmark.type";
import { CollectionType } from "@/util/type/Collection.type";
import { Box, Text, VStack, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";

function ForLaterTab({
  collections,
  collection,
}: {
  collections: Array<CollectionType>;
  collection: CollectionType | null;
}) {
  const router = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const dispacth = useDispatch();
  const [_bookmarks, setBookmarks] = React.useState<BookmarkType[]>([]);
  const { bookmarks } = useContext(LayoutContext);
  const { colorMode } = useColorMode();
  useEffect(() => {
    const filteredBookmarks = bookmarks.filter((bookmark) => {
      return bookmark.collection === null;
    });
    setBookmarks(filteredBookmarks);
  }, [collections, collection, bookmarks]);
  return (
    <VStack alignItems={"flex-start"} flex={1} w={"full"}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        {getTranslate("FOR_LATER")}
      </Text>
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
    </VStack>
  );
}

export default ForLaterTab;
