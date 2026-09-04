import type { Metadata } from "next";
import "./globals.css";
import CpgramsHeader from "@/components/CpgramsHeader";
import CpgramsFooter from "@/components/CpgramsFooter";

export const metadata: Metadata = {
  title: "CPGRAMS-Home",
  description: "CPGRAMS Public Grievance Portal of GoI.",
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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f4f6f9] text-slate-900 selection:bg-orange-100 selection:text-orange-900 font-sans">
        <CpgramsHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
          {children}
        </main>
        <CpgramsFooter />
      </body>
    </html>
  );
}
