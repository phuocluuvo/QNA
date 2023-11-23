import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { UserType } from "@/util/type/User.type";
import {
  Badge,
  Box,
  HStack,
  Spacer,
  Text,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import Author from "../Author";
import { QuestionType } from "@/util/type/Question.type";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);
function AlertContent({ question }: { question: QuestionType }) {
  const { colorMode } = useColorMode();
  const { getTranslate } = LanguageHelper(Pages.HOME);

  const renderItemBaseOnType = (type: string) => {
    switch (type) {
      case "blocked":
        return (
          <HStack
            style={{
              whiteSpace: "pre-line",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              padding: "10px",
              marginBlock: "10px",
              alignItems: "flex-start",
            }}
          >
            <Badge colorScheme="red">{getTranslate("BLOCKED")}</Badge>
            <Box data-color-mode={colorMode}>
              <EditerMarkdown
                source={question.comments[0].content}
                style={{
                  fontSize: "16px",
                  backgroundColor: "transparent",
                }}
              />
            </Box>
            <Spacer />
            <Author
              user={question.comments[0].user}
              nameStyle={{
                fontSize: "12px",
              }}
              type="simple"
              sizeAvatar={"xs"}
              bottomText={"Verified at " + question.comments[0].createdAt}
            />
          </HStack>
        );
      case "pending":
        return (
          <HStack
            style={{
              whiteSpace: "pre-line",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              backgroundColor: "rgba(255, 255, 0, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              padding: "10px",
              marginBlock: "10px",
            }}
          >
            <Badge colorScheme="yellow">{getTranslate("PENDING")}</Badge>
            <Text>This question is pending for review</Text>
            {/* <EditerMarkdown
              source={question.comments[0].content}
              style={{
                fontSize: "12px",
              }}
            /> */}
          </HStack>
        );
      default:
        return <></>;
    }
  };
  return renderItemBaseOnType(question.state);
}

export default AlertContent;
