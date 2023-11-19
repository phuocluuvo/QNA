import { sendMedia } from "@/API/api";
import ActionUpdateProfile from "@/API/redux/actions/user/ActionUpdateProfile";
import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
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
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

function TabProfile({ user }: { user: UserType }) {
  const { getTranslate, getListLanguage, getCurrentLanguage } = LanguageHelper(
    Pages.HOME
  );
  const inputRef = useRef(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [pic, setPic] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const toast = useToast();
  const dispacth = useDispatch();
  function validateName(value: string) {
    let error;
    if (!value) {
      error = "Name is required";
    }
    return error;
  }
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
    dispacth(
      ActionUpdateProfile(
        {
          fullname: values.name,
          // location: values.location,
          // introduce: values.introduce,
          avatar: pic ?? user.avatar,
        },
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
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  return (
    <Box flex={1} display={"flex"} w={"80vw"}>
      <HStack spacing={4} flex={1} w={"100%"}>
        <VStack justifyContent={"start"} alignItems={"start"}>
          <Heading size={"sm"}>Profile Public</Heading>
          <VStack>
            <Box pos="relative" w={"fit-content"}>
              <Avatar
                name={user.fullname}
                style={{
                  borderRadius: "2%",
                  objectFit: "cover",
                  width: "150px",
                  height: "150px",
                }}
                src={pic ?? user.avatar}
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
                      {pic || user.fullname ? "Change" : "Select"} Avatar
                    </Text>
                  </Button>
                </Box>
              </Text>
              <Box
                style={{
                  background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))",
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  width: "100%",
                  height: "30px",
                  borderEndEndRadius: "12px",
                  borderEndStartRadius: "12px",
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
          <Formik
            initialValues={{
              name: user.fullname ?? "",
              location: "",
              introduce: "",
            }}
            onSubmit={(values, actions) => {
              onSubmit(values, actions);
            }}
          >
            {(props) => (
              <Form>
                <Field name="name" validate={validateName}>
                  {/* @ts-ignore */}
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel>Display Name</FormLabel>
                      <Input
                        minWidth={{
                          base: "80vw",
                          md: "30vw",
                        }}
                        {...field}
                        placeholder="name"
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="location">
                  {/* @ts-ignore */}
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.location && form.touched.location}
                    >
                      <FormLabel>Location</FormLabel>
                      <Input {...field} placeholder="Location" />
                      <FormErrorMessage>
                        {form.errors.location}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="introduce">
                  {/* @ts-ignore */}
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={
                        form.errors.introduce && form.touched.introduce
                      }
                    >
                      <FormLabel>Introduce</FormLabel>
                      <Input {...field} placeholder="Introduce" />
                      <FormErrorMessage>
                        {form.errors.introduce}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

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
        </VStack>
      </HStack>
    </Box>
  );
}

export default TabProfile;
