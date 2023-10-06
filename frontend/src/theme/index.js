import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Button } from "./components/button.theme";
import { Input } from "./components/input.theme";
const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#141214")(props),
    },
  }),
};

const components = {
  Button,
  Input,
};

const theme = extendTheme({
  components,
  styles,
});

export default theme;
