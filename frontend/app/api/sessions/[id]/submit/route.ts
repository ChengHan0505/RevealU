import { NextResponse } from 'next/server';
import { connectDatabase } from '../../../../../server/db';
import { buildResult, submitEvaluation } from '../../../../../server/session-service';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = await request.json();

  await connectDatabase();
  const session = await submitEvaluation(id, payload);

  if (!session) {
    return NextResponse.json({ message: 'Session not found.' }, { status: 404 });
  }

  return NextResponse.json({
    message: 'Evaluation submitted.',
    result: buildResult(session)
  });
}
