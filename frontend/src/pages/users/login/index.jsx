import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
function Login() {
  const { colorMode } = useColorMode();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  function validatePassword(value = "") {
    let error = [];
    const charLength = 8;
    if (value.length < charLength) {
      error = getTranslate("ERROR_PASSWORD_LENGTH").replace("{0}", charLength);
    }
    if (!value.match(/[a-z]/g)) {
      error = getTranslate("ERROR_PASSWORD_LOWERCASE");
    }
    if (!value.match(/[A-Z]/g)) {
      error = getTranslate("ERROR_PASSWORD_UPPERCASE");
    }
    if (!value.match(/[0-9]/g)) {
      error = getTranslate("ERROR_PASSWORD_NUMBER");
    }
    if (!value.match(/[^a-zA-Z\d]/g)) {
      error = getTranslate("ERROR_PASSWORD_SPECIAL");
    }
    return error;
  }
  return (
    <Container>
      <Box bg={"whiteAlpha.100"} p={10} rounded="md">
        <Heading>{getTranslate("LOGIN")}</Heading>
        <Text mb={2} mt={1}>
          Welcome to QuestionandAnswaredIt
        </Text>
        {/* Facebook  */}
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {(props) => (
            <Form>
              <Field name="email">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <FormLabel>{getTranslate("EMAIL")}</FormLabel>
                    <Input
                      {...field}
                      required
                      i18nIsDynamicList={false}
                      type="email"
                      placeholder={getTranslate("EMAIL_PLACEHOLDER")}
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" validate={validatePassword}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel>{getTranslate("PASSWORD")}</FormLabel>
                    <Input
                      required
                      {...field}
                      type="password"
                      placeholder={getTranslate("PASSWORD_PLACEHOLDER")}
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <HStack>
                <Button
                  type="submit"
                  mt={"5"}
                  background={colorMode === "light" ? "gray.100" : "gray.700"}
                  border={"none"}
                  isLoading={props.isSubmitting}
                >
                  {getTranslate("LOGIN")}
                </Button>
                {/* <Icon as={}/> */}
              </HStack>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default Login;
