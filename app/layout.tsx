import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuthForge | Zero Trust Dashboard",
  description: "Security-first AI agent governance platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${inter.className} min-h-screen h-full flex antialiased`}>
        <main className="flex-1 flex flex-col h-full bg-[#050505]">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}