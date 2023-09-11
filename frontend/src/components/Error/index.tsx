import React from "react";
import { Button, Container, Heading, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

function ErrorContent({
  errorTitle,
  errorMessage,
}: {
  errorTitle: string;
  errorMessage: string;
}) {
  const router = useRouter();
  return (
    <Container>
      <Heading>{errorTitle}</Heading>
      <Text my={10}>{errorMessage} </Text>
      <IconButton
        as={Button}
        variant={"outline"}
        aria-label="Back to Home"
        icon={<ArrowBackIcon />}
        onClick={() => router.push("/")}
      >
        Back to Home
      </IconButton>
    </Container>
  );
}

export default ErrorContent;
