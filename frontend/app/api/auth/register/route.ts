import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  return NextResponse.json(
    {
      message: 'Register route ready for authentication integration.',
      user: { name, email },
      receivedPassword: Boolean(password)
    },
    { status: 201 }
  );
}
