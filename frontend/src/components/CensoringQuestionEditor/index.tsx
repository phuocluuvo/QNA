import actionCreateCommentAnswer from "@/API/redux/actions/answer/actionCreateCommentAnswer";
import actionBlockQuestion from "@/API/redux/actions/question/ActionRejectQuestion";
import useStateWithCallback from "@/hooks/useStateWithCallback";
import AlertCensoreQuesiton from "@/pages/censoring/question/[id]/(TabQuestion)/(AlertCensoreQuesiton)";
import helper from "@/util/helper";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Button,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Formik,
  Form,
  Field,
  FormikHelpers,
  FormikProps,
  FormikValues,
} from "formik";
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
  onConfirmCallBack,
}: {
  questionId: string;
  getTranslate: (key: string) => string;
  getResult: (key: any) => any;
  onConfirmCallBack: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isVerifyItem, setIsVerifyItem] = useStateWithCallback<Boolean | null>(
    false
  );
  const cancelRef = React.useRef<State>();
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
  const formRef = React.useRef<FormikProps<FormikValues>>();
  const submitVerify = (
    values: FormikValues,
    actions: FormikHelpers<FormikValues>
  ) => {
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
          blockQuestion(questionId);
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
  function blockQuestion(questionId: string) {
    dispatch(
      // @ts-ignore
      actionBlockQuestion(
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
      // @ts-ignore
      innerRef={formRef}
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
              // type="submit"
              onClick={() => {
                onOpen();
              }}
              mt={"5"}
              background={colorMode === "light" ? "gray.100" : "gray.700"}
              border={"none"}
              isLoading={props.isSubmitting}
              isDisabled={!state.content}
            >
              {getTranslate("CONFIRM")}
            </Button>
          </HStack>
          <AlertCensoreQuesiton
            cancelRef={cancelRef}
            isOpen={isOpen}
            onClose={() => {
              onClose();
            }}
            type={"reject"}
            onClick={() => {
              formRef.current?.submitForm();
            }}
          />
        </Form>
      )}
    </Formik>
  );
}

export default CensoringQuestionEditor;
