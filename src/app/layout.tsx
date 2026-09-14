import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmadhanXHeader from "@/components/SmadhanXHeader";
import SmadhanXFooter from "@/components/SmadhanXFooter";
import GoogleTranslate from "@/components/GoogleTranslate";
import DarkModeProvider from "@/components/DarkModeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmadhanX - Smart Public Grievance Redressal Portal",
  description: "SmadhanX Centralized Public Grievance Redress And Monitoring System.",
  icons: {
    icon: "/Images/favicon.ico",
    shortcut: "/Images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col pattern-honeycomb text-slate-900 dark:text-slate-100 dark:bg-slate-900 selection:bg-orange-100 selection:text-orange-900 dark:selection:bg-orange-900/30 dark:selection:text-orange-200`}
        suppressHydrationWarning
      >
        <DarkModeProvider>
          <GoogleTranslate />
          <SmadhanXHeader />
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
            {children}
          </main>
          <SmadhanXFooter />
        </DarkModeProvider>
      </body>
    </html>
  );
}
