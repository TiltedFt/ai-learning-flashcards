import QuizRunner from "./QuizRunner";

export default async function PracticePage(props: {
  params: Promise<{
    chapterId: string;
    topicId: string;
  }>;
}) {
  const { chapterId, topicId } = await props.params;

  return <QuizRunner chapterId={chapterId} topicId={topicId} />;
}
