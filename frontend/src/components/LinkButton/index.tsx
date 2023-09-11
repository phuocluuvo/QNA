import { Colors } from "@/assets/constant/Colors";
import {
  Text,
  TextProps,
  ContainerProps,
  Container,
  useColorMode,
} from "@chakra-ui/react";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

interface LinkButtonProps {
  /**
   * style is the style of the button
   */
  style?: ContainerProps;
  /**
   * textStyle is the style of the text
   */
  textStyle?: TextProps;
  /**
   * text is the text of the button
   */
  text: string;
  /**
   * The path or URL to navigate to. It can also be an object.
   */
  href: Url;
  onClick?: () => void;
}

function LinkButton({
  href,
  style,
  textStyle,
  text,
  onClick = () => {},
}: LinkButtonProps) {
  const { colorMode } = useColorMode();
  return (
    <Link href={href} onClick={onClick}>
      <Container {...style}>
        <Text
          fontWeight="bold"
          noOfLines={1}
          justifyContent={"center"}
          minW={"100px"}
          textAlign={"center"}
          verticalAlign={"middle"}
          transition={"all 0.2s ease-in-out"}
          _hover={{
            textDecoration: "none",
            color: Colors(colorMode === "dark").PRIMARY,
          }}
          {...textStyle}
        >
          {text}
        </Text>
      </Container>
    </Link>
  );
}

export default LinkButton;
