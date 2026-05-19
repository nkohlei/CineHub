"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";
import React from "react";

export function Providers({ children, session }: { children: React.ReactNode, session?: any }) {
  return (
    <LanguageProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </LanguageProvider>
  );
}

