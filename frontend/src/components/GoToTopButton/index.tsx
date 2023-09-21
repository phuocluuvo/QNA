import { ChevronUpIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import React, { useState } from "react";

function GoToTopButton() {
  const [showButton, setShowButton] = useState(false);

  function handleScroll() {
    const isScrolled = window.scrollY > 100;
    setShowButton(isScrolled);
  }

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <IconButton
      aria-label="Go to top"
      position="fixed"
      variant={"main_button"}
      bottom="20px"
      right="20px"
      // display={showButton ? "block" : "none"}
      disabled={!showButton}
      cursor={!showButton ? "default" : "pointer"}
      opacity={showButton ? "1" : "0"}
      transition={"all 0.3s ease-in-out"}
      bgColor={"orange.400"}
      rounded={"full"}
      icon={<ChevronUpIcon />}
      onClick={handleClick}
      zIndex={9999}
    />
  );
}

export default GoToTopButton;
