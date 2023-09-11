const baseStyle = {
  color: "#ffffff",
  background: "#f48225",
  border: "1px solid transparent",
  boxSizing: "border-box",
};

export const Button = {
  variants: {
    main_button: {
      _dark: {
        ...baseStyle,
        background: "gray.600",
        color: "gray.400",
        _hover: {
          ...baseStyle,
        },
      },
      _light: {
        ...baseStyle,
        _hover: {
          ...baseStyle,
          shadow: "lg",
          shadowColor: "gray.600",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        },
      },
    },
  },
};
