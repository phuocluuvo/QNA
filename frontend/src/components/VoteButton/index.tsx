import { Colors } from "@/assets/constant/Colors";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
type VoteButtonProps = {
  type: "up" | "down";
  isDarkMode?: boolean;
  onClick?: () => void;
  size?: string | number;
  isVoted?: boolean;
};
function VoteButton(props: VoteButtonProps) {
  const session = useSession();
  let tooltipLabel = "";
  if (!session.data?.user?.id) {
    tooltipLabel = "*You need to login to perform the action* - ";
  }
  if (props.type === "up") {
    tooltipLabel = tooltipLabel.concat(
      "The question is showing the effort of the author, it's useful and clear"
    );
  } else {
    tooltipLabel = tooltipLabel.concat("The question is unclear or not useful");
  }
  return (
    <Tooltip hasArrow placement="right" label={tooltipLabel}>
      <IconButton
        aria-label="Up vote"
        onClick={props.onClick}
        py={0}
        my={0}
        isDisabled={!session.data?.user?.id}
        icon={
          props.type === "up" ? (
            <ChevronUpIcon
              color={Colors(props.isDarkMode).UP_VOTE_GREEN}
              transition={"all 0.5s"}
              fontSize={props.size ? props.size : 30}
              _hover={{ color: Colors(props.isDarkMode).UP_VOTE_GREEN_HOVER }}
            />
          ) : (
            <ChevronDownIcon
              color={Colors(props.isDarkMode).DOWN_VOTE_RED}
              fontSize={props.size ? props.size : 30}
              transition={"all 0.5s"}
              _hover={{ color: Colors(props.isDarkMode).DOWN_VOTE_RED_HOVER }}
            />
          )
        }
        variant={!props.isVoted ? "ghost" : "solid"}
        rounded={"full"}
        color={Colors(props.isDarkMode).PRIMARY}
        transition="all 0.5s"
      />
    </Tooltip>
  );
}

export default VoteButton;
