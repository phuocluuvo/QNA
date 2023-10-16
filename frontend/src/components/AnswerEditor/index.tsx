import helper from "@/util/helper";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import dynamic from "next/dynamic";
import React from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
type State = {
  content: string;
};
function AnswerEditor() {
  const [state, setState] = React.useState<State>({
    content: "",
  });
  const { colorMode } = useColorMode();

  const handleChangeAnswer = (value: string) => {
    // @ts-ignore
    setState((oldState) => helper.mappingState(oldState, { content: value }));
  };
  function submitAnswer(values: State, actions: FormikHelpers<State>) {
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
              <FormControl isInvalid={form.errors.body && form.touched.body}>
                <FormLabel>
                  <h3>Answer</h3>
                </FormLabel>
                <ReactQuill
                  id="content"
                  theme="snow"
                  value={state.content}
                  onChange={handleChangeAnswer}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
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
                    "list",
                    "bullet",
                    "indent",
                    "header",
                    "align",
                    "color",
                    "background",
                    "font",
                    "size",
                    "clean",
                  ]}
                  bounds={".app"}
                  placeholder={"Enter your Answer here"}
                  tabIndex={1}
                />
                <FormErrorMessage>{form.errors.body}</FormErrorMessage>
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
            >
              Submit
            </Button>
          </HStack>
        </Form>
      )}
    </Formik>
  );
}

export default AnswerEditor;
