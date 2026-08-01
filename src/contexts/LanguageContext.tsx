import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import {
	Language,
	DEFAULT_LANGUAGE,
	translations,
} from "../i18n/translations";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = (): LanguageContextType => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};

const STORAGE_KEY = "allotracteur_language";

interface LanguageProviderProps {
	children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
}) => {
	const [language, setLanguageState] = useState<Language>(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
		if (stored && translations[stored]) return stored;
		return DEFAULT_LANGUAGE;
	});

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, language);
		document.documentElement.lang = language;
	}, [language]);

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
	};

	// Traduit une clé. Si la clé n'existe pas dans la langue active, on
	// retombe sur le français, puis sur la clé elle-même en dernier recours
	// (utile pendant qu'on étend progressivement les traductions à d'autres
	// pages du site).
	const t = (key: string): string => {
		return (
			translations[language]?.[key] ??
			translations[DEFAULT_LANGUAGE]?.[key] ??
			key
		);
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};