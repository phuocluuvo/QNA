import api from "@/API/api";
import { requesting } from "../../reducers/GlobalSlice";
import { responseHandler } from "../ResponseHandler";

export function actionGetAllBookmarks(
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getAllBookmarks().then((res: any) => {
      console.log("getAllBookmarks:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}

export function actionGetBookmarkFromLater(
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getBookmarksFromCollections("later").then((res: any) => {
      console.log("getBookmarksFromCollections:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}

export function actionGetAllCollectionByID(
  collectionId: string,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getBookmarksFromCollections(collectionId).then((res: any) => {
      console.log("actionGetAllCollectionByID:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}

export function actionGetAllCollection(
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.getAllCollections().then((res: any) => {
      console.log("getAllCollections:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}

export function actionCreateCollection(
  collectionName: string,
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api.createCollection(collectionName).then((res: any) => {
      console.log("createCollection:", res);
      dispatch(requesting());
      dispatch(
        responseHandler(res, callbackSuccess, callbackError, false, null, null)
      );
    });
  };
}

export function actionAddBookmarkToCollection(
  form: {
    collectionId: string;
    bookmarkId: string;
  },
  callbackSuccess: (res: any) => void,
  callbackError: () => void
): any {
  return (dispatch: any) => {
    dispatch(requesting());
    api
      .addBookmarkToCollection(form.collectionId, form.bookmarkId)
      .then((res: any) => {
        console.log("addBookmarkToCollection:", res);
        dispatch(requesting());
        dispatch(
          responseHandler(
            res,
            callbackSuccess,
            callbackError,
            false,
            null,
            null
          )
        );
      });
  };
}
