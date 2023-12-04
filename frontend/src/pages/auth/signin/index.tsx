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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
  useColorMode,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Link,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { getCsrfToken, getSession, signIn, useSession } from "next-auth/react";
import LoginButton from "@/components/LoginButton";
import { useDispatch } from "react-redux";
import { ActionGetBadgeNotification } from "@/API/redux/actions/user/ActionGetNotificationBadge";
import { LayoutContext } from "@/provider/LayoutProvider";
import { Colors } from "@/assets/constant/Colors";
import api from "@/API/api";
import { actionCheckUserExisted } from "@/API/redux/actions/user/ActionCheckUserExisted";
import { actionForgetPassword } from "@/API/redux/actions/user/ActionForgotPassword";
import { UserType } from "@/util/type/User.type";
import { actionRestPassword } from "@/API/redux/actions/user/ActionResetPassword";
import helper from "@/util/helper";
export default function SignIn() {
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showResetPassword, setShowResetPassword] = React.useState(false);
  const { colorMode } = useColorMode();
  const [show, setShow] = React.useState(false);
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const { setBadgeNumber } = React.useContext(LayoutContext);
  const [username, setUsername] = React.useState<string>("");
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const alert = useDisclosure();
  const [statePassword, setStatePassword] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });
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
  const session = useSession();
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
        console.log("_______response", response);
        if (response && response.ok) {
          if (session.data?.user.id)
            dispatch(
              // @ts-ignore
              ActionGetBadgeNotification(
                (res) => {
                  setBadgeNumber(res);
                },
                () => {}
              )
            );
          if (router.query.callbackUrl) {
            router.push(router.query.callbackUrl as string, undefined, {
              shallow: true,
            });
          } else {
            router.push("/", undefined, { shallow: true });
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
  function LoginSocialHandle(type: "github" | "google") {
    const baseURL = "https://trongphan5301.click";
    window.location.href = `${baseURL}/api/auth/${type}`;
  }

  function ResetPassword({
    uuid,
    password,
  }: {
    uuid: string;
    password: string;
  }) {
    const form = {
      uuid: uuid,
      password: password,
    };
    dispatch(
      // @ts-ignore
      actionRestPassword(
        form,
        (res: UserType) => {
          if (res.id) {
            toast({
              title: getTranslate("RESET_PASSWORD_SUCCESS"),
              status: "success",
            });
            router.replace("/auth/signin");
          }
        },
        () => {}
      )
    );
  }
  const token = router.query.refreshToken;
  const error = router.query.error;
  useEffect(() => {
    if (router.query.refreshToken) {
      signIn("credentials", {
        token: decodeURIComponent(
          router.query.refreshToken as string
        ).replaceAll(" ", "+"),
        callbackUrl: "/",
        redirect: false,
      }).then((response) => {
        console.log(response);
        if (response && response.ok) {
          if (router.query.callbackUrl) {
            router.push(router.query.callbackUrl as string, undefined, {
              shallow: true,
            });
          } else {
            router.push("/", undefined, { shallow: true });
          }
        } else {
          toast({
            title: getTranslate("LOGIN_ERROR"),
            status: "error",
          });
        }
      });
    }
  }, [router.query.refreshToken]);
  useEffect(() => {
    if (router.query.error) {
      alert.onOpen();
      // toast({
      //   title: getErrorParams(error as string),
      //   status: "error",
      // });
    }
  }, [router.query.error]);
  function getErrorParams(err: string): string {
    switch (err) {
      case "USER_IS_BLOCK":
        return getTranslate("USER_IS_BLOCK");
      default:
        return getTranslate("LOGIN_ERROR");
    }
  }
  useEffect(() => {
    if (router.query.uuid) {
      setShowResetPassword(true);
    }
  }, [router.query.uuid]);
  function handleCheckExist(value: string) {
    dispatch(
      // @ts-ignore
      actionCheckUserExisted(
        value,
        (res: UserType) => {
          console.log(res);

          if (res.username)
            dispatch(
              // @ts-ignore
              actionForgetPassword(
                res.username,
                (res) => {
                  toast({
                    title: getTranslate("EMAIL_SENT"),
                    status: "success",
                  });
                  console.log(res);
                },
                (err) => {}
              )
            );
          onClose();
        },
        () => {
          toast({
            title: getTranslate("USER_NOT_FOUND"),
            status: "error",
          });
          onClose();
          // router.push(`/auth/reset-password?username=${value}`);
        }
      )
    );
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
            onLogin={() => LoginSocialHandle("github")}
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
            onLogin={() => {
              LoginSocialHandle("google");
            }}
          />
          <Box mt={5} mb={5} w={"100%"} h={"1px"} bg={"gray.300"}></Box>
          {/* Facebook  */}
          <Formik
            initialValues={{
              username: "",
              password: "",
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
                <HStack
                  justifyItems={"center"}
                  alignContent={"center"}
                  mt={"5"}
                >
                  <Button
                    type="submit"
                    background={colorMode === "light" ? "gray.100" : "gray.700"}
                    border={"none"}
                    isLoading={props.isSubmitting}
                  >
                    {getTranslate("LOGIN")}
                  </Button>
                  <Spacer />
                  <Button
                    colorScheme="gray"
                    variant={"link"}
                    size={"sm"}
                    onClick={onOpen}
                  >
                    {getTranslate("FORGOT_PASSWORD")}
                  </Button>
                </HStack>
              </Form>
            )}
          </Formik>
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getTranslate("ENTER_USERNAME")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder={getTranslate("ENTER_USERNAME")}
              value={username ?? usernameRef.current?.value}
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              colorScheme="green"
              mr={3}
              onClick={() => {
                handleCheckExist(username);
              }}
            >
              {getTranslate("SUBMIT")}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {getTranslate("CANCEL")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showResetPassword}
        onClose={() => {
          setShowResetPassword(false);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset your password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder={getTranslate("USERNAME_PLACEHOLDER")}
              value={statePassword.newPassword}
              required
              onChange={(e) => {
                // @ts-ignore
                setStatePassword((oldState) =>
                  helper.mappingState(oldState, {
                    newPassword: e.target.value,
                  })
                );
              }}
            />
            <Input
              placeholder={getTranslate("PASSWORD_PLACEHOLDER")}
              value={statePassword.confirmPassword}
              required
              onChange={(e) => {
                // @ts-ignore
                setStatePassword((oldState) =>
                  helper.mappingState(oldState, {
                    confirmPassword: e.target.value,
                  })
                );
              }}
            />
            {statePassword.newPassword !== statePassword.confirmPassword && (
              <Text color={Colors(true).DOWN_VOTE_RED_HOVER}>
                {getTranslate("ERROR_PASSWORD_NOT_MATCH")}
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              type="submit"
              colorScheme="green"
              mr={3}
              isDisabled={
                statePassword.newPassword !== statePassword.confirmPassword
              }
              onClick={() => {
                const form = {
                  uuid: router.query.uuid as string,
                  password: statePassword.newPassword,
                };
                ResetPassword(form);
              }}
            >
              {getTranslate("SUBMIT")}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {getTranslate("CANCEL")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        motionPreset="slideInBottom"
        // @ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={alert.onClose}
        isOpen={alert.isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{getTranslate("ALERT")}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              {getErrorParams(error as string)}
            </Text>
            <Text>Something wrongs?</Text>
            <Link
              variant={"ghost"}
              style={{
                fontWeight: "bold",
              }}
              onClick={(e) => {
                const subject = encodeURIComponent("Error from user");
                const body = encodeURIComponent(`
                Hello Admin,
                
                I have a problem with my account: [Your account name]
                
                Error: ${error}

                Details: [Enter your detail here]
                `);

                window.location.href = `mailto:voluu0702@gmail.com?subject${subject}=&body=${body}`;
                e.preventDefault();
              }}
            >
              Mail to us
            </Link>{" "}
            or{" "}
            <Link
              style={{
                fontWeight: "bold",
              }}
              onClick={(e) => {
                window.location.href = `tel:0333751890`;
                e.preventDefault();
              }}
            >
              Contact us: 0333751890
            </Link>
          </AlertDialogBody>
          <AlertDialogFooter>
            {/* @ts-ignore */}
            <Button ref={cancelRef} onClick={alert.onClose}>
              {getTranslate("CONFIRM")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}
