
import React, { useState } from 'react';
import { CalculatorTab, Language } from './types';
import { translations } from './translations';
import Header from './components/Header';
import VolumeCalculator from './components/VolumeCalculator';
import MurubbaToPiece from './components/MurubbaToPiece';
import MeterToPiece from './components/MeterToPiece';
import PieceToAll from './components/PieceToAll';
import GeminiAssistant from './components/GeminiAssistant';
import DeveloperInfo from './components/DeveloperInfo';
import History from './components/History';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.VOLUME);
  const [lang, setLang] = useState<Language>(Language.BN);

  const t = translations[lang];
  const isRTL = lang === Language.AR;

  const renderContent = () => {
    switch (activeTab) {
      case CalculatorTab.VOLUME:
        return <VolumeCalculator t={t} />;
      case CalculatorTab.MURUBBA_TO_PIECE:
        return <MurubbaToPiece t={t} />;
      case CalculatorTab.METER_TO_PIECE:
        return <MeterToPiece t={t} />;
      case CalculatorTab.PIECE_TO_ALL:
        return <PieceToAll t={t} />;
      case CalculatorTab.HISTORY:
        return <History t={t} />;
      case CalculatorTab.GEMINI_AI:
        return <GeminiAssistant t={t} lang={lang} />;
      default:
        return <VolumeCalculator t={t} />;
    }
  };

  const tabs = [
    { id: CalculatorTab.VOLUME, label: t.tabs.volume, icon: '📐' },
    { id: CalculatorTab.MURUBBA_TO_PIECE, label: t.tabs.murubba, icon: '🧱' },
    { id: CalculatorTab.METER_TO_PIECE, label: t.tabs.meter, icon: '📏' },
    { id: CalculatorTab.PIECE_TO_ALL, label: t.tabs.piece, icon: '🔢' },
    { id: CalculatorTab.HISTORY, label: t.tabs.history, icon: '📜' },
    { id: CalculatorTab.GEMINI_AI, label: t.tabs.ai, icon: '🤖' },
  ];

  return (
    <div className={`h-screen flex flex-col bg-[#f5f7fa] overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header currentLang={lang} onLangChange={setLang} t={t} />

      {/* Top Menu Bar for Tabs */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[105px] z-40">
        <div className="max-w-md mx-auto flex items-center justify-between overflow-x-auto no-scrollbar px-4 py-3 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-[#00a651] text-white shadow-lg shadow-green-100 scale-105' 
                  : 'bg-slate-50 text-slate-500 border border-slate-100'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow overflow-y-auto pb-10 pt-6 px-5 scroll-smooth no-scrollbar">
        <div className="max-w-md mx-auto animate-fadeIn">
          {renderContent()}
          
          {/* Developer Information Section */}
          <DeveloperInfo t={t} />
        </div>
      </main>

      <footer className="bg-white/30 backdrop-blur-sm py-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        Carina Group Stone Calculator © 2024
      </footer>
    </div>
  );
};

export default App;
