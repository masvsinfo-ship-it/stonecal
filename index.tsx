import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- Configuration & Translations ---
const Language = { BN: 'bn', EN: 'en' };
const Tab = { VOL: 'VOL', MUR: 'MUR', MET: 'MET', PCS: 'PCS', HIS: 'HIS', AI: 'AI' };

const translations = {
  [Language.BN]: {
    appName: 'পাথরের হিসাব', groupName: 'কারিনা গ্রুপ', calc: 'হিসাব করুন',
    length: 'দৈর্ঘ্য (মি)', width: 'প্রস্থ (মি)', thick: 'পুরুত্ব (সেমি)', pcs: 'পিস',
    murubba: 'মুরুব্বা', meter: 'মিটার', rateMur: 'দর (মুরুব্বা)', rateMet: 'দর (মিটার)',
    res: 'ফলাফল', tMur: 'মোট মুরুব্বা', tMet: 'মোট মিটার', tPcs: 'মোট পিস',
    pMur: 'মুরুব্বা দাম', pMet: 'মিটার দাম', tVol: 'মোট ভলিউম (m³)', 
    his: 'হিস্টোরি', empty: 'কোন তথ্য নেই', ask: 'জিজ্ঞাসা করুন'
  },
  [Language.EN]: {
    appName: 'Stone Calc', groupName: 'Carina Group', calc: 'Calculate',
    length: 'Length (m)', width: 'Width (m)', thick: 'Thickness (cm)', pcs: 'Pieces',
    murubba: 'Murubba', meter: 'Meter', rateMur: 'Rate (Murubba)', rateMet: 'Rate (Meter)',
    res: 'Result', tMur: 'Total Murubba', tMet: 'Total Meter', tPcs: 'Total Pieces',
    pMur: 'Price (Mur)', pMet: 'Price (Met)', tVol: 'Total Vol (m³)',
    his: 'History', empty: 'No Data', ask: 'Ask AI'
  }
};

