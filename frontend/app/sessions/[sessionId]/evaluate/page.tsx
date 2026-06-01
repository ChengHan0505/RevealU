import EvaluationClient from '../../../../components/sessions/EvaluationClient';

type EvaluationPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function EvaluationPage({ params }: EvaluationPageProps) {
  const { sessionId } = await params;
  return <EvaluationClient sessionId={sessionId} />;
}
