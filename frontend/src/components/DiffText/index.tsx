import React from "react";
import { diffChars, diffWords, diffSentences, diffJson } from "diff";
import { Box } from "@chakra-ui/react";

const DiffText = ({
  inputA,
  inputB,
  type,
}: {
  inputA: string | object;
  inputB: string | object;
  type: "chars" | "words" | "sentences" | "json";
}) => {
  const fnMap = {
    chars: diffChars,
    words: diffWords,
    sentences: diffSentences,
    json: diffJson,
  };
  // @ts-ignore
  const diff = fnMap[type](inputA, inputB);
  // @ts-ignore
  const result = diff.map((part, index: number) => {
    const spanStyle = {
      textDecoration: part.added ? "underline;" : "",
      backgroundColor: part.added
        ? "lightgreen"
        : part.removed
        ? "salmon"
        : "transparent",
    };
    return (
      <span key={index} style={spanStyle}>
        {part.value}
      </span>
    );
  });
  return (
    <Box
      style={{
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        padding: "10px",
        borderRadius: "5px",
      }}
      border={"1px solid"}
      borderColor="whiteAlpha.200"
    >
      {result}
    </Box>
  );
};

export default DiffText;
