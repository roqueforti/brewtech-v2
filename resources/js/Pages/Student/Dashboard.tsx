import React, { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    PlayCircle,
    Lock,
    Trophy,
    Star,
    Sparkles,
    Flame,
    Coffee,
    Award,
    Volume2,
    CheckCircle2,
    Compass,
    Footprints,
    Heart
} from 'lucide-react';

interface ModuleItem {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'available' | 'locked';
    is_locked: boolean;
    stage_name?: string;
    stage_dino?: string;
    stage_bg?: string;
    score?: number | null;
}

interface BadgeItem {
    id: string;
    name: string;
    title: string;
    icon: string;
    desc: string;
    unlocked: boolean;
}

interface Props {
    student: {
        name: string;
        avatar?: string;
    };
    modules: ModuleItem[];
    gamification?: {
        level: number;
        level_name: string;
        dino_avatar: string;
        xp: number;
        next_level_xp: number;
        dino_beans: number;
        streak_days: number;
        completed_count: number;
        total_modules: number;
        badges: BadgeItem[];
    };
}

export default function StudentDashboard({
    student,
    modules = [],
    gamification = {
        level: 2,
        level_name: 'Bayi T-Rex Peracik ☕',
        dino_avatar: '🦖',
        xp: 280,
        next_level_xp: 500,
        dino_beans: 120,
        streak_days: 3,
        completed_count: 1,
        total_modules: 4,
        badges: []
    }
}: Props) {
    // Companion Dinosaur Choices
    const companions = [
        { id: 'rexy', name: 'Rexy Crema', emoji: '🦖', color: 'from-emerald-400 to-teal-500', role: 'Ahli Mesin Espresso', quote: 'Rawrr! Ayo ekstraksi crema tebal hari ini!' },
        { id: 'bronto', name: 'Bronto Brew', emoji: '🦕', color: 'from-cyan-400 to-blue-500', role: 'Ahli Manual Pour-Over', quote: 'Sabar dan teliti, tuang air melingkar dengan lembut ya!' },
        { id: 'stego', name: 'Stego Latte', emoji: '🦎', color: 'from-pink-400 to-rose-500', role: 'Pelukis Foam Susu', quote: 'Busa susu yang halus membuat hati semua orang gembira!' },
        { id: 'tricera', name: 'Tricera Bar', emoji: '🦏', color: 'from-amber-400 to-orange-500', role: 'Penjaga Sanitasi Meja', quote: 'Barista juara selalu menjaga stasiun bar tetap higienis!' },
    ];

    const [selectedCompanion, setSelectedCompanion] = useState(companions[0]);
    const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

    const speakText = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.pitch = 1.25; // cute, friendly pitch
        window.speechSynthesis.speak(utterance);
    };

    const handleCompanionSelect = (comp: typeof companions[0]) => {
        setSelectedCompanion(comp);
        speakText(`Halo! Aku ${comp.name}. ${comp.quote}`);
    };

    const xpPercent = Math.min(100, Math.round((gamification.xp / (gamification.next_level_xp || 500)) * 100));

    return (
        <StudentLayout user={{ ...student, role: 'student' }}>
            <Head title="Petualangan Dino Barista" />

            <div className="space-y-8 max-w-4xl mx-auto">
                {/* 1. DINO HERO COMPANION BANNER */}
                <div className="bg-white rounded-[36px] p-6 sm:p-8 border-2 border-emerald-100 shadow-xl relative overflow-hidden">
                    {/* Background Pastel Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-100/60 via-teal-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-100/40 rounded-full -ml-12 -mb-12 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        {/* Dino Avatar Circle with animation */}
                        <div className="relative shrink-0">
                            <div className={`w-28 h-28 rounded-[32px] bg-gradient-to-br ${selectedCompanion.color} flex items-center justify-center text-5xl shadow-xl shadow-emerald-500/20 border-4 border-white transform hover:rotate-6 transition-all duration-300 animate-bounce cursor-pointer`}
                                onClick={() => speakText(selectedCompanion.quote)}
                                title="Klik untuk dengar suara Dino!"
                            >
                                {selectedCompanion.emoji}
                            </div>
                            <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-white">
                                LVL {gamification.level}
                            </span>
                        </div>

                        {/* Speech Bubble & Identity */}
                        <div className="flex-1 space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200">
                                <span>🐾</span>
                                <span>Teman Dino: {selectedCompanion.name} ({selectedCompanion.role})</span>
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                Rawrr! Halo, <span className="text-emerald-600">{student.name}</span>! 🦖☕
                            </h1>

                            {/* Dino Speech Bubble */}
                            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs font-bold text-emerald-950 flex items-start gap-2.5">
                                <span className="text-lg">💬</span>
                                <p className="italic">
                                    "{selectedCompanion.quote}"
                                </p>
                            </div>

                            {/* Gamification Stats Bar */}
                            <div className="grid grid-cols-3 gap-2 pt-1">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                                        <Sparkles size={12} className="text-amber-500" /> Skor XP
                                    </div>
                                    <span className="text-base font-black text-slate-800">{gamification.xp} XP</span>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                                        <span>☕</span> Biji Dino
                                    </div>
                                    <span className="text-base font-black text-emerald-600">{gamification.dino_beans} Biji</span>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                                        <Flame size={12} className="text-orange-500" /> Streak
                                    </div>
                                    <span className="text-base font-black text-orange-600">{gamification.streak_days} Hari</span>
                                </div>
                            </div>

                            {/* Level Progress Bar */}
                            <div className="space-y-1.5 pt-1">
                                <div className="flex justify-between text-[11px] font-black">
                                    <span className="text-emerald-800">{gamification.level_name}</span>
                                    <span className="text-slate-400">{xpPercent}% menuju Level {gamification.level + 1}</span>
                                </div>
                                <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 shadow-sm"
                                        style={{ width: `${xpPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DINO COMPANION SELECTOR */}
                <div className="bg-white rounded-[32px] p-6 border-2 border-emerald-100 shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🦕</span>
                            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">
                                Pilih Teman Petualang Dinomu
                            </h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Klik untuk ganti kawan seduh</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {companions.map((comp) => {
                            const isSelected = selectedCompanion.id === comp.id;
                            return (
                                <button
                                    key={comp.id}
                                    type="button"
                                    onClick={() => handleCompanionSelect(comp)}
                                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                                        isSelected
                                            ? 'border-emerald-500 bg-emerald-50/80 shadow-md scale-102 ring-2 ring-emerald-200'
                                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="text-3xl">{comp.emoji}</span>
                                    <div>
                                        <div className="font-black text-xs text-slate-800">{comp.name}</div>
                                        <div className="text-[9px] font-bold text-slate-400 mt-0.5">{comp.role}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. JURASSIC COFFEE ADVENTURE MAP (PETA PETUALANGAN) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🗺️</span>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                    Peta Petualangan <span className="text-emerald-600">Dino Kopi</span>
                                </h3>
                                <p className="text-xs font-bold text-slate-400">
                                    Selesaikan misi tahap demi tahap untuk menetaskan telur purba!
                                </p>
                            </div>
                        </div>

                        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black">
                            {gamification.completed_count} dari {gamification.total_modules} Misi Tuntas 🌴
                        </div>
                    </div>

                    {/* Adventure Trail Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {modules.map((mod, index) => {
                            const isLocked = mod.is_locked;
                            const isCompleted = mod.status === 'completed';
                            const isAvailable = !isLocked && !isCompleted;

                            // Stage theme icons
                            const stageIcons = ['🌿', '🌋', '🌊', '🏛️'];
                            const stageIcon = stageIcons[index % stageIcons.length];

                            return (
                                <div
                                    key={mod.id}
                                    className={`relative p-6 rounded-[32px] border-2 transition-all flex flex-col justify-between overflow-hidden ${
                                        isCompleted
                                            ? 'bg-white border-emerald-300 shadow-lg shadow-emerald-500/10'
                                            : isAvailable
                                            ? 'bg-white border-amber-300 shadow-xl shadow-amber-500/15 ring-4 ring-amber-100'
                                            : 'bg-slate-50/80 border-slate-200 opacity-60'
                                    }`}
                                >
                                    {/* Top Stage Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-inner border border-slate-200">
                                                {stageIcon}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                                                    Misi {index + 1} &bull; {mod.stage_name || `Zona Purba ${index + 1}`}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">
                                                    {isCompleted ? 'Misi Selesai' : isAvailable ? 'Misi Aktif' : 'Terkunci'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        {isCompleted && (
                                            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-300">
                                                <Star size={12} className="fill-amber-400 text-amber-500" /> LULUS
                                            </div>
                                        )}
                                        {isAvailable && (
                                            <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse border border-amber-300">
                                                <span>🦖</span> AYO MULAI!
                                            </div>
                                        )}
                                        {isLocked && (
                                            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center">
                                                <Lock size={14} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2 mb-6">
                                        <h4 className={`text-lg font-black leading-snug ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                                            {mod.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                                            {mod.description || 'Pelajari langkah-langkah meracik kopi dengan gembira bersama dino!'}
                                        </p>

                                        {isCompleted && mod.score !== null && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-800 mt-2">
                                                <span>🏆</span> Skor Kuis: {mod.score} Poin
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div>
                                        {!isLocked ? (
                                            <Link
                                                href={route('student.modules.play', mod.id)}
                                                className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                                                    isCompleted
                                                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/25 ring-2 ring-emerald-200'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <>
                                                        <span>🔄</span>
                                                        <span>Ulangi Pelajaran</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>🦖</span>
                                                        <span>Buka Petualangan Dino</span>
                                                    </>
                                                )}
                                            </Link>
                                        ) : (
                                            <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold text-center flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed">
                                                <span>🥚</span>
                                                <span>Selesaikan Misi Sebelumnya</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. DINO BADGE COLLECTION (KOLEKSI LENCANA TELUR PURBA) */}
                <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-emerald-100 shadow-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <span className="text-2xl">🥚</span>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                    Koleksi Lencana & Telur Dino
                                </h3>
                                <p className="text-xs font-bold text-slate-400">
                                    Lencana keberhasilan yang kamu peroleh selama belajar
                                </p>
                            </div>
                        </div>

                        <span className="text-xs font-black text-emerald-600">
                            {gamification.badges.filter(b => b.unlocked).length} / {gamification.badges.length} Terbuka
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {gamification.badges.map((badge) => {
                            return (
                                <div
                                    key={badge.id}
                                    onClick={() => setSelectedBadge(badge)}
                                    className={`p-4 rounded-3xl border-2 transition-all text-center cursor-pointer flex flex-col items-center justify-between ${
                                        badge.unlocked
                                            ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400 shadow-sm hover:scale-105'
                                            : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
                                    }`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm border border-slate-100 mb-2">
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <div className="font-black text-xs text-slate-900 leading-snug">{badge.name}</div>
                                        <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{badge.desc}</span>
                                    </div>
                                    <div className="mt-3">
                                        {badge.unlocked ? (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                                                TERBUKA 🦖
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 text-[9px] font-black uppercase">
                                                TERKUNCI 🔒
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MODAL BADGE DETAIL */}
                {selectedBadge && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-sm w-full text-center space-y-4 border-4 border-amber-200 shadow-2xl">
                            <div className="w-20 h-20 rounded-3xl bg-amber-100 text-5xl flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
                                {selectedBadge.icon}
                            </div>
                            <h4 className="text-xl font-black text-slate-900 uppercase">
                                {selectedBadge.name}
                            </h4>
                            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                                {selectedBadge.desc}
                            </p>
                            <div className="pt-2">
                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className="w-full py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-all"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
