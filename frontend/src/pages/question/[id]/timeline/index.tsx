import { actionGetQuestionHistory } from "@/API/redux/actions/question/ActionGetQuestionList";
import HistoryItem from "@/components/HistoryItem";
import LinkButton from "@/components/LinkButton";
import TitleHeader from "@/components/Title";
import { LayoutContext } from "@/provider/LayoutProvider";
import { QuestionHistoryListType } from "@/util/type/Question.type";
import {
  Box,
  Container,
  HStack,
  Heading,
  Spacer,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function TimelinePage() {
  const dispacth = useDispatch();

  const [timeline, setTimeline] = useState<QuestionHistoryListType | null>(
    null
  );
  const router = useRouter();
  const { currentQuestion } = useContext(LayoutContext);
  useEffect(() => {
    const questionId = router.query.id;
    dispacth(
      // @ts-ignore
      actionGetQuestionHistory(
        questionId as string,
        (res: QuestionHistoryListType) => {
          console.log(res);
          setTimeline(res);
        },
        // @ts-ignore
        (err: any) => {
          console.log(err);
        }
      )
    );
  }, []);
  return (
    <Container maxW={{ base: "fit-content", md: "100%" }} pos={"relative"}>
      <HStack>
        <LinkButton
          style={{
            m: 0,
            pl: 0,
          }}
          text="Back to question"
          href={`/question/${currentQuestion?.id}`}
        />
        <Spacer />
      </HStack>
      <TitleHeader title={`Timeline for ${currentQuestion?.title}`} />
      {timeline ? (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>When</Th>
                <Th>What</Th>
                <Th>By</Th>
                <Th>Comment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {timeline?.data.map((history, index) => (
                <HistoryItem history={history} key={index} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Heading
            style={{
              textAlign: "center",
              marginTop: "10vh",
              marginBottom: "10vh",
            }}
          >
            There is no history for this question
          </Heading>
        </Box>
      )}
    </Container>
  );
}

export default TimelinePage;
