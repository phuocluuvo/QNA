import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Text } from "@chakra-ui/react";
import React from "react";
function CustomError({ statusCode }) {
  return (
    <Container>
      <Heading>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </Heading>
      <Text my={10}>Sorry, something went wrong.</Text>
      <Button variant={"link"} leftIcon={<ArrowBackIcon />} as="a" href="/">
        Go Home
      </Button>
    </Container>
  );
}
CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default CustomError;
