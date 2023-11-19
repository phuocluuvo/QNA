import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { UserType } from "@/util/type/User.type";
import { Badge, HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";

function AlertContent({
  type,
  content,
  verifier,
}: {
  type: "verified" | "blocked" | "pending";
  content?: string;
  verifier?: UserType;
}) {
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
            }}
          >
            <Badge colorScheme="red">{getTranslate("BLOCKED")}</Badge>
            <Text
              fontSize="sm"
              style={{
                whiteSpace: "pre-line",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {content}
            </Text>
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
            <Text
              fontSize="sm"
              style={{
                whiteSpace: "pre-line",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {content}
            </Text>
          </HStack>
        );
      default:
        return <></>;
    }
  };
  return renderItemBaseOnType(type);
}

export default AlertContent;