// --- Main Application ---
const App = () => {
  const [lang, setLang] = useState(Language.BN);
  const [activeTab, setActiveTab] = useState(Tab.VOL);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('stone_history_v3') || '[]'));
  
  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('stone_history_v3', JSON.stringify(history));
  }, [history]);

  const addHistory = (type, results) => {
    const item = { id: Date.now(), time: new Date().toLocaleTimeString(), type, results };
    setHistory(prev => [item, ...prev].slice(0, 20));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <header className="bg-white px-6 pt-10 pb-4 border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00a651] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
              <span className="text-white text-xl">💎</span>
            </div>
            <div>
              <h1 className="text-[#1e293b] font-bold text-lg leading-tight">{t.appName}</h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">{t.groupName}</p>
            </div>
          </div>
          <button 
            onClick={() => setLang(lang === Language.BN ? Language.EN : Language.BN)}
            className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 font-bold text-xs text-slate-600"
          >
            {lang === Language.BN ? 'EN 🇺🇸' : 'BN 🇧🇩'}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-[95px] z-40 py-4 overflow-x-auto no-scrollbar">
        <div className="max-w-md mx-auto flex gap-3 px-4">
          {[
            { id: Tab.VOL, icon: '📐', label: t.tVol },
            { id: Tab.MUR, icon: '🧱', label: t.murubba },
            { id: Tab.MET, icon: '📏', label: t.meter },
            { id: Tab.AI, icon: '🤖', label: 'AI' },
            { id: Tab.HIS, icon: '📜', label: t.his }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-2xl font-bold text-xs transition-all ${
                activeTab === tab.id ? 'bg-[#00a651] text-white shadow-lg shadow-green-100 scale-105' : 'bg-white text-slate-400 border border-slate-100'
              }`}
            >
              <span>{tab.icon}</span> <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-md mx-auto p-5 space-y-6">
        {activeTab === Tab.VOL && <VolumeCalc t={t} onSave={addHistory} />}
        {activeTab === Tab.MUR && <MurubbaToPiece t={t} onSave={addHistory} />}
        {activeTab === Tab.MET && <MeterToPiece t={t} onSave={addHistory} />}
        {activeTab === Tab.AI && <GeminiAssistant t={t} lang={lang} />}
        {activeTab === Tab.HIS && <HistoryView t={t} history={history} setHistory={setHistory} />}
        
        {/* Dev Info */}
        <div className="mt-10 p-8 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm animate-fadeIn">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mb-4">Built by Billal with ❤️</p>
          <div className="flex justify-center gap-6">
            <a href="https://wa.me/8801735308795" className="w-12 h-12 bg-[#25d366] text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-green-100">W</a>
            <a href="https://fb.com/billal8795" className="w-12 h-12 bg-[#1877f2] text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-100">F</a>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-50 py-3 text-center z-50">
        <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Carina Group Stone Solution © 2024</p>
      </footer>
    </div>
  );
};

// --- Sub-Components ---

const VolumeCalc = ({ t, onSave }) => {
  const [val, setVal] = useState({ l: '1', w: '1', t: '3', p: '1', rM: '', rMet: '' });
  const [res, setRes] = useState(null);

  const calc = () => {
    const area = parseFloat(val.l) * parseFloat(val.w) * parseFloat(val.p);
    const result = {
      mur: area,
      met: parseFloat(val.l) * parseFloat(val.p),
      vol: area * (parseFloat(val.t) / 100),
      pM: val.rM ? area * parseFloat(val.rM) : null
    };
    setRes(result);
    onSave('ভলিউম', result);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="app-card p-6 grid grid-cols-2 gap-4">
        <Input label={t.length} val={val.l} onChange={v => setVal({...val, l: v})} />
        <Input label={t.width} val={val.w} onChange={v => setVal({...val, w: v})} />
        <Input label={t.thick} val={val.t} onChange={v => setVal({...val, t: v})} />
        <Input label={t.pcs} val={val.p} onChange={v => setVal({...val, p: v})} color="text-green-600" />
        <Input label={t.rateMur} val={val.rM} onChange={v => setVal({...val, rM: v})} placeholder="Optional" />
        <button onClick={calc} className="col-span-2 bg-[#00a651] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all mt-2">{t.calc}</button>
      </div>
      {res && <ResultView t={t} res={res} />}
    </div>
  );
};

const MurubbaToPiece = ({ t, onSave }) => {
  const [val, setVal] = useState({ l: '0.60', w: '0.30', m: '25' });
  const [res, setRes] = useState(null);
  const calc = () => {
    const pcs = Math.ceil(parseFloat(val.m) / (parseFloat(val.l) * parseFloat(val.w)));
    const result = { pcs, mur: parseFloat(val.m) };
    setRes(result);
    onSave('মুরুব্বা → পিস', result);
  };
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="app-card p-6 grid grid-cols-2 gap-4">
        <Input label={t.length} val={val.l} onChange={v => setVal({...val, l: v})} />
        <Input label={t.width} val={val.w} onChange={v => setVal({...val, w: v})} />
        <div className="col-span-2">
          <Input label={t.murubba} val={val.m} onChange={v => setVal({...val, m: v})} />
        </div>
        <button onClick={calc} className="col-span-2 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">{t.calc}</button>
      </div>
      {res && <div className="bg-[#00a651] text-white p-10 rounded-[40px] text-center shadow-xl shadow-green-50 animate-fadeIn">
        <p className="text-xs font-bold opacity-70 uppercase mb-2">{t.tPcs}</p>
        <h3 className="text-6xl font-black">{res.pcs}</h3>
      </div>}
    </div>
  );
};

const MeterToPiece = ({ t, onSave }) => {
  const [val, setVal] = useState({ l: '0.60', m: '25' });
  const [res, setRes] = useState(null);
  const calc = () => {
    const pcs = Math.ceil(parseFloat(val.m) / parseFloat(val.l));
    setRes(pcs);
    onSave('মিটার → পিস', { pcs });
  };
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="app-card p-6 grid grid-cols-2 gap-4">
        <Input label={t.length} val={val.l} onChange={v => setVal({...val, l: v})} />
        <Input label={t.meter} val={val.m} onChange={v => setVal({...val, m: v})} />
        <button onClick={calc} className="col-span-2 bg-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all">{t.calc}</button>
      </div>
      {res && <div className="bg-amber-600 text-white p-10 rounded-[40px] text-center shadow-xl shadow-amber-50 animate-fadeIn">
        <p className="text-xs font-bold opacity-70 uppercase mb-2">{t.tPcs}</p>
        <h3 className="text-6xl font-black">{res}</h3>
      </div>}
    </div>
  );
};

const GeminiAssistant = ({ t, lang }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const ask = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Stone business context. Lang: ${lang}. User asked: ${prompt}. Answer short.`,
      });
      setResponse(res.text);
    } catch (e) { setResponse('Error occurred.'); }
    setLoading(false);
  };
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="app-card p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🤖 AI Assistant</h3>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:border-blue-400" placeholder="পাথর নিয়ে প্রশ্ন করুন..." />
        <button onClick={ask} disabled={loading} className="w-full mt-3 bg-blue-600 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all disabled:opacity-50">{loading ? '...' : t.ask}</button>
      </div>
      {response && <div className="bg-white p-6 rounded-3xl border-l-4 border-blue-500 shadow-sm text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{response}</div>}
    </div>
  );
};

