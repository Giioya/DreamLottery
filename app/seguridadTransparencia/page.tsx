"use client";

import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { messages } from "@/data/translations";
import { useContext } from "react";

export default function SeguridadTransparenciaPage() {
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    return (
        <main
            className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/bg_info.jpg')",
            }}
        >
            <div className="bg-white/50 rounded-3xl shadow-xl p-10 m-10 max-w-lg w-full text-center space-y-6 px-4 mb-72">
                <h1 className="text-3xl font-bold text-black">🔐 {messages[language].title9}</h1>

                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info34}
                </p>

                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info35}
                </p>

                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info36}
                </p>

                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info37}
                </p>

                <h2 className="text-2xl font-bold text-black pt-6">📜 {messages[language].title10}</h2>
                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info38}{" "}
                    <a
                        href="https://github.com/DreamLottery/dreamLotteryContract"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline"
                    >
                        https://github.com/DreamLottery/dreamLotteryContract
                    </a>
                </p>

                <h2 className="text-2xl font-bold text-black pt-6">🌍 {messages[language].title11}</h2>

                <div className="p-4 rounded-xl  text-left text-black text-base leading-relaxed space-y-2">
                    <p><strong>{messages[language].info39}</strong>{messages[language].info44}</p>
                    <p><strong>{messages[language].info40}</strong>{messages[language].info45}</p>
                    <p><strong>{messages[language].info41}</strong>{messages[language].info46}</p>
                    <p><strong>{messages[language].info42}</strong>{messages[language].info47}</p>
                    <p><strong>{messages[language].info43}</strong>{messages[language].info48}</p>
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