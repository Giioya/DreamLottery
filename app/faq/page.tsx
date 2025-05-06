"use client";

import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { messages } from "@/data/translations";
import { useContext } from "react";

export default function FAQPage() {
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    return (
        <main
            className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/bg_info.jpg')",
            }}
        >
            <div className="bg-white/50 rounded-3xl shadow-xl p-10 m-10 max-w-lg w-full text-center space-y-6 px-4 mb-72">
                <h1 className="text-3xl font-bold text-black"> {messages[language].title15}</h1>

                <h2 className="text-xl font-bold text-black text-left">{messages[language].title16}</h2>

                <div className="p-4 rounded-xl text-left text-black text-base leading-relaxed space-y-2">
                    <p>{messages[language].info60}</p>
                    <p>{messages[language].info61}</p>
                    <p>{messages[language].info62}</p>
                    <p>{messages[language].info63}</p>
                </div>

                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info64}
                </p>

                <h2 className="text-xl font-bold text-black text-left">{messages[language].title17}</h2>
                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info65}
                </p>

                <h2 className="text-xl font-bold text-black text-left">{messages[language].title18}</h2>
                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info66}
                </p>

                <div className="p-4 rounded-xl text-left text-black text-base leading-relaxed space-y-2">
                    <p>{messages[language].info67}</p>
                    <p>{messages[language].info68}</p>
                </div>

                <h2 className="text-xl font-bold text-black text-left">{messages[language].title19}</h2>
                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                {messages[language].info69} <strong>{messages[language].info70}</strong>. {messages[language].info71}
                </p>

                <div className="p-4 rounded-xl text-left text-black text-base leading-relaxed space-y-2">
                    <p>{messages[language].info72}</p>
                    <p>{messages[language].info73}</p>
                    <p>{messages[language].info74}</p>
                </div>

                <h2 className="text-xl font-bold text-black text-left">{messages[language].title20}</h2>
                <p className="text-gray-700 text-lg text-justify leading-relaxed">
                    {messages[language].info75}
                    <br /><br />
                    {messages[language].info76}
                </p>

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