const HistoryView = ({ t, history, setHistory }) => (
  <div className="space-y-4 animate-fadeIn">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-slate-800">{t.his}</h3>
      {history.length > 0 && <button onClick={() => setHistory([])} className="text-[10px] font-bold text-red-500 uppercase">{t.empty}</button>}
    </div>
    {history.length === 0 ? <p className="text-center py-20 text-slate-300 font-bold">{t.empty}</p> : 
      history.map(item => (
        <div key={item.id} className="app-card p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{item.type}</span>
            <span className="text-[10px] text-slate-300">{item.time}</span>
          </div>
          <div className="text-sm font-bold text-slate-700">
            {item.results.pcs && <span>পিস: {item.results.pcs} | </span>}
            {item.results.mur && <span>মুরুব্বা: {item.results.mur.toFixed(2)}</span>}
          </div>
        </div>
      ))
    }
  </div>
);

// --- Helpers ---
const Input = ({ label, val, onChange, color = "text-slate-400", placeholder = "" }) => (
  <div className="space-y-1">
    <label className={`text-[10px] font-bold uppercase ${color}`}>{label}</label>
    <input type="number" value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-box w-full p-4" />
  </div>
);

const ResultView = ({ t, res }) => (
  <div className="grid grid-cols-2 gap-4 animate-fadeIn">
    <div className="bg-[#00a651] text-white p-6 rounded-3xl text-center shadow-lg shadow-green-50">
      <p className="text-[10px] font-bold opacity-70 uppercase">{t.tMur}</p>
      <h3 className="text-3xl font-black">{res.mur.toFixed(2)}</h3>
    </div>
    <div className="bg-white p-6 rounded-3xl text-center border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase">{t.tMet}</p>
      <h3 className="text-3xl font-black text-slate-700">{res.met.toFixed(2)}</h3>
    </div>
    {res.pM && <div className="col-span-2 bg-amber-500 text-white p-5 rounded-3xl text-center shadow-lg shadow-amber-50">
      <p className="text-[10px] font-bold opacity-80 uppercase">{t.pMur}</p>
      <h3 className="text-4xl font-black">{res.pM.toLocaleString()} ৳</h3>
    </div>}
    <div className="col-span-2 bg-slate-800 text-white p-3 rounded-2xl text-center text-xs">
      {t.tVol}: {res.vol.toFixed(3)} m³
    </div>
  </div>
);

// --- Render ---
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);