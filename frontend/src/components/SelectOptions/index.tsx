import { QUESTION_SORT_BY } from "@/util/type/Question.type";
import { Select, SelectProps } from "@chakra-ui/react";
import React from "react";
const defaultOptions = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Oldest",
    value: "oldest",
  },
  {
    label: "Most voted",
    value: "most-voted",
  },
  {
    label: "Least voted",
    value: "least-voted",
  },
];
type SelectOptionsProps = {
  /**
   * @description array of options
   * @example [{value: "1", label: "1"}, {value: "2", label: "2"}]
   */
  data?: {
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
  getTranslate?: (key: string) => string;
  defaultValues?: string;
};

const SelectOptions = ({
  data = defaultOptions,
  defaultIndex = 0,
  defaultValues = "",
  containerStyle = {},
  optionStyle = {},
  onSelect = () => {},
  getTranslate = (key) => key,
}: SelectOptionsProps) => {
  let hardData = [
    {
      label: getTranslate("UNANSWERED"),
      value: QUESTION_SORT_BY.NO_ANSWER as string,
    },
    {
      label: getTranslate("UNAPPROVED"),
      value: QUESTION_SORT_BY.NO_APPROVED as string,
    },
  ];
  if (data !== defaultOptions) {
    hardData = data;
  }
  return (
    <Select {...containerStyle} onChange={(e) => onSelect(e)}>
      {hardData.map((_data, index) => (
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
