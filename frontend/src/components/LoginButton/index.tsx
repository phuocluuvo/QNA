import { Button, ButtonProps } from "@chakra-ui/react";
import React from "react";
import { BiLogoGithub, BiLogoGoogle } from "react-icons/bi";

function LoginButton({
  type,
  getTranslate,
  style,
  onLogin,
}: {
  type: "github" | "google";
  getTranslate: any;
  style?: ButtonProps;
  onLogin: () => void;
}) {
  return type === "github" ? (
    <Button {...style} leftIcon={<BiLogoGithub />} onClick={onLogin}>
      {getTranslate("LOGIN_WITH_GITHUB")}
    </Button>
  ) : (
    <Button {...style} leftIcon={<BiLogoGoogle />} onClick={onLogin}>
      {getTranslate("LOGIN_WITH_GOOGLE")}
    </Button>
  );
}

export default LoginButton;
