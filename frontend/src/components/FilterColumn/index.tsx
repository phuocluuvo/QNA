import {
  Box,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { memo } from "react";

type FilterColumnProps = {
  title: string;
  value: string;
  setValue: (value: string) => void;
  dataList: Array<{
    label: string;
    value: string;
  }>;
  defaultValue?: string;
};

function FilterColumn(props: FilterColumnProps) {
  const { colorMode } = useColorMode();
  return (
    <Box>
      <Text
        style={{
          fontWeight: "bold",
          color: colorMode === "light" ? "black" : "white",
        }}
      >
        {props.title}
      </Text>
      <RadioGroup onChange={props.setValue} value={props.value}>
        <Stack
          direction="column"
          defaultValue={props.defaultValue}
          defaultChecked={true}
        >
          {props.dataList.map((item, index) => (
            <Radio
              key={index}
              colorScheme="orange"
              value={item.value}
              variant={"outline"}
            >
              <Text
                variant={"body"}
                style={{
                  color: colorMode === "light" ? "black" : "white",
                }}
              >
                {item.label}
              </Text>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
}

export default memo(FilterColumn);
