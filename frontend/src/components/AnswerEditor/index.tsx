import actionCreateAnswer from "@/API/redux/actions/answer/actionCreateAnswer";
import { FormCreateAnswer } from "@/API/type/Form.type";
import helper from "@/util/helper";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Text,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDispatch } from "react-redux";
import LinkButton from "../LinkButton";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
type State = {
  id: string;
  content: string;
};
const DEFAULT_STATE = { id: "123", content: "" };
function AnswerEditor({
  getTranslate,
  questionId,
  getResult,
}: {
  questionId: string | number;
  getTranslate: (key: string) => string;
  getResult: (key: any) => any;
}) {
  const sessions = useSession();
  const [state, setState] = useState(DEFAULT_STATE);
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const handleChangeAnswer = (value: string) => {
    // @ts-ignore
    setState((oldState) => helper.mappingState(oldState, { content: value }));
  };
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isMouseIn, setIsMouseIn] = useState(false);
  function submitAnswer(values: State, actions: FormikHelpers<State>) {
    let form: FormCreateAnswer = {
      question_id: questionId,
      content: state.content,
    };
    dispatch(
      actionCreateAnswer(
        form,
        (res) => {
          console.log("answer created: ", res);
          getResult(res);
          // @ts-ignore
          setState((oldState) =>
            helper.mappingState(oldState, { content: "" })
          );
          actions.setSubmitting(false);
        },
        () => {
          console.log("err create answer");
        }
      )
    );
    console.log("values: ", values);
    console.log("actions: ", actions);
  }
  return (
    <Formik
      initialValues={state}
      onSubmit={(values, actions) => {
        submitAnswer(values, actions);
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
                  <h3>{getTranslate("ANSWER")}</h3>
                </FormLabel>
                {sessions.data?.user?.id ? null : (
                  <Box
                    onMouseLeave={() => setIsMouseIn(false)}
                    onMouseEnter={() => setIsMouseIn(true)}
                    className={
                      "answer-editor-blocker " +
                      (!isMobile
                        ? isMouseIn
                          ? "fade-in"
                          : "fade-out"
                        : "fade-in")
                    }
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      fontSize: "12px",
                      width: "100%",
                      height: "75%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <LinkButton
                      style={{ paddingX: 0 }}
                      href="/auth/signin"
                      onClick={signIn}
                      text={getTranslate("LOGIN")}
                    />
                    <Text>{getTranslate("LOGIN_TO_ANSWER")}</Text>
                  </Box>
                )}
                <Box data-color-mode={colorMode}>
                  <MDEditor
                    style={{
                      height: "auto",
                      minHeight: "300px",
                      maxHeight: "500px",
                      background: colorMode === "light" ? "#fff" : "#1a202c",
                    }}
                    preview={"edit"}
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
              isDisabled={!sessions.data?.user?.id}
            >
              {getTranslate("ANSWER")}
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
}

export default AnswerEditor;
