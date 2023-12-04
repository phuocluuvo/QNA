import React, { useEffect, useRef } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import dynamic from "next/dynamic";
import { Field, Form, Formik, FormikHelpers } from "formik";
import helper from "@/util/helper";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import actionCreateQuestion from "@/API/redux/actions/question/ActionCreateQuestion";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useRouter } from "next/router";
import { TagType } from "@/util/type/Tag.type";
import actionSearchTags from "@/API/redux/actions/tags/ActionSearchTag";
import _ from "lodash";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { FormCreateQuestion } from "@/API/type/Form.type";
import actionCreateTag from "@/API/redux/actions/tags/ActionCreateTag";
import actionGetQuestion from "@/API/redux/actions/question/ActionGetQuestion";
import actionUpdateQuestion from "@/API/redux/actions/question/ActionUpdateQuesiton";
import { useSession } from "next-auth/react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
type State = {
  title: string;
  bodyQuestion: string;
  selectedTags: Set<TagType>;
  searchTagId: string;
  resultsTagIds?: Set<TagType>;
  tagName?: string;
  tagContent?: string;
  type?: "question" | "answer";
};
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function EditQuestion() {
  const formRef = useRef(null);
  const [state, setState] = useStateWithCallback<State>({
    title: "",
    bodyQuestion: "",
    searchTagId: "",
    selectedTags: new Set(),
    resultsTagIds: new Set(),
    tagName: "",
    tagContent: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const route = useRouter();
  const axiosAuth = useAxiosAuth();
  const session = useSession();
  const { colorMode } = useColorMode();
  const dispacth = useDispatch();
  const handleChangeBodyQuestion = (value: string) => {
    // @ts-ignore
    setState((oldState) =>
      helper.mappingState(oldState, { bodyQuestion: value })
    );
  };

  const { getTranslate } = LanguageHelper(Pages.HOME);
  const validateTitle = (value: string) => {
    let error;
    if (!value) {
      error = "Title is required";
    } else if (value.length < 20) {
      error = "Title must be more than 20 characters";
    } else if (value.length > 150) {
      error = "Title must be less than 150 characters";
    }
    return error;
  };
  const validateTags = (value: Set<any>) => {
    let error = undefined;
    if (!value) {
      error = "Tags is required";
    } else if (value.size < 1) {
      error = "Tags is required";
    } else if (value.size >= 5) {
      error = "Tags reach the number of tag can added";
    }
    return error;
  };
  React.useEffect(() => {
    if (route.query.questionId) {
      dispacth(
        actionGetQuestion(
          { id: route.query.questionId as string },
          (res) => {
            console.log("actionGetQuestion", res);
            setState(
              // @ts-ignore
              (oldState) =>
                helper.mappingState(oldState, {
                  selectedTags: new Set(res.tags),
                  title: res.title,
                  bodyQuestion: res.content,
                }),
              ({ selectedTags }) => console.log("selectedTags", selectedTags)
            );
          },
          () => {}
        )
      );
    }
  }, [route.query]);
  const searchTag = (value: string) => {
    if (value) {
      dispacth(
        actionSearchTags(
          value,
          (res: { data: TagType[] }) => {
            setState(
              // @ts-ignore
              (oldState) =>
                helper.mappingState(oldState, {
                  resultsTagIds: new Set(res.data),
                }),
              ({ resultsTagIds }) => console.log("resultsTagIds", resultsTagIds)
            );
          },
          () => {}
        )
      );
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchTag(state.searchTagId);
      if (state.searchTagId === "")
        setState(
          // @ts-ignore
          (oldState) =>
            helper.mappingState(oldState, {
              resultsTagIds: new Set(),
            })
        );
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [state.searchTagId]);
  const addTagHandle = (tag: TagType) => {
    setState(
      // @ts-ignore
      (oldState) =>
        helper.mappingState(oldState, {
          selectedTags: oldState.selectedTags?.add(tag),
          searchTagId: "",
        }),
      ({ selectedTags }) => console.log("selectedTags", selectedTags)
    );
  };
  const removeTagHandle = (tag: TagType) => {
    setState(
      // @ts-ignore
      (oldState) =>
        helper.mappingState(oldState, {
          selectedTags: new Set(
            // @ts-ignore
            Array.from(oldState.selectedTags).filter(
              (item) => item.id !== tag.id
            )
          ),
        }),
      ({ selectedTags }) => console.log("selectedTags", selectedTags)
    );
  };
  function checkTagExist(tag: TagType) {
    let isExist = false;
    state.selectedTags?.forEach((item) => {
      if (item.name === tag.name) isExist = true;
    });
    return isExist;
  }
  const searchTagHandle = (value: string) => {
    // @ts-ignore
    setState((oldState) =>
      helper.mappingState(oldState, { searchTagId: value })
    );
  };
  const createTagHandle = () => {
    let form = {
      name: state.tagName ?? "unknown",
      content: state.tagContent ?? "no-content",
    };
    dispacth(
      actionCreateTag(
        form,
        (res) => {
          console.log("createTagHandle", res);
          addTagHandle(res);
          onClose();
        },
        () => {
          onClose();
        }
      )
    );
  };
  const createQuestionHandle = (
    values: State,
    actions: FormikHelpers<State>
  ) => {
    let selectedTags = new Array<string>();

    state.selectedTags?.forEach((tag) => {
      selectedTags.push(tag.id as string);
    });

    let form: FormCreateQuestion = {
      title: values.title,
      content: state.bodyQuestion,
      tag_ids: selectedTags,
    };
    setTimeout(async () => {
      console.log("form", form);
      if (route.query.questionId)
        dispacth(
          actionUpdateQuestion(
            form,
            route.query.questionId as string,
            (res) => {
              console.log("action updateQuestion: ", res);
              route.replace(`/question/${res.id}`);
            },
            () => {}
          )
        );
      else
        dispacth(
          actionCreateQuestion(
            form,
            (res) => {
              console.log("actionCreateQuestion: ", res);
              route.push(`/question/${res.id}`);
            },
            () => {}
          )
        );

      actions.setSubmitting(false);
    }, 1000);
  };
  return (
    <Container my={0} minW={{ lg: "70%", base: "90%" }} maxH={"30vh"}>
      <Formik
        innerRef={formRef}
        initialValues={{
          title: state.title,
          bodyQuestion: state.bodyQuestion,
          selectedTags: state.selectedTags,
        }}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          // @ts-ignore
          createQuestionHandle(values, actions);
        }}
      >
        {(props) => (
          <Form>
            <InputGroup flexDir={"column"}>
              <Field name="title" validate={validateTitle}>
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.title && form.touched.title}
                  >
                    <FormLabel>
                      {getTranslate("QUESTION_TITLE")}
                      <Text fontSize="sm" color="gray.500">
                        {getTranslate("QUESTION_TITLE_DESCRIPTION")}
                      </Text>
                    </FormLabel>
                    <Input
                      {...field}
                      id="title"
                      placeholder={getTranslate("QUESTION_TITLE_PLACEHOLDER")}
                      type="text"
                      required
                    />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="selectedTags">
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={
                      form.errors.selectedTags && form.touched.selectedTags
                    }
                  >
                    <FormLabel>
                      {getTranslate("QUESTION_TAG")}*
                      <Text fontSize="sm" color="gray.500">
                        {getTranslate("QUESTION_TAG_DESCRIPTION")}
                      </Text>
                    </FormLabel>
                    <HStack
                      style={{
                        border: "2px solid",
                        borderColor:
                          state.selectedTags && state.selectedTags.size > 0
                            ? "lightgray"
                            : "tomato",
                        borderRadius: "7px",
                        padding: "6px 15px",
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      {state.selectedTags && state.selectedTags.size > 0
                        ? Array.from(state.selectedTags).map((tag) => (
                            <Tag
                              size={"md"}
                              variant="solid"
                              colorScheme="orange"
                              cursor={"pointer"}
                              display={"flex"}
                              minW={"fit-content"}
                            >
                              <Text
                                minW={"fit-content"}
                                fontSize={"xs"}
                                flex={"1"}
                                noOfLines={1}
                              >
                                {tag?.name}
                              </Text>
                              <IconButton
                                variant={"ghost"}
                                colorScheme="orange"
                                _hover={{
                                  bg: "transparent",
                                  color: "whiteAlpha.700",
                                }}
                                aria-label="delete"
                                size="xs"
                                onClick={() => {
                                  removeTagHandle(tag);
                                }}
                                icon={<CloseIcon />}
                              />
                            </Tag>
                          ))
                        : null}
                      <Input
                        {...field}
                        variant={"unstyled"}
                        id="selectedTags"
                        placeholder={validateTags(state.selectedTags)}
                        isDisabled={
                          state.selectedTags &&
                          state.selectedTags?.size > 1 &&
                          validateTags(state.selectedTags)
                        }
                        type="text"
                        value={state.searchTagId}
                        onChange={(e) => {
                          searchTagHandle(e.target.value);
                        }}
                      />
                    </HStack>
                    {/* resutl search */}
                    <Collapse in={state.searchTagId.length > 0} animateOpacity>
                      <Box
                        overflowY={"auto"}
                        overflowX={"hidden"}
                        mt={"2"}
                        maxHeight={450}
                        w={"full"}
                        border={"1px solid"}
                        borderColor={
                          colorMode === "light" ? "gray.200" : "gray.700"
                        }
                        borderRadius={"5px"}
                        p={"2"}
                        display={"flex"}
                        flexWrap={"wrap"}
                        gap={"2"}
                      >
                        <HStack flexWrap={"wrap"}>
                          {state.resultsTagIds &&
                          state.resultsTagIds.size > 0 ? (
                            Array.from(state.resultsTagIds).map((tag) => (
                              <Tooltip
                                key={tag.id}
                                label={
                                  tag.content ||
                                  "No content yet. Need update later"
                                }
                                hasArrow
                                arrowPadding={5}
                              >
                                <Tag
                                  size={"md"}
                                  variant="solid"
                                  colorScheme="orange"
                                  cursor={"pointer"}
                                  onClick={() => {
                                    !checkTagExist(tag) && addTagHandle(tag);
                                  }}
                                  style={{
                                    ...(checkTagExist(tag) && {
                                      opacity: "0.5",
                                      cursor: "not-allowed",
                                    }),
                                  }}
                                >
                                  {typeof tag !== "string" ? tag.name : tag}{" "}
                                  {typeof tag !== "string" &&
                                  tag.state === "verified" ? (
                                    <Tooltip
                                      label={"This tag was verified"}
                                      aria-label={"Verified"}
                                    >
                                      <CheckIcon color={"green"} ml={2} />
                                    </Tooltip>
                                  ) : null}
                                </Tag>
                              </Tooltip>
                            ))
                          ) : (
                            <></>
                          )}
                        </HStack>
                        <Text fontSize={"sm"} color={"gray.500"}>
                          {getTranslate("CANNOT_FIND_TAG").replace(
                            "{tagname}",
                            state.searchTagId
                          )}
                          <Button
                            variant={"link"}
                            colorScheme={"orange"}
                            onClick={() => {
                              setState(
                                // @ts-ignore
                                (oldState) =>
                                  helper.mappingState(oldState, {
                                    tagName: state.searchTagId,
                                  }),
                                () => onOpen()
                              );
                            }}
                          >
                            {getTranslate("CREATE_NEW_TAG")}
                          </Button>
                        </Text>
                      </Box>
                    </Collapse>
                    {/* Error */}
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "tomato",
                        marginTop: "5px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                      opacity={validateTags(state.selectedTags) ? 1 : 0}
                      transition={"all 0.2s ease-in-out"}
                    >
                      {validateTags(state.selectedTags)}
                    </Text>
                  </FormControl>
                )}
              </Field>
              <Field name="bodyQuestion">
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.body && form.touched.body}
                  >
                    <FormLabel>
                      {getTranslate("QUESTION_CONTENT")}
                      <Text fontSize="sm" color="gray.500">
                        {getTranslate("QUESTION_CONTENT_DESCRIPTION")}
                      </Text>
                    </FormLabel>
                    <Box data-color-mode={colorMode}>
                      <MDEditor
                        style={{
                          height: "auto",
                          minHeight: "300px",
                          maxHeight: "500px",
                        }}
                        preview={"edit"}
                        value={state.bodyQuestion}
                        onChange={(value) => {
                          // @ts-ignore
                          setState((oldState) =>
                            helper.mappingState(oldState, {
                              bodyQuestion: value,
                            })
                          );
                        }}
                      />

                      <Divider
                        my={{
                          base: "10px",
                          md: "20px",
                        }}
                      />
                      <Box data-color-mode={colorMode}>
                        <EditerMarkdown
                          source={state.bodyQuestion}
                          style={{
                            backgroundColor: "transparent",
                          }}
                        />
                      </Box>
                    </Box>
                    <FormErrorMessage>{form.errors.body}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </InputGroup>
            <HStack justifyContent={"flex-end"} w={"full"}>
              <Button
                type="submit"
                mt={"5"}
                background={colorMode === "light" ? "gray.100" : "gray.700"}
                border={"none"}
                isLoading={props.isSubmitting}
              >
                {getTranslate("UPDATE")}
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getTranslate("CREATE_TAG_TITLE")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="info" mb={3}>
              <AlertIcon />
              <AlertDescription mr={2}>
                {getTranslate("CREATE_TAG_DESCRIPTION")}
              </AlertDescription>
            </Alert>
            <VStack>
              <Input
                id="name-tag"
                placeholder={getTranslate("TAG_NAME_PLACEHOLDER")}
                type="text"
                value={state.tagName}
                onChange={(e) => {
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, { tagName: e.target.value })
                  );
                }}
                required
              />
              <Textarea
                id="content-tag"
                placeholder={getTranslate("TAG_CONTENT_PLACEHOLDER")}
                value={state.tagContent}
                onChange={(e) => {
                  // @ts-ignore
                  setState((oldState) =>
                    helper.mappingState(oldState, {
                      tagContent: e.target.value,
                    })
                  );
                }}
                required
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant={"ghost"} mr={3} onClick={onClose}>
              {getTranslate("CLOSE")}
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => {
                createTagHandle();
              }}
            >
              {getTranslate("CREATE")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default EditQuestion;
