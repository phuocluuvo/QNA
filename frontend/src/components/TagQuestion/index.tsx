import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { TagType } from "@/util/type/Tag.type";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  TagProps,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {
  tag: TagType;
  style?: TagProps;
  displayQuestionNumber?: boolean;
};

function TagQuestion({ tag, style, displayQuestionNumber = false }: Props) {
  const router = useRouter();
  const { getTranslate } = LanguageHelper(Pages.HOME);
  const isTagNames = typeof tag === "string";
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [mouseIn, setMouseIn] = useState(false);
  useEffect(() => {
    if (mouseIn) {
      onOpen();
    } else {
      onClose();
    }
  }, [mouseIn]);
  const handleMouseOver = () => {
    setMouseIn(true);
  };

  const handleMouseOut = () => {
    setMouseIn(false);
  };

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Box
          onMouseEnter={() => handleMouseOver()}
          onMouseLeave={() => handleMouseOut()}
          style={{
            borderRadius: "5px",
          }}
          _hover={{
            boxShadow: "0 0 0 0px orange",
            transition: "all 0.2s ease-in-out",
          }}
          transition={"all 0.2s ease-in-out"}
          cursor={"pointer"}
        >
          <HStack>
            <Tag
              key={isTagNames ? tag : tag.id}
              size={"sm"}
              colorScheme={"telegram"}
              py={1}
              px={2}
              pos={"relative"}
              zIndex={2}
              rounded={"full"}
              cursor={"pointer"}
              transition="all 0.2s ease-in-out"
              _hover={{
                bgColor: "orange.400",
                color: "white",
                transition: "all 0.2s ease-in-out",
              }}
              {...style}
              onClick={() =>
                router.push(
                  router.basePath + `/search/tag/${isTagNames ? tag : tag.name}`
                )
              }
            >
              {typeof tag !== "string" ? tag.name : tag}{" "}
              {typeof tag !== "string" && tag.state === "verified" ? (
                <Tooltip
                  label={"This tag was verified"}
                  aria-label={"Verified"}
                >
                  <CheckIcon color={"green"} ml={2} />
                </Tooltip>
              ) : null}
            </Tag>
            {!isTagNames && displayQuestionNumber ? (
              <Text> x {tag.questionsNumber}</Text>
            ) : null}
          </HStack>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>
          {tag.name}
          {typeof tag !== "string" && tag.state === "verified" ? (
            <Tooltip label={"This tag was verified"} aria-label={"Verified"}>
              <CheckIcon color={"green"} ml={2} />
            </Tooltip>
          ) : null}
        </PopoverHeader>
        <PopoverBody>
          <Text
            style={{
              fontSize: "14px",
              marginBottom: "10px",
            }}
            noOfLines={3}
          >
            {tag?.content}
          </Text>
          <Text
            style={{
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            {getTranslate("USED_BY").replace(
              "{0}",
              tag.questionsNumber.toString()
            )}
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default TagQuestion;
