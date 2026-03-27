import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './Translations';

type Locale = 'id' | 'en';

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocaleState] = useState<Locale>(
        (localStorage.getItem('brewtech_locale') as Locale) || 'id'
    );

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('brewtech_locale', newLocale);
    };

    const t = (key: string) => {
        return translations[locale][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
