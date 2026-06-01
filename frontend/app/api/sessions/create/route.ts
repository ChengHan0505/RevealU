import { NextResponse } from 'next/server';
import { connectDatabase } from '../../../../server/db';
import { createSession, toClientSession } from '../../../../server/session-service';

export async function POST(request: Request) {
  const { sessionName, teamMembers } = await request.json();

  await connectDatabase();
  const session = await createSession(sessionName, teamMembers);

  return NextResponse.json(
    {
      message: 'Session created.',
      session: toClientSession(session)
    },
    { status: 201 }
  );
}
