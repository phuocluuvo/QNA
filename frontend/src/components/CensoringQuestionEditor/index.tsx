import actionCreateCommentAnswer from "@/API/redux/actions/answer/actionCreateCommentAnswer";
import actionVerifyQuesiton from "@/API/redux/actions/question/ActionVerifyQuestion";
import actionVerifyTag from "@/API/redux/actions/tags/ActionVerifyTag";
import helper from "@/util/helper";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Button,
  useColorMode,
  useMediaQuery,
  Input,
} from "@chakra-ui/react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { useDispatch } from "react-redux";
type State = {
  id: string;
  content: string;
};
function CensoringQuestionEditor({
  getTranslate,
  questionId,
  getResult,
}: {
  questionId: string;
  getTranslate: (key: string) => string;
  getResult: (key: any) => any;
}) {
  const sessions = useSession();
  const [state, setState] = useState({
    id: "123",
    content: "",
  });
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const handelChangVerify = (value: string) => {
    // @ts-ignore
    setState((oldState) => helper.mappingState(oldState, { content: value }));
  };
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isMouseIn, setIsMouseIn] = useState(false);
  const submitVerify = (values: State, actions: FormikHelpers<State>) => {
    let form = {
      question_id: questionId as string,
      content: state.content,
    };
    dispatch(
      // @ts-ignore
      actionCreateCommentAnswer(
        form,
        (res) => {
          console.log("comment created: ", res);
          getResult(res);
          verifyQuestion(questionId);
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, { content: "" })
          );
          actions.setSubmitting(false);
        },
        // @ts-ignore
        (err) => {
          console.log("err: ", err);
          actions.setSubmitting(false);
        }
      )
    );
  };
  function verifyQuestion(questionId: string) {
    dispatch(
      // @ts-ignore
      actionVerifyQuesiton(
        questionId,
        (res) => {
          console.log("question verified: ", res);
          getResult(res);
        },
        // @ts-ignore
        (err) => {
          console.log("err: ", err);
        }
      )
    );
  }
  return (
    <Formik
      initialValues={state}
      onSubmit={(values, actions) => {
        submitVerify(values, actions);
      }}
    >
      {(props) => (
        <Form>
          <Field name="content">
            {({ field, form }: any) => (
              <FormControl
                isInvalid={form.errors.content && form.touched.content}
              >
                <FormLabel>
                  <h3>Comment reason why you rejected the question</h3>
                </FormLabel>
                <ReactQuill
                  id="content"
                  theme="snow"
                  value={state.content}
                  onChange={handelChangVerify}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      ["link", "image", "code-block"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "link",
                    "image",
                    "video",
                    "code-block",
                    "header",
                    "color",
                    "background",
                    "clean",
                  ]}
                  bounds={".app"}
                  i18nIsDynamicList={false}
                  readOnly={!sessions.data?.user?.id}
                  placeholder={getTranslate("QUESTION_CONTENT")}
                  tabIndex={1}
                />
                {/* <Input {...field} id="content" placeholder="content" /> */}
                <FormErrorMessage>{form.errors.content}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <HStack justifyContent={"flex-end"} w={"full"} pb={5}>
            <Button
              type="submit"
              mt={"5"}
              background={colorMode === "light" ? "gray.100" : "gray.700"}
              border={"none"}
              isLoading={props.isSubmitting}
              isDisabled={!state.content}
            >
              {getTranslate("CONFIRM")}
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
}

export default CensoringQuestionEditor;
