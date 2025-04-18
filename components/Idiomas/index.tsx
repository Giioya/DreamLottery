"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { messages } from "@/data/translations";
import { LanguageContext } from "@/components/Idiomas/LanguajeProvider";

export default function Idiomas() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language, setLanguage } = useContext(LanguageContext);
    const [showMenu, setShowMenu] = useState(false);

    const languages: { code: keyof typeof messages; flag: string }[] = [
        { code: "en",  flag: "🇺🇸" },
        { code: "es",  flag: "🇪🇸" },
        { code: "de",  flag: "🇩🇪" },
        { code: "ja",  flag: "🇯🇵" },
        { code: "ko",  flag: "🇰🇷" },
        { code: "fr",  flag: "🇫🇷" },
        { code: "pt",  flag: "🇵🇹" },
        { code: "hi",  flag: "🇮🇳" },
        { code: "zh",  flag: "🇨🇳" },
    ];

    useEffect(() => {
        const lang = searchParams.get("lang") as keyof typeof messages;
        if (messages[lang]) {
            setLanguage(lang);
        }
    }, [searchParams, setLanguage]);

    const changeLanguage = (lang: keyof typeof messages) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("lang", lang);
        router.push(`?${params.toString()}`);
        setLanguage(lang);
        setShowMenu(false);
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="px-4 py-2 text-white shadow-lg bg-white hover:bg-gray-500 flex items-center gap-2 rounded-2xl"
            >
                {/* 🌍 Bandera dinámica según idioma */}
                <span className="text-lg">
                {
                language === "en" ? "🇺🇸"  : 
                language === "es" ? "🇪🇸" : 
                language === "de" ? "🇩🇪"  :  
                language === "ja" ? "🇯🇵"  :  
                language === "ko" ? "🇰🇷"   : 
                language === "fr" ? "🇫🇷"  :  
                language === "pt" ? "🇵🇹"  :
                language === "hi" ? "🇮🇳"  :
                language === "zh" ? "🇨🇳"  :
                "🌍"}
                </span>
                
            </button>

            {showMenu && (
                <div className="absolute right-0 bg-yellow-50 mt-2 w-15 border rounded-2xl shadow-lg z-50">
                    {languages.map(({ code, flag }) => (
                        <button
                            key={code}
                            onClick={() => changeLanguage(code)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-200 flex items-center gap-2"
                        >
                            <span className="text-lg">{flag}</span> 
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
