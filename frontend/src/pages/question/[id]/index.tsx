import api from "@/API/api";
import ErrorContent from "@/components/Error";
import { removeVietnameseTones } from "@/util/helper";
import { QuestionType } from "@/util/type/Question.type";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RedirectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      api
        .getQuestion({ id: id as string })
        // @ts-ignore
        .then((res: { data: QuestionType }) => {
          // @ts-ignore
          setTitle(res.data.title);
          router.push(
            `/question/${id}/${removeVietnameseTones(res.data.title)}`
          );
        })
        .catch((err) => {
          console.error(err);
          setError(true);
        });
    }
  }, [id]);

  if (error) {
    return (
      <ErrorContent
        errorTitle="Question not found"
        errorMessage="The question you just trying to accesss is not exist or has been blocked"
      />
    );
  }

  return null;
}
