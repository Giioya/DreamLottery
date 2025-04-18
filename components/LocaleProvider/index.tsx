"use client"

import { useState, useEffect } from "react";

const LocaleProvider = ({ children, locale }: { children: React.ReactNode; locale: string }) => {
    const [messages, setMessages] = useState<Record<string, string>>({});

    useEffect(() => {
        import(`../../locales/${locale}.json`)
            .then((mod) => setMessages(mod.default))
            .catch(() => console.error("Error loading language file"));
    }, [locale]);

    return <>{children}</>;
};

export default LocaleProvider;