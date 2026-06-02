import { NextResponse } from 'next/server';
import { connectDatabase } from '../../../../server/db';
import { createSession, toClientSession } from '../../../../server/session-service';

export async function POST(request: Request) {
  const { sessionName, teamMembers } = await request.json();
  const name = typeof sessionName === 'string' ? sessionName.trim() : '';
  const members = Array.isArray(teamMembers) ? teamMembers : [];

  if (!name || members.length === 0) {
    return NextResponse.json({ message: 'Session name and team members are required.' }, { status: 400 });
  }

  await connectDatabase();
  const session = await createSession(name, members).catch(() => null);

  if (!session) {
    return NextResponse.json({ message: 'At least one valid team member is required.' }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: 'Session created.',
      session: toClientSession(session)
    },
    { status: 201 }
  );
}
