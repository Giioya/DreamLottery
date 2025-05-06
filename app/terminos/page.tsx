"use client";

import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { messages } from "@/data/translations";
import { useContext } from "react";

export default function TerminosYPrivacidadPage() {
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    return (
        <main
        className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/bg_info.jpg')" }}
        >
        <div className="bg-white/50 rounded-3xl shadow-xl p-10 m-10 max-w-3xl w-full text-center space-y-6 text-black px-6 mb-72">
            <h1 className="text-3xl font-bold">📜 {messages[language].title21}</h1>

            <h2 className="text-xl font-bold pt-4">{messages[language].title22}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info77}
            </p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title23}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info78}
            </p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title24}</h2>
            <ul className="list-disc list-inside text-left">
            <li>{messages[language].info79}</li>
            <li>{messages[language].info80}</li>
            <li>{messages[language].info81}</li>
            <li>{messages[language].info82}</li>
            </ul>
            <p className="text-justify leading-relaxed pt-2">
            {messages[language].info83}
            </p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title25}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info84}
            </p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title26}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info85}
            </p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title27}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info86}
            </p>
            <a
            href="https://worldscan.org/address/0x918EC10e58DC41955328E07eee449b1455910cb8#tokentxns"
            className="text-blue-700 underline"
            target="_blank"
            >
            {messages[language].info87}
            </a>


            <h2 className="text-xl font-bold pt-4">{messages[language].title28}</h2>
            <ul className="list-disc list-inside text-left">
            <li>{messages[language].info88}</li>
            <li>{messages[language].info89}</li>
            <li>{messages[language].info90}</li>
            </ul>

            <h2 className="text-xl font-bold pt-4">{messages[language].title29}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info91}
            </p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title30}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info92}
            </p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title31}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info93}
            </p>
            <p><strong>{messages[language].info94}</strong> {messages[language].info95}</p>

            <h2 className="text-xl font-bold pt-4">{messages[language].title32}</h2>
            <ul className="list-disc list-inside text-left">
            <li>{messages[language].info96}</li>
            <li>{messages[language].info97}</li>
            </ul>

            <h2 className="text-xl font-bold pt-4">{messages[language].title33}</h2>
            <p className="text-justify leading-relaxed">
            {messages[language].info98}
            </p>

            <h2 className="text-3xl font-bold pt-6">🔒 {messages[language].title34}</h2>

            <p className="text-justify leading-relaxed">
            {messages[language].info99}
            </p>

            <ul className="list-disc list-inside text-left">
            <li>{messages[language].info100}</li>
            <li>{messages[language].info101}</li>
            <li>{messages[language].info102}</li>
            </ul>

            <p className="text-justify leading-relaxed">
            {messages[language].info103}
            </p>

            <div className="pt-6">
            <a
                href="/info"
                className="inline-block bg-black text-white px-6 py-2 rounded-2xl hover:bg-gray-800 transition duration-300"
            >
                {messages[language].title8}
            </a>
            </div>
        </div>
        </main>
    );
}
