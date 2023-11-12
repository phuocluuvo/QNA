import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
function CustomError({ statusCode }) {
  const [countdown, setCountdown] = React.useState(5);
  const router = useRouter();
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown]);

  return (
    <Container>
      <Heading>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </Heading>
      <Text my={10}>Sorry, something went wrong.</Text>
      <Text my={10}>
        You will be redirected to the homepage in {countdown} seconds.
      </Text>
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
