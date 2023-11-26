import { BookmarkType } from "@/util/type/Bookmark.type";
import { CollectionType } from "@/util/type/Collection.type";
import React, { useMemo, useState } from "react";
import { QuestionType } from "@/util/type/Question.type";
const TemplateDafaultValue = {
  showLeftMenu: false,
  badgeNumber: 0,
  setShowLeftMenu: (showLeftMenu: boolean) => {},
  setBadgeNumber: (badgeNumber: number) => {},
  bookmarks: [] as BookmarkType[],
  updateBookmarks: (bookmarks: BookmarkType[]) => {},
  moveBookmarkToCollection: (
    fromCollection: CollectionType | null,
    toCollection: CollectionType | null,
    bookmark: BookmarkType
  ) => {},
  currentQuestion: {} as QuestionType,
  setQuestion: (question: QuestionType) => {},
  deleteCollectionWithBookmarks: (collectionId: string) => {},
  removeBookmark: (bookmark: BookmarkType) => {},
  addNewCollection: (collection: CollectionType) => {},
};

export const LayoutContext = React.createContext(TemplateDafaultValue);

export const useTemplateContextValue = (navigation: {
  navigate: (arg0: string) => void;
}) => {
  const [_showLeftMenu, _setShowLeftMenu] = useState(false);
  const [_badgeNumber, _setBadgeNumber] = useState(0);
  const [_bookmarks, _setBookmarks] = useState<BookmarkType[]>([]);
  const [_currentQuestion, _setQuestion] = useState<QuestionType>(
    {} as QuestionType
  );
  const setShowLeftMenu = (showLeftMenu: boolean) => {
    _setShowLeftMenu(showLeftMenu);
  };

  const setQuestion = (question: QuestionType) => {
    _setQuestion(question);
  };

  const setBadgeNumber = (badgeNumber: number) => {
    _setBadgeNumber(badgeNumber);
  };

  const updateBookmarks = (bookmarks: BookmarkType[]) => {
    _setBookmarks(bookmarks);
  };

  const deleteCollectionWithBookmarks = (collectionId: string) => {
    const newBookmarks = _bookmarks.map((bookmarkItem: BookmarkType) => {
      if (bookmarkItem.collection?.id === collectionId) {
        bookmarkItem.collection = null;
      }
      return bookmarkItem;
    });
    updateBookmarks(newBookmarks);
  };

  const removeBookmark = (bookmark: BookmarkType) => {
    const newBookmarks = _bookmarks.filter(
      (bookmarkItem: BookmarkType) => bookmarkItem.id !== bookmark.id
    );
    updateBookmarks(newBookmarks);
  };

  const addNewCollection = (collection: CollectionType) => {
    const newBookmarks = _bookmarks.map((bookmarkItem: BookmarkType) => {
      if (bookmarkItem.id === _currentQuestion.id) {
        bookmarkItem.collection = collection;
      }
      return bookmarkItem;
    });
    updateBookmarks(newBookmarks);
  };

  const moveBookmarkToCollection = (
    fromCollection: CollectionType | null,
    toCollection: CollectionType | null,
    currentBookmark: BookmarkType
  ) => {
    const newBookmarks = _bookmarks.map((bookmarkItem: BookmarkType) => {
      if (bookmarkItem.id === currentBookmark.id) {
        if (fromCollection == null || fromCollection?.id == null) {
          bookmarkItem.collection = toCollection;
          console.log("for-later to collection:" + toCollection, bookmarkItem);
        } else if (bookmarkItem.collection?.id === fromCollection.id) {
          bookmarkItem.collection = toCollection;
          console.log(
            "collection " + fromCollection + " to collection " + toCollection,
            bookmarkItem
          );
        }

        if (bookmarkItem.collection != null || bookmarkItem != null) {
          bookmarkItem.collection = toCollection;
          console.log("for-later to collection " + toCollection, bookmarkItem);
        }

        if (toCollection === null) {
          bookmarkItem.collection = null;
          console.log("for-later to collection " + toCollection, bookmarkItem);
        }
      }
      return bookmarkItem;
    });
    updateBookmarks(newBookmarks);
  };

  return useMemo(
    () => ({
      showLeftMenu: _showLeftMenu,
      setShowLeftMenu,
      badgeNumber: _badgeNumber,
      setBadgeNumber,
      bookmarks: _bookmarks,
      updateBookmarks,
      moveBookmarkToCollection: moveBookmarkToCollection,
      currentQuestion: _currentQuestion,
      setQuestion,
      deleteCollectionWithBookmarks,
      removeBookmark,
      addNewCollection,
    }),
    [_showLeftMenu, _badgeNumber, _bookmarks, _currentQuestion]
  );
};

const LayoutProvider = (props: any) => {
  const { children, navigation, params } = props;
  const transferContextData = useTemplateContextValue(navigation);
  return (
    <LayoutContext.Provider value={transferContextData}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;
