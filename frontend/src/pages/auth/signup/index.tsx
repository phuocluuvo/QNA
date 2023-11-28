import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import actionSignUp from "@/API/redux/actions/user/ActionSignUp";
import { FormSignUp } from "@/API/type/Form.type";
import LinkButton from "@/components/LinkButton";
import { Colors } from "@/assets/constant/Colors";
import { signIn } from "next-auth/react";
function Login() {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const [password, setPassword] = React.useState("");
  const [repassword, setRepassword] = React.useState("");
  function validatePassword(value = "", isRepeatPassword = false) {
    let error = "";
    const charLength = 8;
    if (value.length < charLength) {
      // @ts-ignore
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
    if (isRepeatPassword) {
      setRepassword(value);
      if (value !== password) {
        error = getTranslate("ERROR_PASSWORD_MATCH");
      }
    } else {
      setPassword(value);
    }
    return error;
  }
  function SignUpHandle(values: FormSignUp, actions: any) {
    let form: FormSignUp = {
      email: values.email,
      password: values.password,
      username: values.username,
      fullname: values.fullname,
    };
    setTimeout(() => {
      dispatch(
        actionSignUp(
          // @ts-ignore
          { ...form, role: "admin" },
          (res: { data: any }) => {
            // save to local storage
            // localStorage.setItem("userLogin", JSON.stringify(res.data));
            signIn();
          },
          () => {
            console.log("Error");
          }
        )
      );
      actions.setSubmitting(false);
    }, 1000);
  }
  return (
    <Container minW={"90%"} pb={"5vh"}>
      <HStack transition={"all 0.2s ease-in-out"} justifyContent={"center"}>
        <Text maxW={"30%"} display={{ base: "none", md: "block" }}>
          {getTranslate("INTRODUCTION")}
        </Text>
        <VStack>
          <Heading>{getTranslate("SIGNUP")}</Heading>
          <Text mb={2} mt={1}>
            Sign up to QuestionandAnswaredIt
          </Text>
          <Formik
            initialValues={{
              fullname: "",
              email: "",
              password: "",
              username: "",
              repassword: "",
            }}
            onSubmit={(values, actions) => {
              SignUpHandle(values, actions);
            }}
          >
            {(props) => (
              <Form>
                <VStack
                  alignItems={"flex-start"}
                  backgroundColor={Colors(colorMode === "dark").PRIMARY_BG}
                  minWidth={{ base: "90%", md: "25vw" }}
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <Field name="username">
                    {/* @ts-ignore  */}
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.username && form.touched.username
                        }
                      >
                        <FormLabel>{getTranslate("USERNAME")}</FormLabel>
                        <Input
                          variant={"filled"}
                          {...field}
                          required
                          i18nIsDynamicList={false}
                          type="text"
                          placeholder={getTranslate("USERNAME_PLACEHOLDER")}
                        />
                        <FormErrorMessage>
                          {form.errors.username}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="fullname">
                    {/* @ts-ignore  */}
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.fullname && form.touched.fullname
                        }
                      >
                        <FormLabel>{getTranslate("FULLNAME")}</FormLabel>
                        <Input
                          variant={"filled"}
                          {...field}
                          required
                          i18nIsDynamicList={false}
                          type="text"
                          placeholder={getTranslate("FULLNAME_PLACEHOLDER")}
                        />
                        <FormErrorMessage>
                          {form.errors.fullname}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {/* @ts-ignore  */}
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                      >
                        <FormLabel>{getTranslate("EMAIL")}</FormLabel>
                        <Input
                          variant={"filled"}
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
                    {/* @ts-ignore  */}
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel>{getTranslate("PASSWORD")}</FormLabel>
                        <Input
                          variant={"filled"}
                          required
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={getTranslate("PASSWORD_PLACEHOLDER")}
                        />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field
                    name="repassword"
                    validate={(v: string) => validatePassword(v, true)}
                  >
                    {/* @ts-ignore  */}
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.repassword && form.touched.repassword
                        }
                      >
                        <FormLabel>{getTranslate("REPEAT_PASSWORD")}</FormLabel>
                        <Input
                          variant={"filled"}
                          required
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={getTranslate(
                            "REPEAT_PASSWORD_PLACEHOLDER"
                          )}
                        />
                        <FormErrorMessage>
                          {form.errors.repassword}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Checkbox
                    mt={4}
                    onChange={() => setShowPassword(!showPassword)}
                  >
                    {getTranslate("SHOW_PASSWORD")}
                  </Checkbox>
                  <HStack>
                    <Button
                      type="submit"
                      mt={"5"}
                      variant={"main_button"}
                      border={"none"}
                      isLoading={props.isSubmitting}
                    >
                      {getTranslate("SIGNUP")}
                    </Button>
                    {/* <Icon as={}/> */}
                  </HStack>
                </VStack>
              </Form>
            )}
          </Formik>
          <Center>
            <Text>{getTranslate("ALREADY_HAVE_ACCOUNT")}</Text>
            <Button
              variant={"link"}
              // textStyle={{ paddingLeft: 1, minW: "unset", maxW: "unset" }}
              colorScheme="gray"
              onClick={() => signIn()}
            >
              {getTranslate("LOGIN")}
            </Button>
          </Center>
        </VStack>
      </HStack>
    </Container>
  );
}

export default Login;
