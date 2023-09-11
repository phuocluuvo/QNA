import { mode } from "@chakra-ui/theme-tools";
export const Header = {
  bg: mode("white", "gray.200"),
  sizes: {
    sm: {
      fontSize: "md",
    },
  },
  variants: {
    header: {
      bg: "yellow.500",
      fontSize: "md",
    },
    sm: {
      bg: "teal.500",
      fontSize: "lg",
    },
    md: {
      bg: "orange.500",
      fontSize: "xl",
    },
  },
};
