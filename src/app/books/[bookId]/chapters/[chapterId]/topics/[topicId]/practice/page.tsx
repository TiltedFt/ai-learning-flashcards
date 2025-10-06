import QuizRunner from "./QuizRunner";

export default async function PracticePage(props: {
  params: Promise<{
    bookId: string;
    chapterId: string;
    topicId: string;
  }>;
}) {
  const { bookId, chapterId, topicId } = await props.params;

  return <QuizRunner bookId={bookId} chapterId={chapterId} topicId={topicId} />;
}
