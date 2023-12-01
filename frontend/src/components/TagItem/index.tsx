import { TagType } from "@/util/type/Tag.type";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  HStack,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { BiCircle } from "react-icons/bi";

function TagItem({
  tag,
  onClick,
  type = "normal",
}: {
  tag: TagType;
  onClick?: () => void;
  type?: "normal" | "simple";
}) {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [mouseIn, setMouseIn] = useState(false);
  useEffect(() => {
    if (mouseIn) {
      onToggle();
    }
  }, [mouseIn]);
  const handleMouseOver = () => {};

  const handleMouseOut = () => {};

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
          onMouseOver={() => handleMouseOver()}
          onMouseLeave={() => handleMouseOut()}
          w={
            type === "simple" ? "100%" : { base: "100%", md: "48%", xl: "23%" }
          }
          key={tag.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
          }}
          onClick={() => {
            typeof onClick === "function"
              ? onClick()
              : router.push(router.basePath + `/search/tag/${tag.name}`);
          }}
          _hover={{
            boxShadow: "0 0 0 2px orange",
            transition: "all 0.2s ease-in-out",
          }}
          transition={"all 0.2s ease-in-out"}
          cursor={"pointer"}
        >
          <HStack justifyContent={"space-between"}>
            <Tag
              style={{
                fontSize: "14px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            >
              {tag.name}
            </Tag>
            <Tooltip
              label={
                tag.state === "pending"
                  ? "The tag is pending. This tag is waiting for verification .But you still can use this to create question"
                  : "The tag was verified."
              }
            >
              {tag.state === "verified" ? (
                <Icon as={CheckCircleIcon} color="green" />
              ) : tag.state === "pending" ? (
                <Icon as={InfoIcon} color="orange" />
              ) : (
                <BiCircle />
              )}
            </Tooltip>
          </HStack>
          {type === "normal" && (
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "10px",
              }}
              noOfLines={3}
            >
              {tag.content}
            </Text>
          )}

          <Text
            style={{
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            Used by {tag.questionsNumber} question
          </Text>
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirmation!</PopoverHeader>
        <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default TagItem;
