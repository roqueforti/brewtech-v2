import React, { useState, useEffect } from 'react';
import { Eye, Type, Volume2, Sparkles, X, Sliders } from 'lucide-react';

export default function AccessibilityToolbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
    const [highContrast, setHighContrast] = useState(false);
    const [dyslexicSpacing, setDyslexicSpacing] = useState(false);

    // Load saved settings
    useEffect(() => {
        const savedFontSize = localStorage.getItem('brewtech_a11y_fontsize') as any;
        const savedContrast = localStorage.getItem('brewtech_a11y_contrast') === 'true';
        const savedDyslexic = localStorage.getItem('brewtech_a11y_dyslexic') === 'true';

        if (savedFontSize) setFontSize(savedFontSize);
        if (savedContrast) setHighContrast(savedContrast);
        if (savedDyslexic) setDyslexicSpacing(savedDyslexic);
    }, []);

    // Apply effects to document body
    useEffect(() => {
        const html = document.documentElement;

        // Font size
        if (fontSize === 'large') {
            html.style.fontSize = '110%';
        } else if (fontSize === 'xlarge') {
            html.style.fontSize = '120%';
        } else {
            html.style.fontSize = '100%';
        }
        localStorage.setItem('brewtech_a11y_fontsize', fontSize);

        // High contrast
        if (highContrast) {
            html.classList.add('high-contrast-mode');
        } else {
            html.classList.remove('high-contrast-mode');
        }
        localStorage.setItem('brewtech_a11y_contrast', String(highContrast));

        // Dyslexic spacing
        if (dyslexicSpacing) {
            html.classList.add('dyslexic-spacing-mode');
        } else {
            html.classList.remove('dyslexic-spacing-mode');
        }
        localStorage.setItem('brewtech_a11y_dyslexic', String(dyslexicSpacing));
    }, [fontSize, highContrast, dyslexicSpacing]);

    const playVoiceSample = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const text = 'Halo! Anda sedang menggunakan mode bantuan aksesibilitas BREWTECH. Platform pendidikan vokasi inklusif barista.';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const resetDefaults = () => {
        setFontSize('normal');
        setHighContrast(false);
        setDyslexicSpacing(false);
        document.documentElement.style.fontSize = '100%';
        document.documentElement.classList.remove('high-contrast-mode', 'dyslexic-spacing-mode');
        localStorage.removeItem('brewtech_a11y_fontsize');
        localStorage.removeItem('brewtech_a11y_contrast');
        localStorage.removeItem('brewtech_a11y_dyslexic');
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999] font-body">
            {/* Floating Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-white/40 text-xs font-bold tracking-wider"
                    title="Menu Aksesibilitas Inklusif (Ramah Disabilitas)"
                >
                    <span className="text-base">♿</span>
                    <span className="hidden sm:inline">Aksesibilitas</span>
                </button>
            )}

            {/* Accessibility Panel Modal */}
            {isOpen && (
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-6 w-80 sm:w-96 animate-in slide-in-from-bottom-5 duration-200 relative">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">♿</span>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 tracking-tight">Aksesibilitas Inklusif</h4>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Ramah Disabilitas & SLB</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* 1. Ukuran Teks */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                                <Type size={14} className="text-primary" /> Ukuran Teks
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFontSize('normal')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                        fontSize === 'normal'
                                            ? 'bg-primary text-white border-primary shadow-sm'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    Normal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFontSize('large')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                        fontSize === 'large'
                                            ? 'bg-primary text-white border-primary shadow-sm'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    Besar (A+)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFontSize('xlarge')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                        fontSize === 'xlarge'
                                            ? 'bg-primary text-white border-primary shadow-sm'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    Ekstra (A++)
                                </button>
                            </div>
                        </div>

                        {/* 2. Mode Kontras Tinggi */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-primary" />
                                <div>
                                    <span className="text-xs font-bold text-slate-800 block">Kontras Tinggi</span>
                                    <span className="text-[10px] text-slate-400">Untuk siswa low-vision</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={highContrast}
                                onChange={(e) => setHighContrast(e.target.checked)}
                                className="w-5 h-5 rounded-lg border-slate-300 text-primary focus:ring-primary"
                            />
                        </div>

                        {/* 3. Spasi Ramah Disleksia */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-secondary" />
                                <div>
                                    <span className="text-xs font-bold text-slate-800 block">Spasi Ramah Disleksia</span>
                                    <span className="text-[10px] text-slate-400">Peregangan huruf & kata</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={dyslexicSpacing}
                                onChange={(e) => setDyslexicSpacing(e.target.checked)}
                                className="w-5 h-5 rounded-lg border-slate-300 text-secondary focus:ring-secondary"
                            />
                        </div>

                        {/* 4. Asisten Suara TTS */}
                        <div>
                            <button
                                type="button"
                                onClick={playVoiceSample}
                                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Volume2 size={16} /> Uji Suara Bantuan (TTS Indonesia)
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 mt-5 border-t border-slate-100 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={resetDefaults}
                            className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                        >
                            Reset Semula
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

