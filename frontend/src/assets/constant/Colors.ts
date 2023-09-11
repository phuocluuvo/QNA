const _Colors = (isDarkMode = false) => {
  return {
    PRIMARY: "#f48225",
    PRIMARY_BG: isDarkMode ? "gray.700" : "gray.200",
    UP_VOTE_GREEN: "#21ba45",
    UP_VOTE_GREEN_HOVER: "#a3f9a3",
    DOWN_VOTE_RED: "#db2828",
    DOWN_VOTE_RED_HOVER: "#f9a3a3",
    LIGHT_WHITE: "#f9f9f9",
    BORDER: isDarkMode ? "#f9f9f9" : "darkgray",
  };
};

export const Colors = _Colors;
