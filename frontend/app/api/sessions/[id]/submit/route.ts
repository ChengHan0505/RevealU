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
  const submission = await submitEvaluation(id, payload);

  if (submission.status === 'not-found') {
    return NextResponse.json({ message: 'Session not found.' }, { status: 404 });
  }

  if (submission.status === 'invalid-evaluator') {
    return NextResponse.json({ message: 'Choose a valid team member before submitting.' }, { status: 400 });
  }

  if (submission.status === 'duplicate') {
    return NextResponse.json(
      {
        message: 'This team member has already submitted an evaluation.',
        result: buildResult(submission.session)
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    message: 'Evaluation submitted.',
    result: buildResult(submission.session)
  });
}
