import { Colors } from "@/assets/constant/Colors";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React from "react";
type VoteButtonProps = {
  type: "up" | "down";
  isDarkMode?: boolean;
  onClick?: () => void;
};
function VoteButton(props: VoteButtonProps) {
  return (
    <IconButton
      aria-label="Up vote"
      onClick={props.onClick}
      py={0}
      my={0}
      icon={
        props.type === "up" ? (
          <ChevronUpIcon
            color={Colors(props.isDarkMode).UP_VOTE_GREEN}
            transition={"all 0.5s"}
            fontSize={30}
            _hover={{ color: Colors(props.isDarkMode).UP_VOTE_GREEN_HOVER }}
          />
        ) : (
          <ChevronDownIcon
            color={Colors(props.isDarkMode).DOWN_VOTE_RED}
            fontSize={30}
            transition={"all 0.5s"}
            _hover={{ color: Colors(props.isDarkMode).DOWN_VOTE_RED_HOVER }}
          />
        )
      }
      variant="ghost"
      rounded={"full"}
      color={Colors(props.isDarkMode).PRIMARY}
      transition="all 0.5s"
    />
  );
}

export default VoteButton;
