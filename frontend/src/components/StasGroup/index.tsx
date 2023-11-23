import { Colors } from "@/assets/constant/Colors";
import { DashBoardUserType } from "@/util/type/User.type";
import { Divider, HStack, useColorMode } from "@chakra-ui/react";
import React from "react";
import StasDashBoard from "../StasDashboard";

function StasGroup({
  dashboard,
  filter,
}: {
  dashboard: DashBoardUserType;
  filter: "quater" | "year" | "month";
}) {
  const { colorMode } = useColorMode();
  return (
    <HStack
      style={{
        border: "1px solid" + Colors(colorMode === "dark").PRIMARY,
        width: "fit-content",
        padding: "10px",
        borderRadius: "10px",
      }}
      height={{
        base: "120px",
        md: "150px",
      }}
    >
      <StasDashBoard
        title="Activity Point"
        value={dashboard?.activityPoint}
        bottomText="Total Activity Point"
      />

      <Divider orientation="vertical" />
      {dashboard[filter] && (
        <StasDashBoard
          title="Question"
          value={dashboard[filter].questionCount}
          bottomText="Total Questions"
        />
      )}
      <Divider orientation="vertical" />
      {dashboard[filter] && (
        <StasDashBoard
          title="Answer"
          value={dashboard[filter].answerCount}
          bottomText="Total Answers"
        />
      )}
      <Divider orientation="vertical" />
      {dashboard[filter] && (
        <StasDashBoard
          title="Votes"
          value={dashboard[filter].voteCount}
          bottomText="Total Vote times"
        />
      )}
    </HStack>
  );
}

export default StasGroup;
