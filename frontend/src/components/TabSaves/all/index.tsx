import { actionGetAllBookmarks } from "@/API/redux/actions/question/ActionBookmark";
import BookmarkItem from "@/components/BookmarkItem";
import { LayoutContext } from "@/provider/LayoutProvider";
import { BookmarkListType, BookmarkType } from "@/util/type/Bookmark.type";
import { CollectionType } from "@/util/type/Collection.type";
import { Box, Text, VStack, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
let isFirstTime = false;
function TabBookMarkAll({
  collections,
}: {
  collections: Array<CollectionType>;
}) {
  const router = useRouter();

  const dispacth = useDispatch();
  const [_bookmarks, setBookmarks] = React.useState<BookmarkType[] | null>(
    null
  );
  const { bookmarks, updateBookmarks } = useContext(LayoutContext);
  const { colorMode } = useColorMode();
  const fetchBookmarks = () => {
    isFirstTime = true;
    dispacth(
      actionGetAllBookmarks(
        (res) => {
          setBookmarks(res.data);
          updateBookmarks(res.data);
        },
        () => {}
      )
    );
    setBookmarks(bookmarks);
  };
  useEffect(() => {
    fetchBookmarks();
  }, [collections, router.query]);
  return (
    <VStack alignItems={"flex-start"} flex={1} w={"full"}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        All Saves
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

export default TabBookMarkAll;
