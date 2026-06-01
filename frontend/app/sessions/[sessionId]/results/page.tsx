import ResultsClient from '../../../../components/sessions/ResultsClient';

type ResultsPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = await params;
  return <ResultsClient sessionId={sessionId} />;
}
