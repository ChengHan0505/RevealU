import { NextResponse } from 'next/server';
import { connectDatabase } from '../../../server/db';
import { listSessions, toClientSession } from '../../../server/session-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDatabase();
  const sessions = await listSessions();

  return NextResponse.json({ sessions: sessions.map(toClientSession) });
}
