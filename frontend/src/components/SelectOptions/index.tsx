import { Select, SelectProps } from "@chakra-ui/react";
import React from "react";

type SelectOptionsProps = {
  /**
   * @description array of options
   * @example [{value: "1", label: "1"}, {value: "2", label: "2"}]
   */
  data: {
    value: string;
    label: string;
  }[];
  /**
   * @description index of default option
   * @default 0
   */
  defaultIndex?: number;
  containerStyle?: SelectProps;
  /**
   * @description style of each option
   */
  optionStyle?: React.CSSProperties;
  onSelect?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectOptions = ({
  data,
  defaultIndex = 0,
  containerStyle = {},
  optionStyle = {},
  onSelect = () => {},
}: SelectOptionsProps) => {
  return (
    <Select {...containerStyle} onChange={(e) => onSelect(e)}>
      {data.map((_data, index) => (
        <option
          style={optionStyle}
          key={index}
          value={_data.value}
          selected={index === defaultIndex}
        >
          {_data.label}
        </option>
      ))}
    </Select>
  );
};

export default SelectOptions;
