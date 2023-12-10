import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import dynamic from "next/dynamic";
import { Field, Form, Formik } from "formik";
import helper, { removeVietnameseTones } from "@/util/helper";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import { useDispatch } from "react-redux";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useRouter } from "next/router";
import { TagType } from "@/util/type/Tag.type";
import actionSearchTags from "@/API/redux/actions/tags/ActionSearchTag";
import _ from "lodash";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import actionGetQuestion from "@/API/redux/actions/question/ActionGetQuestion";
import { useSession } from "next-auth/react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import actionGetAnswer, {
  actionGetAnswerById,
} from "@/API/redux/actions/answer/actionGetAnswer";
import { AnswerType } from "@/util/type/Answer.type";
import { Colors } from "@/assets/constant/Colors";
import TitleHeader from "@/components/Title";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { actionUpdateAnswer } from "@/API/redux/actions/answer/actionCreateAnswer";
import api from "@/API/api";
type State = {
  content: string;
  answer: AnswerType | null;
  type?: "question" | "answer";
};
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
function EditQuestion() {
  const formRef = useRef(null);
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useStateWithCallback<State>({
    content: "",
    answer: null,
  });
  const route = useRouter();
  const { colorMode } = useColorMode();
  const dispacth = useDispatch();
  const toast = useToast();
  const { getTranslate } = LanguageHelper(Pages.HOME);

  React.useEffect(() => {
    if (route.query.id) {
      dispacth<any>(
        actionGetAnswerById(
          route.query.id as string,
          // @ts-ignore
          (res: AnswerType) => {
            console.log("actionGetQuestion", res);
            setState(
              // @ts-ignore
              (oldState) =>
                helper.mappingState(oldState, {
                  content: res.content,
                  answer: res,
                })
            );
          },
          () => {}
        )
      );
    }
  }, [route.query]);
  function updateAnswerHandle(values: any, actions: any) {
    api
      .updateAnswer(
        route.query.id as string, // @ts-ignore
        {
          content: values.content,
        }
      )
      .then((res) => {
        actions.setSubmitting(false);
        console.log("updateAnswerHandle", res);
        route.push(
          `/question/${state.answer?.question.id}/${removeVietnameseTones(
            // @ts-ignore
            state.answer?.question?.title
          )}#${res?.data.id}`
        );
        toast({
          title: getTranslate("UPDATE_ANSWER_SUCCESS"),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        actions.setSubmitting(false);
        toast({
          title: getTranslate("UPDATE_ANSWER_FAIL"),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        console.log("updateAnswerHandle", err);
      });
  }

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <Container my={0} minW={{ lg: "100%", base: "90%" }} maxH={"40vh"}>
      <VStack
        w={"full"}
        justifyItems={"flex-start"}
        alignItems={"start"}
        pb={5}
      >
        <TitleHeader title={getTranslate("FIX_ANSWER_TITLE")} />
        <Button
          variant={"link"}
          leftIcon={<ArrowBackIcon />}
          onClick={() =>
            route.push(
              `/question/${state.answer?.question.id}/${removeVietnameseTones(
                // @ts-ignore
                state.answer?.question?.title
              )}`
            )
          }
        >
          {state.answer?.question?.title}
        </Button>
      </VStack>
      <Formik
        innerRef={formRef}
        initialValues={{
          content: state.content,
        }}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          updateAnswerHandle(values, actions);
        }}
      >
        {(props) => (
          <Form>
            <Text>
              {getTranslate("CREATED_AT")}:{" "}
              {helper.formatDate(
                // @ts-ignore
                state.answer?.createdAt,
                false,
                "HH:mm:ss - DD/MM/YYYY"
              )}
            </Text>
            <InputGroup flexDir={"column"}>
              <Field name="content">
                {({ form }: any) => (
                  <FormControl
                    isInvalid={form.errors.body && form.touched.body}
                  >
                    <FormLabel>
                      {getTranslate("ANSWER_CONTENT")}
                      <Text fontSize="sm" color="gray.500">
                        {getTranslate("ANSWER_CONTENT_DESCRIPTION")}
                      </Text>
                    </FormLabel>
                    <Box
                      data-color-mode={colorMode}
                      background={colorMode === "light" ? "#fff" : "#000"}
                    >
                      <MDEditor
                        style={{
                          height: "auto",
                          minHeight: "50vh",
                          maxHeight: "50vh",
                        }}
                        preview={"live"}
                        value={state.content}
                        onChange={(value) => {
                          // @ts-ignore
                          setState((oldState) =>
                            helper.mappingState(oldState, {
                              content: value,
                            })
                          );
                        }}
                      />
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
    </Container>
  );
}

export default EditQuestion;
