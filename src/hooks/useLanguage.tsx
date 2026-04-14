import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = "English" | "Hindi" | "Hinglish (Hindi+English)" | "Telugu" | "Tamil" | "Punjabi" | "Marathi";

export const LANGUAGES: Language[] = [
  "English", "Hindi", "Hinglish (Hindi+English)", "Telugu", "Tamil", "Punjabi", "Marathi"
];

const TRANSLATIONS: Record<string, Record<string, string>> = {
  "Hindi": {
    "Dashboard": "डैशबोर्ड",
    "Learning Hub": "लर्निंग हब",
    "AI Mentor": "एआई मेंटर",
    "Smart Editor": "स्मार्ट एडिटर",
    "Dev Arena": "देव एरिना",
    "Logout": "लॉग आउट",
    "Search courses, topics, challenges...": "कोर्स, विषय, चुनौतियाँ खोजें...",
    "Select Subject": "विषय चुनें",
    "Generated instantly by Growtix AI": "Growtix AI द्वारा तुरंत उत्पन्न"
  },
  "Hinglish (Hindi+English)": {
    "Dashboard": "Dashboard",
    "Learning Hub": "Seekho Hub",
    "AI Mentor": "AI Mentor",
    "Smart Editor": "Smart Editor",
    "Dev Arena": "Dev Arena",
    "Logout": "Logout",
    "Search courses, topics, challenges...": "Courses, topics search karein...",
    "Select Subject": "Subject chunein",
    "Generated instantly by Growtix AI": "Growtix AI se turant generate kiya gaya"
  },
  "Telugu": {
    "Dashboard": "డాష్‌బోర్డ్",
    "Learning Hub": "లెర్నింగ్ హబ్",
    "AI Mentor": "AI మెంటర్",
    "Smart Editor": "స్మార్ట్ ఎడిటర్",
    "Dev Arena": "డెవ్ ఎరీనా",
    "Logout": "లాగ్ అవుట్",
    "Search courses, topics, challenges...": "కోర్సులు, అంశాలు వెతకండి...",
    "Select Subject": "అంశాన్ని ఎంచుకోండి",
    "Generated instantly by Growtix AI": "Growtix AI ద్వారా తక్షణమే రూపొందించబడింది"
  },
  "Tamil": {
    "Dashboard": "டாஷ்போர்டு",
    "Learning Hub": "கற்றல் மையம்",
    "AI Mentor": "AI வழிகாட்டி",
    "Smart Editor": "ஸ்மார்ட் எடிட்டர்",
    "Dev Arena": "தேவ் அரினா",
    "Logout": "வெளியேறு",
    "Search courses, topics, challenges...": "படிப்புகள், தலைப்புகள் தேடவும்...",
    "Select Subject": "தலைப்பைத் தேர்ந்தெடுக்கவும்",
    "Generated instantly by Growtix AI": "Growtix AI மூலம் உடனடியாக உருவாக்கப்பட்டது"
  },
  "Punjabi": {
    "Dashboard": "ਡੈਸ਼ਬੋਰਡ",
    "Learning Hub": "ਲਰਨਿੰਗ ਹੱਬ",
    "AI Mentor": "ਏਆਈ ਮੈਂਟਰ",
    "Smart Editor": "ਸਮਾਰਟ ਐਡੀਟਰ",
    "Dev Arena": "ਦੇਵ ਅਖਾੜਾ",
    "Logout": "ਲੌਗ ਆਉਟ",
    "Search courses, topics, challenges...": "ਕੋਰਸ, ਵਿਸ਼ੇ ਖੋਜੋ...",
    "Select Subject": "ਵਿਸ਼ਾ ਚੁਣੋ",
    "Generated instantly by Growtix AI": "Growtix AI ਦੁਆਰਾ ਤੁਰੰਤ ਤਿਆਰ ਕੀਤਾ ਗਿਆ"
  },
  "Marathi": {
    "Dashboard": "डॅशबोर्ड",
    "Learning Hub": "लर्निंग हब",
    "AI Mentor": "एआय मेंटॉर",
    "Smart Editor": "स्मार्ट एडिटर",
    "Dev Arena": "देव एरिना",
    "Logout": "लॉग आउट",
    "Search courses, topics, challenges...": "कोर्सेस, विषय शोधा...",
    "Select Subject": "विषय निवडा",
    "Generated instantly by Growtix AI": "Growtix AI द्वारे त्वरित व्युत्पन्न"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem('growtix_lang') as Language) || "English"
  );

  useEffect(() => {
    localStorage.setItem('growtix_lang', language);
  }, [language]);

  const t = (key: string) => {
    if (language === "English") return key;
    return TRANSLATIONS[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
