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
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React from "react";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import LoginButton from "@/components/LoginButton";
import { useDispatch } from "react-redux";
import { ActionGetBadgeNotification } from "@/API/redux/actions/user/ActionGetNotificationBadge";
import { LayoutContext } from "@/provider/LayoutProvider";
export default function SignIn() {
  const { colorMode } = useColorMode();
  const [show, setShow] = React.useState(false);
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { setBadgeNumber } = React.useContext(LayoutContext);
  const usernameRef = React.useRef<HTMLInputElement>(null);
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
      await signIn("credentials", {
        username: form.username,
        password: form.password,
        redirect: false,
        callbackUrl: router.query.callbackUrl as string,
      }).then((response) => {
        if (response && response.ok) {
          dispatch(
            // @ts-ignore
            ActionGetBadgeNotification(
              (res) => {
                console.log(res);
                setBadgeNumber(res);
              },
              () => {}
            )
          );
          if (router.query.callbackUrl) {
            router.push(router.query.callbackUrl as string);
          } else {
            router.push("/");
          }
        } else {
          toast({ title: getTranslate("LOGIN_ERROR"), status: "error" });
          actions.setErrors({ username: getTranslate("LOGIN_ERROR") });
          usernameRef.current?.focus();
        }
      });
      actions.setSubmitting(false);
    }, 1000);
  }
  function LoginGithubHandle(type: "github" | "google") {
    signIn(type).then((response) => {
      if (response && response.ok) {
        if (router.query.callbackUrl) {
          router.push(router.query.callbackUrl as string);
        } else {
          router.push("/");
        }
      } else {
        toast({ title: getTranslate("LOGIN_ERROR"), status: "error" });
      }
    });
  }
  return (
    <Container>
      <Box bg={"whiteAlpha.100"} p={10} rounded="md">
        <VStack spacing={2}>
          <Heading>{getTranslate("LOGIN")}</Heading>
          <Text mb={2} mt={1}>
            Welcome to QuestionandAnswaredIt
          </Text>
          {/* Github */}
          <LoginButton
            type="github"
            getTranslate={getTranslate}
            style={{
              border: "none",
              size: "lg",
              colorScheme: "gray",
            }}
            onLogin={() => LoginGithubHandle("github")}
          />
          {/* Google */}
          <LoginButton
            style={{
              border: "none",
              size: "lg",
              colorScheme: "orange",
            }}
            type="google"
            getTranslate={getTranslate}
            onLogin={() => LoginGithubHandle("google")}
          />
          <Box mt={5} mb={5} w={"100%"} h={"1px"} bg={"gray.300"}></Box>
          {/* Facebook  */}
          <Formik
            initialValues={{
              username: "trong123123",
              password: "Kocomk123@",
            }}
            onSubmit={(values, actions) => {
              LoginHandle(values, actions);
            }}
          >
            {(props) => (
              <Form
                method="post"
                action="/api/auth/callback/credentials"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
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
                        ref={usernameRef}
                        {...field}
                        required
                        i18nIsDynamicList={false}
                        // type="username"
                        placeholder={getTranslate("USERNAME_PLACEHOLDER")}
                      />
                      <FormErrorMessage>
                        {form.errors.username}
                      </FormErrorMessage>
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
                      <FormErrorMessage>
                        {form.errors.password}
                      </FormErrorMessage>
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
        </VStack>
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
