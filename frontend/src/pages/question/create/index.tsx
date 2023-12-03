import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertDialogContent,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
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
  Stack,
  Tag,
  Text,
  Textarea,
  Tooltip,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { Field, Form, Formik, FormikHelpers } from "formik";
import helper, {
  createQuestionRules,
  writeAGoodQuestion,
  writeAGoodQuestionVie,
} from "@/util/helper";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import actionCreateQuestion from "@/API/redux/actions/question/ActionCreateQuestion";
import { useRouter } from "next/router";
import { TagType } from "@/util/type/Tag.type";
import actionSearchTags from "@/API/redux/actions/tags/ActionSearchTag";
import _ from "lodash";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { FormCreateQuestion } from "@/API/type/Form.type";
import actionCreateTag from "@/API/redux/actions/tags/ActionCreateTag";
import actionUpdateQuestion from "@/API/redux/actions/question/ActionUpdateQuesiton";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import TagQuestion from "@/components/TagQuestion";
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
type State = {
  title: string;
  bodyQuestion: string;
  resultsTagIds: Set<TagType>;
  searchTagId: string;
  selectedTags?: Set<TagType>;
  tagName?: string;
  tagContent?: string;
};
function CreateQuestion() {
  const [state, setState] = useStateWithCallback<State>({
    title: "",
    bodyQuestion: "",
    searchTagId: "",
    resultsTagIds: new Set(),
    selectedTags: new Set(),
    tagName: "",
    tagContent: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const route = useRouter();
  const { colorMode } = useColorMode();
  const dispacth = useDispatch();
  const handleChangeBodyQuestion = (value: string) => {
    // @ts-ignore
    setState((oldState) =>
      helper.mappingState(oldState, { bodyQuestion: value })
    );
  };
  const questionRules: string = createQuestionRules;
  const [focused, SetFocused] = useState({
    title: false,
    bodyQuestion: false,
  });
  const validateTags = (value?: Set<TagType>) => {
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
  const { getTranslate, getCurrentLanguage } = LanguageHelper(Pages.HOME);
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
          state.tagContent = "";
          state.tagName = "";
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
  function checkTagExist(tag: TagType) {
    let isExist = false;
    state.selectedTags?.forEach((item) => {
      if (item.name === tag.name) isExist = true;
    });
    return isExist;
  }
  return (
    <Stack
      m={0}
      w={"full"}
      minW={{ lg: "70%", base: "100%" }}
      gap={10}
      flexDirection={"column-reverse"}
    >
      <Formik
        initialValues={{
          title: state.title,
          bodyQuestion: state.bodyQuestion,
          resultsTagIds: [],
        }}
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
                      onFocus={() => {
                        SetFocused((oldState) =>
                          helper.mappingState(oldState, { title: true })
                        );
                      }}
                      onBlur={() => {
                        SetFocused((oldState) =>
                          helper.mappingState(oldState, { title: false })
                        );
                      }}
                      id="title"
                      placeholder={getTranslate("QUESTION_TITLE_PLACEHOLDER")}
                      type="text"
                      required
                    />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="resultsTagIds">
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={
                      form.errors.resultsTagIds && form.touched.resultsTagIds
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
                            <TagQuestion
                              type="minimals"
                              tag={tag}
                              key={tag.id}
                              onCancelClick={() => removeTagHandle(tag)}
                            />
                          ))
                        : null}
                      <Input
                        {...field}
                        variant={"unstyled"}
                        isDisabled={
                          state.selectedTags &&
                          state.selectedTags?.size > 1 &&
                          validateTags(state.selectedTags)
                        }
                        id="resultsTagIds"
                        placeholder={validateTags(state.selectedTags)?? "Search tag"}
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
                      >
                        <HStack flexWrap={"wrap"}>
                          {state.resultsTagIds &&
                          state.resultsTagIds.size > 0 ? (
                            Array.from(state.resultsTagIds).map((tag) => (
                              <TagQuestion
                                style={{
                                  ...(checkTagExist(tag) && {
                                    opacity: "0.5",
                                    cursor: "not-allowed",
                                  }),
                                }}
                                type="minimals"
                                tag={tag}
                                key={tag.id}
                                onClick={() => {
                                  !checkTagExist(tag) && addTagHandle(tag);
                                }}
                              />
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
                    </Collapse>
                    <FormErrorMessage>
                      {form.errors.resultsTagIds}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="bodyQuestion">
                {({ form }: any) => (
                  <FormControl
                    isInvalid={form.errors.body && form.touched.body}
                  >
                    <FormLabel>
                      {getTranslate("QUESTION_CONTENT")}*
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
                        about="This is a markdown editor that uses a preview panel to show the result of your markdown!"
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

                      <Box data-color-mode={colorMode}>
                        <EditerMarkdown
                          source={state.bodyQuestion}
                          style={{
                            backgroundColor:
                              colorMode === "light" ? "#fff" : "#1a202c",
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
                {getTranslate("CREATE")}
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
      {/* rules box */}
      <Box
        style={{
          width: "100%",
          border: "1px solid",
          borderColor: colorMode === "light" ? "gray.200" : "gray.700",
          borderRadius: "5px",
          padding: "10px",
          height: "fit-content",
          backgroundColor: colorMode === "light" ? "#fff" : "#1a202c",
        }}
      >
        <Accordion allowMultiple>
          <AccordionItem>
            <Text>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {getTranslate("HOW_TO_WRITE_A_QUESTION")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Text>
            <AccordionPanel pb={4}>
              <EditerMarkdown
                source={
                  getCurrentLanguage().code === "vi"
                    ? writeAGoodQuestionVie
                    : writeAGoodQuestion
                }
                style={{
                  backgroundColor: colorMode === "light" ? "#fff" : "#1a202c",
                  fontSize: "14px",
                  color: colorMode === "light" ? "#000" : "#fff",
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
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
    </Stack>
  );
}

export default CreateQuestion;
