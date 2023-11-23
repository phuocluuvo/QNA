import {
  Box,
  Button,
  Collapse,
  Tag,
  Td,
  Text,
  Tr,
  VStack,
  styled,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import DiffText from "../DiffText";
import { QuestionHistoryType } from "@/util/type/Question.type";
import helper from "@/util/helper";

function HistoryItem({ history }: { history: QuestionHistoryType }) {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <>
      <Tr
        justifyItems={"flex-start"}
        alignItems={"flex-start"}
        p={5}
        shadow="md"
        borderWidth="1px"
      >
        <TdCustom>{helper.formatDate(history.createdAt, true)}</TdCustom>
        <TdCustom>
          <Tag>{history.type}</Tag>
        </TdCustom>
        <TdCustom fontWeight="bold">{history.user.fullname}</TdCustom>
        <TdCustom>
          <Button onClick={onToggle}>
            {isOpen ? <Text>Hide Change</Text> : <Text>Show Change</Text>}
          </Button>
        </TdCustom>
      </Tr>
      <Tr>
        <Td colSpan={4} p={0}>
          <Collapse in={isOpen} animateOpacity>
            <Box p={4}>
              <DiffText
                inputA={history.title}
                inputB={history.question.title}
                type="chars"
              />
              <DiffText
                inputA={history.content}
                inputB={history.question.content}
                type="chars"
              />
            </Box>
          </Collapse>
        </Td>
      </Tr>
    </>
  );
}

const TdCustom = styled(Td, {
  baseStyle: {
    padding: "0.5rem",
  },
});

export default HistoryItem;
