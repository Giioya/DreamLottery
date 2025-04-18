"use client";

import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";
import { messages } from "@/data/translations";
import { useContext } from "react";

export default function ComoJugarPage() {
    const { language } = useContext(LanguageContext) as { language: keyof typeof messages };

    return (
        <main className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center px-4"
            style={{
                backgroundImage: "url('/images/bg_info.jpg')",
            }}
        >
            <div className="bg-white/50 rounded-3xl  shadow-xl p-10 m-10 max-w-3xl w-full text-black space-y-10 mb-72">
                <h1 className="text-3xl font-bold text-black text-center">🔢 {messages[language].title3}</h1>
                <div className="space-y-4 text-lg text-justify leading-relaxed text-gray-800">
                    <p>{messages[language].info8}</p>
                    <p>{messages[language].info9}</p>
                    <p>{messages[language].info10}</p>

                    <div className="p-4 rounded-xl text-left text-black text-base leading-relaxed space-y-2">
                        <p>{messages[language].info11}</p>
                        <p>{messages[language].info12}</p>
                        <p>{messages[language].info13}</p>
                        <p>{messages[language].info14}</p>
                    </div>

                    <p>{messages[language].info15}</p>
                </div>

                {/* Tabla de tipos de lotería */}
                <section className="bg-black/80 text-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold flex text-center items-center gap-2 mb-4">
                        💎 {messages[language].title4}
                    </h2>
                    <p className="mb-4">{messages[language].info16}</p>
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-left">
                            <thead>
                                <tr className="border-b border-gray-600">
                                    <th className="py-2 px-3">{messages[language].tableInfo}</th>
                                    <th className="py-2 px-3">{messages[language].tableInfo2}</th>
                                    <th className="py-2 px-3">{messages[language].tableInfo3}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2 px-3">{messages[language].tableInfo4}</td>
                                    <td className="py-2 px-3">0.5 WLD</td>
                                    <td className="py-2 px-3">40 WLD</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">{messages[language].tableInfo5}</td>
                                    <td className="py-2 px-3">1 WLD</td>
                                    <td className="py-2 px-3">80 WLD</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">{messages[language].tableInfo6}</td>
                                    <td className="py-2 px-3">3 WLD</td>
                                    <td className="py-2 px-3">240 WLD</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">{messages[language].tableInfo7}</td>
                                    <td className="py-2 px-3">5 WLD</td>
                                    <td className="py-2 px-3">400 WLD</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3">{messages[language].tableInfo8}</td>
                                    <td className="py-2 px-3">10 WLD</td>
                                    <td className="py-2 px-3">800 WLD</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 italic text-orange-400">
                        🎁 {messages[language].info17}
                    </p>
                </section>

                <h2 className="text-2xl font-bold text-center text-black">🔐 {messages[language].title5}</h2>
                <div className="space-y-4 text-lg text-justify leading-relaxed text-gray-800">
                    <p>{messages[language].info18}</p>
                    <div className="p-4 rounded-xl text-left text-black text-base leading-relaxed space-y-2">
                        <p>{messages[language].info19}</p>
                        <p>{messages[language].info20}</p>
                        <p>{messages[language].info21}</p>
                    </div>
                    <p>{messages[language].info22}</p>
                </div>

                <h2 className="text-2xl font-bold text-center text-black">💵 {messages[language].title6}</h2>
                <div className="space-y-4 text-lg text-justify leading-relaxed text-gray-800">
                    <p>{messages[language].info23}</p>
                    <p>{messages[language].info24}</p>
                    <p>{messages[language].info25}</p>
                    <p>{messages[language].info26}</p>
                </div>

                <h2 className="text-2xl font-bold text-center text-black">🧾 {messages[language].title7}</h2>
                <div className="space-y-4 text-lg text-justify leading-relaxed text-gray-800">
                    <p>{messages[language].info27}</p>
                <div className="p-4 rounded-xl text-left text-black text-base leading-relaxed space-y-2">
                    <p>{messages[language].info29}</p>
                    <p>{messages[language].info30}</p>
                    <p>{messages[language].info31}</p>
                    <p>{messages[language].info32}</p>
                </div>
                    <p>{messages[language].info33}</p>
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