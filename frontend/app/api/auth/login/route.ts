import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password, remember } = await request.json();

  return NextResponse.json({
    message: 'Login route ready for authentication integration.',
    user: { email },
    remember: Boolean(remember),
    receivedPassword: Boolean(password)
  });
}
