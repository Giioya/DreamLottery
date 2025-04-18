"use client";
import { useState, useEffect, createContext, ReactNode } from "react";
import { messages } from "@/data/translations";

interface LanguageContextType {
    language: keyof typeof messages;
    setLanguage: (lang: keyof typeof messages) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => {},
});

export default function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<keyof typeof messages>("en");

    // Cargar el idioma desde localStorage al inicio
    useEffect(() => {
        const storedLanguage = localStorage.getItem("language") as keyof typeof messages;
        if (storedLanguage) {
            setLanguage(storedLanguage);
        }
    }, []);

    // Guardar en localStorage cuando cambie el idioma
    const changeLanguage = (lang: keyof typeof messages) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}