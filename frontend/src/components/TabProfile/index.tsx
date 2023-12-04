import { sendMedia } from "@/API/api";
import ActionUpdateProfile from "@/API/redux/actions/user/ActionUpdateProfile";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { UserType } from "@/util/type/User.type";
import {
  Avatar,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Text,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import moment from "moment";
import dynamic from "next/dynamic";
import Image from "next/image";
import { NextRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebook, FaGithub, FaTwitter } from "react-icons/fa";
import { useDispatch } from "react-redux";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function TabProfile({ user, router }: { user: UserType; router: NextRouter }) {
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );
  const { colorMode } = useColorMode();
  const [_user, setUser] = useState<UserType>(user);
  const inputRef = useRef(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pic, setPic] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const toast = useToast();
  const dispacth = useDispatch();
  function postDetails(pics: File) {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select a picture",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics)
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
        sendMedia(pics, "image")
          .then((res) => res.json())
          .then((data) => {
            setPic(data.url.toString());
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else {
        toast({
          title: "Please select a (another) picture",
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
    else {
      setLoading(false);
      return;
    }
  }
  function onSubmit(values: any, actions: any) {
    let form = {
      fullname: values.name || _user.fullname,
      title: values.title || _user.title,
      facebookLink: values.facebookLink || _user.facebookLink,
      twitterLink: values.twitterLink || _user.twitterLink,
      websiteLink: values.websiteLink || _user.websiteLink,
      githubLink: values.githubLink || _user.githubLink,
      dob: moment(values.dob || _user.dob).toDate(),
      avatar: pic || _user.avatar,
      location: values.location || _user.location,
      about: _user.about,
    };
    dispacth(
      ActionUpdateProfile(
        // @ts-ignore
        form,
        (res) => {
          toast({
            title: "Update success",
            status: "success",
            duration: 2500,
            isClosable: true,
            position: "bottom",
          });
        },
        // @ts-ignore
        (err) => {
          toast({
            title: "Update fail",
            status: "error",
            duration: 2500,
            isClosable: true,
            position: "bottom",
          });
        }
      )
    );
    actions.setSubmitting(false);
  }
  useEffect(() => {
    setUser(user);
  }, [user]);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <Box flex={1} display={"flex"}>
      <HStack spacing={4} flex={1} w={"100%"}>
        <VStack justifyContent={"start"} alignItems={"start"}>
          <Heading size={"sm"}>{getTranslate("PROFILE")}</Heading>
          <Text fontSize={"sm"} color="gray.500">
            {getTranslate("PROFILE_DESCRIPTION")}
          </Text>
          <Box
            border={"1px solid"}
            borderColor={"gray.200"}
            padding={"10px"}
            rounded={"md"}
          >
            <Formik
              initialValues={{
                name: _user.fullname || "",
                title: _user.title || "",
                dob: _user.dob || "",
                githubLink: _user.githubLink || "",
                facebookLink: _user.facebookLink || "",
                twitterLink: _user.twitterLink || "",
                websiteLink: _user.websiteLink || "",
                about: _user.about || "",
                location: _user.location || "",
              }}
              onSubmit={(values, actions) => {
                onSubmit(values, actions);
              }}
            >
              {(props) => (
                <Form>
                  <Stack
                    direction={{
                      base: "column",
                      md: "row",
                    }}
                  >
                    <VStack>
                      <Box pos="relative" w={"fit-content"}>
                        <Avatar
                          name={_user.fullname}
                          style={{
                            borderRadius: "2%",
                            objectFit: "cover",
                          }}
                          w={{
                            base: "100px",
                            md: "150px",
                          }}
                          h={{
                            base: "100px",
                            md: "150px",
                          }}
                          src={pic || _user.avatar}
                        />
                        <Text
                          cursor={"pointer"}
                          fontSize={{
                            base: "xs",
                            md: "sm",
                          }}
                          pos={"absolute"}
                          color={"whiteAlpha.900"}
                          zIndex={2}
                          bottom={2}
                          left={2}
                        >
                          <Box as="label" htmlFor="avatar" cursor="pointer">
                            <Button
                              as="span"
                              variant={"unstyled"}
                              p={"auto"}
                              display={"flex"}
                              justifyContent={"space-around"}
                              alignItems={"center"}
                            >
                              <Spinner
                                display={{
                                  base: loading ? "block" : "none",
                                  md: loading ? "block" : "none",
                                }}
                                size="xs"
                                thickness="3px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="blue.500"
                              />
                              <Text>
                                {pic || _user.fullname ? "Change" : "Select"}{" "}
                                Avatar
                              </Text>
                            </Button>
                          </Box>
                        </Text>
                        <Box
                          style={{
                            background:
                              "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))",
                            position: "absolute",
                            bottom: "0",
                            left: "0",
                            right: "0",
                            width: "100%",
                            height: "30px",
                            borderEndEndRadius: "5px",
                            borderEndStartRadius: "5px",
                          }}
                        />
                      </Box>

                      <Input
                        type="file"
                        accept="image/*"
                        hidden
                        ref={inputRef}
                        id="avatar"
                        onChange={(e) => {
                          e.target.files && postDetails(e.target.files[0]);
                        }}
                      />
                    </VStack>
                    <VStack>
                      <Field name="name">
                        {/* @ts-ignore */}
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel>{getTranslate("FULLNAME")}</FormLabel>
                            <Input
                              type="text"
                              minWidth={{
                                base: "80vw",
                                md: "30vw",
                              }}
                              {...field}
                              defaultValue={_user.fullname}
                              placeholder="Your Name"
                            />
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="title">
                        {/* @ts-ignore */}
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.title && form.touched.title}
                          >
                            <FormLabel>{getTranslate("USER_TITLE")}</FormLabel>
                            <Input
                              type="text"
                              {...field}
                              placeholder="Your title"
                              defaultValue={_user.title}
                            />
                            <FormErrorMessage>
                              {form.errors.title}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </VStack>
                  </Stack>
                  <Field name="location">
                    {/* @ts-ignore */}
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.title && form.touched.title}
                      >
                        <FormLabel>{getTranslate("LOCATION")}</FormLabel>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Location"
                          defaultValue={_user.location}
                        />
                        <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="about">
                    {/* @ts-ignore */}
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.title && form.touched.title}
                        style={{
                          width: "100%",
                        }}
                      >
                        <FormLabel>{getTranslate("ABOUT")}</FormLabel>
                        <MDEditor
                          style={{
                            height: "auto",
                            minHeight: "300px",
                            maxHeight: "500px",
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.1)",
                            borderRadius: "5px",
                          }}
                          preview="edit"
                          about="This is a markdown editor that uses a preview panel to show the result of your markdown!"
                          value={_user.about}
                          data-color-mode={colorMode}
                          onChange={(value) => {
                            // @ts-ignore
                            setUser((oldState) =>
                              helper.mappingState(oldState, {
                                about: value,
                              })
                            );
                          }}
                        />
                        <Box>
                          <EditerMarkdown
                            source={_user.about}
                            style={{
                              fontSize: "16px",
                              backgroundColor: "transparent",
                            }}
                          />
                        </Box>
                        <FormErrorMessage>{form.errors.title}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Heading size={"sm"} m={2} ml={0}>
                    {getTranslate("SOCIAL_LINKS")}
                  </Heading>
                  <Stack
                    direction={{
                      base: "column",
                      md: "row",
                    }}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    padding={"10px"}
                    rounded={"md"}
                  >
                    <Field name="githubLink">
                      {/* @ts-ignore */}
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.githubLink && form.touched.githubLink
                          }
                        >
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <FaGithub color="gray.300" />
                            </InputLeftElement>
                            <Input
                              type="url"
                              {...field}
                              placeholder={getTranslate("GITHUB_PLACEHOLDER")}
                            />
                            <FormErrorMessage>
                              {form.errors.githubLink}
                            </FormErrorMessage>
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="facebookLink">
                      {/* @ts-ignore */}
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.facebookLink &&
                            form.touched.facebookLink
                          }
                        >
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <FaFacebook color="gray.300" />
                            </InputLeftElement>
                            <Input
                              type="url"
                              {...field}
                              placeholder={getTranslate("FACEBOOK_PLACEHOLDER")}
                            />
                            <FormErrorMessage>
                              {form.errors.facebookLink}
                            </FormErrorMessage>
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="twitterLink">
                      {/* @ts-ignore */}
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.twitterLink && form.touched.twitterLink
                          }
                        >
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <FaTwitter color="gray.300" />
                            </InputLeftElement>
                            <Input
                              type="url"
                              {...field}
                              placeholder={getTranslate("TWITTER_PLACEHOLDER")}
                            />
                            <FormErrorMessage>
                              {form.errors.twitterLink}
                            </FormErrorMessage>
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="websiteLink">
                      {/* @ts-ignore */}
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.websiteLink && form.touched.websiteLink
                          }
                        >
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <FaFacebook color="gray.300" />
                            </InputLeftElement>
                            <Input
                              {...field}
                              placeholder={getTranslate("WEBSITE_PLACEHOLDER")}
                            />
                            <FormErrorMessage>
                              {form.errors.websiteLink}
                            </FormErrorMessage>
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Button
                    mt={4}
                    colorScheme="teal"
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    {getTranslate("SUBMIT")}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}

export default TabProfile;
