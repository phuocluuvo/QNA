import { Colors } from "@/assets/constant/Colors";
import { DashBoardUserType } from "@/util/type/User.type";
import { Divider, Grid, HStack, useColorMode } from "@chakra-ui/react";
import React from "react";
import StasDashBoard from "../StasDashboard";

function StasGroup({
  dashboard,
  filter,
}: {
  dashboard: DashBoardUserType;
  filter: "quarter" | "year" | "month";
}) {
  const { colorMode } = useColorMode();
  return (
    <Grid
      templateColumns={{
        base: "repeat(2, 1fr)",
        md: "repeat(2, 1fr)",
      }}
      style={{
        border: "1px solid" + Colors(colorMode === "dark").PRIMARY,
        width: "100%",
        padding: "10px",
        borderRadius: "10px",
        height: "100%",
      }}
    >
      <StasDashBoard
        title="Activity Point"
        value={dashboard?.activityPoint}
        bottomText="Total Activity Point"
      />

      {dashboard[filter] && (
        <StasDashBoard
          title="Question"
          value={dashboard[filter].questionCount}
          bottomText="Total Questions"
        />
      )}
      {dashboard[filter] && (
        <StasDashBoard
          title="Answer"
          value={dashboard[filter].answerCount}
          bottomText="Total Answers"
        />
      )}
      {dashboard[filter] && (
        <StasDashBoard
          title="Votes"
          value={dashboard[filter].voteCount}
          bottomText="Total Vote times"
        />
      )}
    </Grid>
  );
}

export default StasGroup;
