"use client";

import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { messages } from "@/data/translations";
import { useContext } from "react";

export default function InfoPage() {
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    return (
        <main
            className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/bg_info.jpg')",
            }}
        >
            <div className="bg-white/50 rounded-3xl shadow-xl p-10 m-10 max-w-lg w-full text-center space-y-6 px-4 mb-72">
                <h1 className="text-3xl font-bold text-black">{messages[language].title}</h1>
                <p className="text-gray-600 text-lg text-justify leading-relaxed">
                    {messages[language].info1}
                    <br /><br />
                <h2 className="text-2xl font-bold text-black text-center">{messages[language].title2}</h2>
                    {messages[language].info2}
                    <br /><br />
                    {messages[language].info3}
                </p>
                <div className="p-4 rounded-xl text-left text-black text-base leading-relaxed space-y-2">
                    <p>{messages[language].info4}</p>
                    <p>{messages[language].info5}</p>
                    <p>{messages[language].info6}</p>
                    <p>{messages[language].info7}</p>
                </div>

                <div className="pt-4 flex flex-col items-center space-y-4">
                    <a
                        href="/comoJugar"
                        className="w-72 text-center bg-black text-white px-5 py-2 rounded-2xl hover:bg-gray-800 transition duration-300"
                    >
                        {messages[language].buttonInfo}
                    </a>
                    <a
                        href="/seguridadTransparencia"
                        className="w-72 text-center bg-black text-white px-5 py-2 rounded-2xl hover:bg-gray-800 transition duration-300"
                    >
                        {messages[language].buttonInfo2}
                    </a>
                    <a
                        href="/soporteAyuda"
                        className="w-72 text-center bg-black text-white px-5 py-2 rounded-2xl hover:bg-gray-800 transition duration-300"
                    >
                        {messages[language].buttonInfo3}
                    </a>
                    <a
                        href="/faq"
                        className="w-72 text-center bg-black text-white px-5 py-2 rounded-2xl hover:bg-gray-800 transition duration-300"
                    >
                        {messages[language].buttonInfo4}
                    </a>
                    <a
                        href="/terminos"
                        className="w-72 text-center bg-black text-white px-5 py-2 rounded-2xl hover:bg-gray-800 transition duration-300"
                    >
                        {messages[language].buttonInfo5}
                    </a>
                </div>
            </div>
        </main>
    );
}
