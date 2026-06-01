import { NextResponse } from 'next/server';
import { connectDatabase } from '../../../../../server/db';
import { buildResult, findSession } from '../../../../../server/session-service';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  await connectDatabase();
  const session = await findSession(id);

  if (!session) {
    return NextResponse.json({ message: 'Session not found.' }, { status: 404 });
  }

  return NextResponse.json({ result: buildResult(session) });
}
