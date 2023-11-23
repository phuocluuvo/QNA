import { Stat, StatLabel, StatNumber, StatHelpText, Divider } from "@chakra-ui/react";
import React from "react";

function StasDashBoard({
  title,
  value,
  bottomText,
}: {
  title: string;
  value: number | string;
  bottomText: string;
}) {
  return (
    <>
      <Stat
        style={{
          width: "fit-content",
          padding: "10px",
          height: "100%",
        }}
      >
        <StatLabel>{title}</StatLabel>
        <StatNumber
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {value}
        </StatNumber>
        <StatHelpText>{bottomText}</StatHelpText>
      </Stat>
    </>
  );
}

export default StasDashBoard;
