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

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/imagekit-public", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load ImageKit config");
        }

        const data = (await res.json()) as ImageKitConfig;
        setImageKitConfig(data);
      } catch (error) {
        setConfigError("ImageKit configuration is unavailable");
        console.error("ImageKit config error:", error);
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

  if (!imageKitConfig && !configError) {
    return (
      <SessionProvider refetchInterval={5 * 60}>
        <NotificationProvider>{children}</NotificationProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
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
