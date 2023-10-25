import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
export default function SignIn() {
  const { colorMode } = useColorMode();
  const [show, setShow] = React.useState(false);
  const router = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  function validatePassword(value = "") {
    let error = "";
    const charLength = 8;
    if (value.length < charLength) {
      error = getTranslate("ERROR_PASSWORD_LENGTH").replace(
        "{0}",
        charLength.toString()
      );
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
  function LoginHandle(
    values: { username: string; password: string },
    actions: any
  ) {
    let form = {
      username: values.username,
      password: values.password,
    };
    setTimeout(async () => {
      let data = await signIn("credentials", {
        username: form.username,
        password: form.password,
        // redirect: false,
        callbackUrl: router.query.callbackUrl as string,
      });
      console.log("res: ", data);
      if (data?.error) {
        actions.setErrors({ username: data?.error });
      } else {
        router.push("/");
      }
      actions.setSubmitting(false);
    }, 1000);
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
          initialValues={{
            username: "vincent12",
            password: "Voluu113@",
          }}
          onSubmit={(values, actions) => {
            LoginHandle(values, actions);
          }}
        >
          {(props) => (
            <Form method="post" action="/api/auth/callback/credentials">
              <Field name="username">
                {/* @ts-ignore */}
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.username && form.touched.username}
                  >
                    {/* <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={csrfToken}
                    /> */}

                    <FormLabel>{getTranslate("USERNAME")}</FormLabel>
                    <Input
                      {...field}
                      required
                      i18nIsDynamicList={false}
                      // type="username"
                      placeholder={getTranslate("USERNAME_PLACEHOLDER")}
                    />
                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password" validate={validatePassword}>
                {/* @ts-ignore */}
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel>{getTranslate("PASSWORD")}</FormLabel>
                    <Box pos={"relative"}>
                      <Input
                        required
                        {...field}
                        type={show ? "text" : "password"}
                        placeholder={getTranslate("PASSWORD_PLACEHOLDER")}
                      />
                      <IconButton
                        aria-label="Show password"
                        style={{
                          position: "absolute",
                          right: "0px",
                          top: "0px",
                        }}
                        onClick={() => setShow(!show)}
                        icon={show ? <ViewIcon /> : <ViewOffIcon />}
                        variant="ghost"
                      />
                    </Box>
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
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const csrfToken = await getCsrfToken(context);
//   const { req } = context;
//   const session = await getSession({ req });
//   if (session) {
//     return {
//       redirect: { destination: "/" },
//     };
//   }

//   return { props: { csrfToken } };
// }
