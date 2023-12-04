import { Skeleton, VStack } from "@chakra-ui/react";
import React from "react";

function LoadingQuestionList() {
  return (
    <VStack>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <Skeleton
          rounded={"md"}
          key={index}
          height={"150px"}
          width={"45vw"}
          background={"gray.200"}
        />
      ))}
    </VStack>
  );
}

export default LoadingQuestionList;
