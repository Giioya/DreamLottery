"use client";

import { Mail, MessageCircle, Send } from "lucide-react";
import { SiFacebook } from 'react-icons/si';
import { FaDiscord } from 'react-icons/fa'; // ← Agregado para ícono de Discord
import Link from "next/link";
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { useContext } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function SupportPage() {
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    return (
        <ProtectedRoute>
        <main
            className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/bg_support.jpg')",
            }}
        >
            <div className="bg-white/50 rounded-3xl shadow-xl p-10 m-10 max-w-lg w-full text-center space-y-6 px-4 mb-72">
                <h1 className="text-3xl font-bold text-black">{messages[language].support}</h1>
                <p className="text-gray-600 text-lg">
                    {messages[language].supportinfo}
                </p>

                <div className="flex flex-col gap-4 w-full items-center">

                    <Link
                        href=""
                        target="_blank"
                        className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-3 text-center text-base transition w-52 mx-auto"
                    >
                        <Send className="w-5 h-5" /> Telegram coming soon
                    </Link>

                    <Link
                        href=""
                        target="_blank"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-3 text-center text-base transition w-52 mx-auto"
                    >
                        <SiFacebook className="w-5 h-5" /> Facebook coming soon
                    </Link>

                    <Link
                        href=""
                        target="_blank"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-3 text-center text-base transition w-52 mx-auto"
                    >
                        <FaDiscord className="w-5 h-5" /> Discord coming soon
                    </Link>

                    <Link
                        href="mailto:dreamlott3ry@gmail.com"
                        className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-3 text-center text-base transition w-52 mx-auto"
                    >
                        <Mail className="w-5 h-5" /> {messages[language].email}
                    </Link>
                </div>
            </div>
        </main>
        </ProtectedRoute>
    );
}
