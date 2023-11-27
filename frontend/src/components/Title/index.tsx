import { ArrowBackIcon } from "@chakra-ui/icons";
import { Heading, IconButton } from "@chakra-ui/react";
import React from "react";

function TitleHeader({
  title,
  showGoBack = false,
}: {
  title: string;
  showGoBack?: boolean;
}) {
  return (
    <Heading size={"lg"} fontWeight={"medium"}>
      {title}
    </Heading>
  );
}

export default TitleHeader;
