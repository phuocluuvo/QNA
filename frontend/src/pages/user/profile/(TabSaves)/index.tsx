import { Colors } from "@/assets/constant/Colors";
import { UserType } from "@/util/type/User.type";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  styled,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import TabBookMarkAll from "./(all)";
import { AddIcon } from "@chakra-ui/icons";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import ForLaterTab from "./(for-later)";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  actionCreateCollection,
  actionGetAllCollection,
} from "@/API/redux/actions/question/ActionBookmark";
import { CollectionType } from "@/util/type/Collection.type";
import helper from "@/util/helper";
import OtherTab from "./(other)";
import _ from "lodash";

function SavesQuestion({ user }: { user: UserType }) {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const router = useRouter();
  const [state, setState] = useState<{
    collectionName: string; // for creating new collection
    collection: Array<CollectionType>;
  }>({
    collectionName: "",
    collection: [],
  });
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionType | null>(null);
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const dispacth = useDispatch();
  useEffect(() => {
    dispacth(
      // @ts-ignore
      actionGetAllCollection(
        (res) => {
          // @ts-ignore
          setState((oldState) =>
            // @ts-ignore
            helper.mappingState(oldState, {
              collection: res,
            })
          );
        },
        () => {}
      )
    );
  }, []);
  function createCollectionHandle() {
    dispacth(
      actionCreateCollection(
        state?.collectionName as string,
        (res) => {
          let newCollection = state?.collection ? [...state?.collection] : [];
          newCollection.push(res);
          // @ts-ignore
          setState((oldState) =>
            // @ts-ignore
            helper.mappingState(oldState, {
              collection: newCollection,
            })
          );
        },
        () => {}
      )
    );
  }
  return (
    <Box
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <Tabs
        position="relative"
        variant="enclosed-colored"
        w={"full"}
        display={{ base: "unset", md: "flex" }}
      >
        <TabList
          display={{ sm: "none", md: "flex" }}
          flexDir={{ base: "row", md: "column" }}
          borderBottom={{
            base: "1px solid",
            md: "none",
          }}
        >
          <TabCustom
            _selected={{
              color: "white",
              backgroundColor: Colors(colorMode === "dark").PRIMARY,
            }}
            onClick={() => {
              setSelectedCollection(null);
              //   router.push(
              //     {
              //       pathname: `/user/profile`,
              //       query: {
              //         tab: "saves",
              //       },
              //     },
              //     undefined,
              //     { shallow: true }
              //   );
            }}
          >
            {getTranslate("ALL")}
          </TabCustom>
          <TabCustom
            _selected={{
              color: "white",
              backgroundColor: Colors(colorMode === "dark").PRIMARY,
            }}
            onClick={() => {
              setSelectedCollection(null);
              //   router.push(
              //     {
              //       pathname: `/user/profile`,
              //       query: {
              //         tab: "for-later",
              //       },
              //     },
              //     undefined,
              //     { shallow: true }
              //   );
            }}
          >
            {getTranslate("FOR_LATER")}
          </TabCustom>

          <Box
            w={"full"}
            display={"flex"}
            style={{
              justifyContent: "space-between",
              paddingBlock: "10px",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: Colors(colorMode === "dark").PRIMARY,
              }}
            >
              {getTranslate("COLLECTIONS")}
            </Text>
            <IconButton
              onClick={onOpen}
              size={"xs"}
              aria-label="Search database"
              icon={<AddIcon />}
            />
          </Box>
          {state?.collection?.map((collection) => (
            <TabCustom
              key={collection.id}
              _selected={{
                color: "white",
                backgroundColor: Colors(colorMode === "dark").PRIMARY,
              }}
              onClick={() => {
                setSelectedCollection(collection);
              }}
            >
              <Text textAlign={"left"} noOfLines={1}>
                {collection?.name?.trim() === ""
                  ? getTranslate("NO_NAME")
                  : collection?.name}
              </Text>
            </TabCustom>
          ))}
        </TabList>
        <TabPanels flex={1} display={"flex"} w={"full"}>
          <TabPanel
            padding={{
              base: "0px",
              md: "10px",
            }}
            w={"full"}
          >
            <TabBookMarkAll collections={state?.collection ?? []} />
          </TabPanel>
          <TabPanel
            padding={{
              base: "0px",
              md: "10px",
            }}
            w={"full"}
            onClick={() => {
              setSelectedCollection(null);
            }}
          >
            <ForLaterTab
              collections={state?.collection ?? []}
              collection={selectedCollection ?? null}
            />
          </TabPanel>
          {state?.collection?.map((collection) => (
            <TabPanel
              key={collection.id}
              padding={{
                base: "0px",
                md: "10px",
              }}
              w={"full"}
              onClick={() => {
                setSelectedCollection(collection);
              }}
            >
              <OtherTab
                collections={state.collection}
                collection={selectedCollection ?? collection}
                updateCollections={(collections) => {
                  setState((oldState) =>
                    helper.mappingState(oldState, {
                      collection: collections,
                    })
                  );
                }}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <AlertDialog
        motionPreset="slideInTop"
        // @ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>New Collection</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Input
              placeholder="Enter collection name"
              value={state?.collectionName}
              onChange={(e) => {
                // @ts-ignore

                setState((oldState) =>
                  // @ts-ignore
                  helper.mappingState(oldState, {
                    collectionName: e.target.value,
                  })
                );
              }}
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            {/* @ts-ignore */}
            <Button ref={cancelRef} onClick={onClose}>
              {getTranslate("CANCEL")}
            </Button>
            <Button
              colorScheme="green"
              isDisabled={state?.collectionName === ""}
              onClick={() => {
                if (!_.isEmpty(state?.collectionName.trim())) {
                  createCollectionHandle();
                  onClose();
                } else {
                  alert("Collection name is empty");
                }
              }}
              ml={3}
            >
              {getTranslate("CREATE")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
const TabCustom = styled(Tab, {
  baseStyle: {
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    justifyContent: "start",
    width: 44,
    backgroundColor: "transparent",
  },
});
export default SavesQuestion;
