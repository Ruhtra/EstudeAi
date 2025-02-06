import type { Metadata, Viewport } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { auth } from "@/auth";
import App from "./app";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DNS_FRONT!),
  title: "EstudeAI • App",
  description:
    "Transforme sua jornada de aprendizado com nossa plataforma de estudos inovadora e interativa.",
  openGraph: {
    title: "EstudeAI • App",
    description:
      "Transforme sua jornada de aprendizado com nossa plataforma de estudos inovadora e interativa.",
    images: [
      {
        url: "/og-image.png",
        width: 1208,
        height: 266,
        alt: "EstudeAI Logo",
        type: "image/png",
      },
    ],
    siteName: "EstudeAI",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#e63946",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const sesion = await auth();
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={sesion}>
          <App>
            {children}
            <SpeedInsights />
          </App>
        </SessionProvider>
      </body>
    </html>
  );
}
