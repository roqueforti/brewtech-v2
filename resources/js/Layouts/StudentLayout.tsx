import React from 'react';
import { Link } from '@inertiajs/react';
import { Coffee, Home, ArrowLeft, LogOut, Sparkles, Volume2 } from 'lucide-react';
import AccessibilityToolbar from '@/Components/AccessibilityToolbar';

export default function StudentLayout({ children, user }: any) {
    const playDinoRoar = () => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const text = `Rawrr! Semangat belajar barista, ${user?.name || 'teman kecil'}! Ayo seduh kopi yang lezat!`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.pitch = 1.2; // Slightly cheerful, cute pitch
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#ECFDF5] via-[#F0FDF4] to-[#FFFBEB] flex flex-col font-body text-slate-800 relative selection:bg-emerald-200">
            {/* Background Decorative Prehistoric Grass & Coffee Dots */}
            <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
                <div className="absolute top-10 left-5 text-4xl animate-bounce duration-1000">🌿</div>
                <div className="absolute top-40 right-10 text-3xl">☕</div>
                <div className="absolute bottom-20 left-12 text-4xl opacity-50">🦕</div>
                <div className="absolute bottom-32 right-16 text-3xl opacity-50">🌴</div>
                <div className="absolute top-1/2 left-1/3 text-2xl opacity-30">✨</div>
            </div>

            {/* Top Navigation */}
            <nav className="bg-white/90 backdrop-blur-md border-b-2 border-emerald-100 px-4 sm:px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/20 text-2xl transform hover:rotate-6 transition-transform cursor-pointer border-2 border-white">
                        🦖
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-display font-black text-xl text-slate-900 tracking-tight leading-none">
                                BREW<span className="text-emerald-500">DINO</span>
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border border-emerald-200">
                                JURASSIC VOKASI
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                            Petualangan Barista Cilik
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Dino Cheer Voice Button */}
                    <button
                        onClick={playDinoRoar}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                        title="Dengarkan Sapaan Dino"
                    >
                        <span className="text-base animate-pulse">🦕</span>
                        <span className="hidden sm:inline">Sapaan Dino!</span>
                    </button>

                    <div className="hidden sm:flex flex-col items-end pl-2">
                        <span className="text-sm font-black text-slate-900">{user?.name}</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={11} /> Barista Dino Muda
                        </span>
                    </div>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-slate-200/60 hover:border-rose-200"
                        title="Keluar Sesi"
                    >
                        <LogOut size={18} />
                    </Link>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow p-4 md:p-8 max-w-5xl mx-auto w-full pb-36 relative z-10">
                {children}
            </main>

            {/* Bottom Floating Navigation Bar */}
            <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur-xl border-2 border-emerald-100 p-2 rounded-3xl shadow-2xl z-50 flex gap-2">
                <Link
                    href={route('student.dashboard')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                        route().current('student.dashboard')
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 scale-102'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                >
                    <span className="text-lg">🗺️</span>
                    <span>Peta Petualangan</span>
                </Link>

                <button
                    onClick={() => window.history.back()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-slate-600 hover:bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border border-slate-200 shadow-sm active:scale-95"
                >
                    <ArrowLeft size={16} strokeWidth={3} />
                    <span>Kembali</span>
                </button>
            </footer>

            <AccessibilityToolbar />
        </div>
    );
}
