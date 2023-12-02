import { Colors } from "@/assets/constant/Colors";
import { DashBoardUserType } from "@/util/type/User.type";
import { Divider, Grid, HStack, useColorMode } from "@chakra-ui/react";
import React from "react";
import StasDashBoard from "../StasDashboard";
import { LanguageHelper } from "@/util/Language/Language.util";
import { Pages } from "@/assets/constant/Pages";

function StasGroup({
  dashboard,
  filter,
}: {
  dashboard: DashBoardUserType;
  filter: "quarter" | "year" | "month";
}) {
  const { getTranslate } = LanguageHelper(Pages.HOME);
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
        title={getTranslate("ACTIVITY_POINTS")}
        value={dashboard?.activityPoint}
        bottomText={getTranslate("TOTAL_ACTIVITY_POINTS")}
      />

      {dashboard[filter] && (
        <StasDashBoard
          title={getTranslate("QUESTIONS")}
          value={dashboard[filter].questionCount}
          bottomText={getTranslate("TOTAL_QUESTIONS")}
        />
      )}
      {dashboard[filter] && (
        <StasDashBoard
          title={getTranslate("ANSWERS")}
          value={dashboard[filter].answerCount}
          bottomText={getTranslate("TOTAL_ANSWERS")}
        />
      )}
      {dashboard[filter] && (
        <StasDashBoard
          title={getTranslate("VOTES")}
          value={dashboard[filter].voteCount}
          bottomText={getTranslate("TOTAL_VOTES")}
        />
      )}
    </Grid>
  );
}

export default StasGroup;
