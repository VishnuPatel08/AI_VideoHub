import { NextResponse } from "next/server";
import ImageKit from "imagekit";

export async function GET() {
  try {
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error("ImageKit auth error: Missing environment variables", {
        NEXT_PUBLIC_PUBLIC_KEY: publicKey ? "✓ Set" : "✗ Missing",
        IMAGEKIT_PRIVATE_KEY: privateKey ? "✓ Set" : "✗ Missing",
        NEXT_PUBLIC_URL_ENDPOINT: urlEndpoint ? "✓ Set" : "✗ Missing",
      });
      return NextResponse.json(
        { 
          error: "Missing ImageKit environment variables",
          details: `publicKey: ${publicKey ? "set" : "missing"}, privateKey: ${privateKey ? "set" : "missing"}, urlEndpoint: ${urlEndpoint ? "set" : "missing"}`
        },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      {
        status: 500,
      }
    );
  }
}
