import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import { TagType } from "@/util/type/Tag.type";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  IconButton,
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
  onCancelClick?: () => void;
  onClick?: () => void;
  type?: "minimals" | "normal";
};

function TagQuestion({
  tag,
  style,
  displayQuestionNumber = false,
  type = "normal",
  onCancelClick,
  onClick,
}: Props) {
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
      isLazy
      placement="bottom"
      isOpen={isOpen}
      onClose={onClose}
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
            {type === "minimals" ? (
              <Tag
                size={"md"}
                variant="solid"
                colorScheme="orange"
                cursor={"pointer"}
                display={"flex"}
                minW={"fit-content"}
                {...style}
                onClick={() => onClick && onClick()}
              >
                <Text minW={"fit-content"} fontSize={"xs"} flex={1} isTruncated>
                  {tag?.name}
                </Text>
                {typeof tag !== "string" && tag.state === "verified" ? (
                  <Tooltip
                    label={"This tag was verified"}
                    aria-label={"Verified"}
                  >
                    <CheckIcon color={"green"} ml={2} />
                  </Tooltip>
                ) : null}
                {onCancelClick ? (
                  <IconButton
                    variant={"ghost"}
                    colorScheme="orange"
                    _hover={{
                      bg: "transparent",
                      color: "whiteAlpha.700",
                    }}
                    aria-label="delete"
                    size="xs"
                    onClick={() => onCancelClick && onCancelClick()}
                    icon={<CloseIcon />}
                  />
                ) : null}
              </Tag>
            ) : (
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
                    router.basePath +
                      `/search/tag/${isTagNames ? tag : tag.name}`
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
            )}
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
            {/* @ts-ignore */}
            {getTranslate("USED_BY").replace("{0}", tag.questionsNumber ?? "0")}
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default TagQuestion;
