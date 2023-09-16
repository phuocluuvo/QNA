import React from "react";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Text,
  useColorMode,
} from "@chakra-ui/react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import dynamic from "next/dynamic";
import { Field, Form, Formik } from "formik";
import helper from "@/util/helper";
import useStateWithCallback from "@/hooks/useStateWithCallback";
function CreateQuestion() {
  const [state, setState] = useStateWithCallback({
    title: "",
    bodyQuestion: "",
  });
  const { colorMode } = useColorMode();

  const handleChangeBodyQuestion = (value: string) => {
    // @ts-ignore
    setState((oldState) =>
      helper.mappingState(oldState, { bodyQuestion: value })
    );
  };

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

  return (
    <Container my={0} minW={{ lg: "70%", base: "90%" }} maxH={"30vh"}>
      <Formik
        initialValues={{ title: "", bodyQuestion: "" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
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
                      Question Title
                      <Text fontSize="sm" color="gray.500">
                        Be specific and imagine you’re asking a question to
                        another person
                      </Text>
                    </FormLabel>

                    <Input
                      {...field}
                      id="title"
                      placeholder="title"
                      type="text"
                      required
                    />
                    <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="body">
                {({ field, form }: any) => (
                  <FormControl
                    isInvalid={form.errors.body && form.touched.body}
                  >
                    <FormLabel>Question Body</FormLabel>
                    <ReactQuill
                      id="body"
                      theme="snow"
                      value={state.bodyQuestion}
                      onChange={handleChangeBodyQuestion}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
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
                      placeholder={"Create Question"}
                      tabIndex={1}
                    />
                    <FormErrorMessage>{form.errors.body}</FormErrorMessage>
                    {/* <Box
                        className="product-des"
                        dangerouslySetInnerHTML={{
                          __html: state.bodyQuestion,
                        }}
                      ></Box> */}
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
                Submit
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default CreateQuestion;
