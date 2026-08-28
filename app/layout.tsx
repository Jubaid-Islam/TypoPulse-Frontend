import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TypePulse",
  description: "Typing speed game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${dmSans.variable} h-full antialiased`}
    >
      <body
        className={cn(
          "dm-sans min-h-full flex flex-col bg-background text-foreground",
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}