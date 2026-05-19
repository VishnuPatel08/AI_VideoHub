import { NextResponse } from "next/server";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

  if (!publicKey || !urlEndpoint) {
    console.error("ImageKit config error: Missing environment variables", {
      NEXT_PUBLIC_PUBLIC_KEY: publicKey ? "✓ Set" : "✗ Missing",
      NEXT_PUBLIC_URL_ENDPOINT: urlEndpoint ? "✓ Set" : "✗ Missing",
    });
    return NextResponse.json(
      { 
        error: "Missing public ImageKit environment variables",
        details: `NEXT_PUBLIC_PUBLIC_KEY: ${publicKey ? "set" : "missing"}, NEXT_PUBLIC_URL_ENDPOINT: ${urlEndpoint ? "set" : "missing"}`
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ publicKey, urlEndpoint });
}
