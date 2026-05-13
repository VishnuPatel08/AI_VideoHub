import { NextResponse } from "next/server";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    return NextResponse.json(
      { error: "Missing public ImageKit environment variables" },
      { status: 500 }
    );
  }

  return NextResponse.json({ publicKey, urlEndpoint });
}
