"use client";

import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "imagekitio-next";
import { useEffect, useState } from "react";
import { NotificationProvider } from "./Notification";

interface ImageKitConfig {
  publicKey: string;
  urlEndpoint: string;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [imageKitConfig, setImageKitConfig] = useState<ImageKitConfig | null>(
    null
  );
  const [configError, setConfigError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/imagekit-public", { cache: "no-store" });
        
        // Check response content type
        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await res.text();
          console.error("ImageKit API returned non-JSON response:", {
            status: res.status,
            contentType,
            text: text.substring(0, 200),
          });
          throw new Error(`ImageKit API error (${res.status}): Check server logs. Ensure env vars are set.`);
        }
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `ImageKit API returned ${res.status}`);
        }

        const data = (await res.json()) as ImageKitConfig;
        
        // Validate data
        if (!data.publicKey || !data.urlEndpoint) {
          throw new Error("ImageKit config missing publicKey or urlEndpoint");
        }
        
        setImageKitConfig(data);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "ImageKit configuration is unavailable";
        setConfigError(errorMsg);
        console.error("ImageKit config error:", {
          error: errorMsg,
          envCheck: {
            hasPublicKey: !!process.env.NEXT_PUBLIC_PUBLIC_KEY,
            hasUrlEndpoint: !!process.env.NEXT_PUBLIC_URL_ENDPOINT,
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const authenticator = async () => {
    try {
      const res = await fetch("/api/imagekit-auth");
      if (!res.ok) throw new Error("Failed to authenticate");
      return res.json();
    } catch (error) {
      console.error("ImageKit authentication error:", error);
      throw error;
    }
  };

  // Show error message while loading
  if (isLoading) {
    return (
      <SessionProvider refetchInterval={5 * 60}>
        <NotificationProvider>{children}</NotificationProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
        {configError && (
          <div style={{ padding: "20px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "4px", margin: "10px" }}>
            <strong>⚠️ ImageKit Configuration Error:</strong>
            <p>{configError}</p>
            <p style={{ fontSize: "12px", marginTop: "10px" }}>
              Check your .env.local file and set NEXT_PUBLIC_PUBLIC_KEY and NEXT_PUBLIC_URL_ENDPOINT. See README.md for details.
            </p>
          </div>
        )}
        {imageKitConfig ? (
          <ImageKitProvider
            publicKey={imageKitConfig.publicKey}
            urlEndpoint={imageKitConfig.urlEndpoint}
            authenticator={authenticator}
          >
            {children}
          </ImageKitProvider>
        ) : (
          children
        )}
      </NotificationProvider>
    </SessionProvider>
  );
}
