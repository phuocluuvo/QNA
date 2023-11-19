import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
function CustomError({ statusCode }) {
  const [countdown, setCountdown] = React.useState(5);
  const [message, setMessage] = React.useState("");
  const router = useRouter();
  const session = useSession();
  React.useEffect(() => {
    if (statusCode === 404) {
      setMessage("Page not found");
    } else if (statusCode === 500) {
      setMessage("Loading..." + "\n" + "Please wait a moment");
    }
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (countdown === 0) {
      session.data?.user?.role === "admin"
        ? router.push("/question")
        : router.push("/");
    }
  }, [countdown]);

  return (
    <Container>
      <Heading>{message}</Heading>
      <Text my={10} display={statusCode !== 500 ? "flex" : "none"}>
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
