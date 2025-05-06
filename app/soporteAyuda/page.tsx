"use client";

import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { messages } from "@/data/translations";
import { useContext } from "react";

export default function SoportePage() {
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    return (
        <main
            className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/bg_info.jpg')",
            }}
        >
            <div className="bg-white/50 rounded-3xl shadow-xl p-10 m-10 max-w-lg w-full text-center space-y-6 px-4 mb-72">
                <h1 className="text-3xl font-bold text-black">🧑‍💻 {messages[language].title12}</h1>

                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info49}
                    <br /><br />
                    {messages[language].info50}
                </p>

                <h2 className="text-2xl font-bold text-black pt-4">🤝 {messages[language].title13}</h2>

                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info51}
                </p>

                <ul className="text-gray-700 text-lg text-left leading-relaxed list-disc list-inside">
                    <li>📱 Discord </li>
                    <li>💬 {messages[language].info53}</li>
                    <li>📘 {messages[language].info54}</li>
                    <li>📧 {messages[language].info55}</li>
                </ul>

                <p className="text-gray-700 text-lg text-justify leading-relaxed pt-4">
                    {messages[language].info56}
                </p>

                <div className="border-t border-gray-400 pt-6">
                    <h3 className="text-xl font-semibold text-black">📍 {messages[language].title14}</h3>
                    <p className="text-gray-700 text-lg text-justify leading-relaxed">
                        {messages[language].info57} <strong>{messages[language].info58}</strong> {messages[language].info59}
                    </p>
                </div>

                <div className="pt-4 text-center">
                    <a
                        href="/info"
                        className="inline-block bg-black text-white px-5 py-2 rounded-2xl hover:bg-gray-800 transition duration-300"
                    >
                        {messages[language].title8}
                    </a>
                </div>
            </div>
        </main>
    );
}