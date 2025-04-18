"use client";

import { Inter } from "next/font/google";
import "@/app/globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import NextAuthProvider from "@/components/next-auth-provider";
import ErudaProviderClient from "@/components/Eruda/ErudaProviderClient";
import Link from "next/link";
import LanguageSelector from "@/components/Idiomas";
import { messages } from "@/data/translations";
import LanguageProvider, { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { ReactNode, useContext } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NextAuthProvider>
          <ErudaProviderClient>
            <MiniKitProvider>
              <LanguageProvider>
                <LayoutContent>{children}</LayoutContent>
              </LanguageProvider>
            </MiniKitProvider>
          </ErudaProviderClient>
        </NextAuthProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: ReactNode }) {
  const { language } = useContext(LanguageContext);

  return (
    <>
      {/* Selector de idioma en la esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Contenido principal que respeta el footer */}
      <div className="flex-grow overflow-y-auto">{children}</div>

      {/* Footer fijo abajo */}
      <nav className="fixed bottom-0 left-0 w-screen h-16 bg-white shadow-md border-t border-gray-300 flex items-center justify-between px-2 text-gray-600 z-50">
        <Link href="/info" className="flex flex-col items-center text-xs hover:text-black transition duration-200 flex-1">
          <span className="text-lg">🔍</span>
          {messages[language].info}
        </Link>

        <Link href="/myLotteries" className="flex flex-col items-center justify-center text-xs text-center whitespace-normal break-words hover:text-black transition duration-200 flex-1">
          <span className="text-lg">🎟️</span>
          {messages[language].my_lotteries}
        </Link>

        <Link href="/" className="flex flex-col items-center text-xs text-blue-600 font-bold transition duration-200 flex-1">
          <span className="text-lg">🏠</span>
          {messages[language].home}
        </Link>

        <Link href="/support" className="flex flex-col items-center text-xs hover:text-black transition duration-200 flex-1">
          <span className="text-lg">🛠️</span>
          {messages[language].support}
        </Link>

        <Link href="/history" className="flex flex-col items-center text-xs hover:text-black transition duration-200 flex-1">
          <span className="text-lg">📜</span>
          {messages[language].history}
        </Link>
      </nav>
    </>
  );
}