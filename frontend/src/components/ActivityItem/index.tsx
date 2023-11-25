import { Pages } from "@/assets/constant/Pages";
import { LanguageHelper } from "@/util/Language/Language.util";
import helper from "@/util/helper";
import { HistoryActivityType } from "@/util/type/HistoryActivity";
import {
  HISTORY_ACTIVITY_TYPE,
  OBJECT_ACTIVITY_TYPE,
} from "@/util/type/HistoryActivity.enum";
import {
  Tr,
  Td,
  Badge,
  useDisclosure,
  Collapse,
  Button,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

function ActivityItem({ item }: { item: HistoryActivityType }) {
  const router = useRouter();
  const { getTranslate, getCurrentLanguage } = LanguageHelper(Pages.HOME);
  const getColorSchemeByActivityType = (
    activityType: HISTORY_ACTIVITY_TYPE
  ) => {
    switch (activityType) {
      case HISTORY_ACTIVITY_TYPE.BLOCK_QUESTION:
        return "red";
      case HISTORY_ACTIVITY_TYPE.CREATE_QUESTION:
        return "blue";
      case HISTORY_ACTIVITY_TYPE.VERIFY_QUESTION:
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <>
      <Tr>
        <Td>
          <Button
            colorScheme={getColorSchemeByActivityType(
              item.activityType as HISTORY_ACTIVITY_TYPE
            )}
            onClick={() => {
              if (item.objectType === OBJECT_ACTIVITY_TYPE.QUESTION)
                router.push(`/question/${item.objectId}`);
              if (item.objectType === OBJECT_ACTIVITY_TYPE.VOTE_ANSWER)
                router.push(`/question/${item.answer?.question.id}`);
              if (item.objectType === OBJECT_ACTIVITY_TYPE.VOTE_QUESTION)
                router.push(`/question/${item.question?.id}`);
              if (item.objectType === OBJECT_ACTIVITY_TYPE.ANSWER)
                router.push(`/question/${item.question?.id}`);
              if (item.objectType === OBJECT_ACTIVITY_TYPE.COMMENT)
                router.push(`/question/${item.question?.id}`);
            }}
          >
            {getCurrentLanguage().code === "vi"
              ? helper.getTranslationFromHistoryAcitvityVi(item.activityType)
              : helper.getTranslationFromHistoryAcitvityEn(item.activityType)}
          </Button>
        </Td>
        <Td>
          <Badge>{item.objectType.replaceAll("_", " ")}</Badge>
        </Td>
        <Td>
          {helper.formatDate(item.createdAt, false, "HH:mm:ss - DD/MM/YYYY")}
        </Td>
        <Td isNumeric>{item.pointChange}</Td>
      </Tr>
    </>
  );
}

export default ActivityItem;
