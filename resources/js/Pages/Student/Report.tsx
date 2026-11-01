import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { Trophy, Star, Medal, Award, CheckCircle, Volume2, Sparkles, Heart, ChevronRight, Zap } from 'lucide-react';

const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
};

export default function Report({ progress, evaluations, modules, student }: any) {
    const completedModules = progress.filter((p: any) => p.status === 'completed').length;
    const totalModules = modules.length || 1;
    const avgScore = progress.length > 0 
        ? Math.round(progress.reduce((acc: any, p: any) => acc + (p.post_test_score || 0), 0) / progress.length)
        : 0;

    // Dino Ranks
    let dinoTitle = "Telur Dino Pemula 🥚";
    let dinoDesc = "Baru mulai menetas di Lembah Kopi Purba!";
    let dinoBadgeIcon = "🥚";
    let dinoGradient = "from-amber-400 to-orange-500";
    
    if (completedModules >= 1) {
        dinoTitle = "Bayi T-Rex Peracik ☕🦖";
        dinoDesc = "Sudah bisa mencium aroma kopi purba dan menghafal alat!";
        dinoBadgeIcon = "🦖";
        dinoGradient = "from-emerald-400 to-teal-500";
    }
    if (completedModules >= 3) {
        dinoTitle = "Raptor Seduh Cepat ⚡🦎";
        dinoDesc = "Cekatan, gesit, dan menguasai teknik seduhan!";
        dinoBadgeIcon = "⚡";
        dinoGradient = "from-blue-500 to-indigo-600";
    }
    if (completedModules >= 4 || (completedModules === totalModules && totalModules > 0)) {
        dinoTitle = "Master Baristasaurus 👑🦖";
        dinoDesc = "Raja Barista Purba! Siap melayani dan berkarya di industri!";
        dinoBadgeIcon = "👑";
        dinoGradient = "from-amber-500 via-yellow-400 to-emerald-600";
    }

    return (
        <StudentLayout user={{ ...student, role: 'student' }}>
            <Head title="Buku Rapor Dino Barista" />

            <div className="max-w-4xl mx-auto py-6 px-3 flex flex-col gap-8">
                
                {/* Hero Dino Rank Card */}
                <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border-2 border-emerald-500/40">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        {/* Dino Avatar Circle */}
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-6xl shadow-inner shrink-0 transform hover:scale-105 transition-transform duration-300">
                            {dinoBadgeIcon}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <div className="inline-flex items-center gap-2 bg-emerald-900/60 backdrop-blur-sm border border-emerald-400/30 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-widest">
                                <Sparkles size={12} /> Status Petualang Dino Vokasi
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-white">
                                {dinoTitle}
                            </h1>
                            <p className="text-emerald-100 text-sm md:text-base font-medium max-w-xl">
                                {dinoDesc}
                            </p>
                        </div>

                        {/* Quick Stats Pills */}
                        <div className="flex flex-row md:flex-col gap-3 shrink-0">
                            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-center min-w-[110px]">
                                <span className="block text-2xl font-black text-amber-300">{completedModules}/{totalModules}</span>
                                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Misi Selesai</span>
                            </div>
                            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl text-center min-w-[110px]">
                                <span className="block text-2xl font-black text-white">{avgScore}</span>
                                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Rata-rata Skor</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dino Badge Collection Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Medal size={22} className="text-amber-500" />
                            <span>Koleksi Lencana Fosil & Modul</span>
                        </h2>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            {completedModules} dari {totalModules} Terkoleksi
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {modules.map((mod: any, index: number) => {
                            const isDone = progress.some((p: any) => p.module_id === mod.id && p.status === 'completed');
                            const stageDino = index === 0 ? '🌿 🦖' : index === 1 ? '🌋 🦕' : index === 2 ? '🌊 🦎' : '🏛️ 👑';

                            return (
                                <div 
                                    key={mod.id} 
                                    className={`flex flex-col items-center text-center p-5 rounded-3xl border-2 transition-all ${
                                        isDone 
                                            ? 'bg-white border-emerald-300 shadow-md shadow-emerald-500/10 hover:scale-105' 
                                            : 'bg-slate-50 border-slate-200/80 opacity-60'
                                    }`}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-3xl transition-transform ${
                                        isDone 
                                            ? 'bg-gradient-to-tr from-emerald-100 to-amber-100 border-2 border-emerald-200 shadow-sm' 
                                            : 'bg-slate-200/80 border border-slate-300 grayscale'
                                    }`}>
                                        {isDone ? stageDino.split(' ')[1] : '🥚'}
                                    </div>
                                    <h3 className="font-black text-slate-800 leading-snug text-xs line-clamp-2">
                                        {mod.title}
                                    </h3>
                                    <span className={`text-[10px] font-bold mt-2 px-2.5 py-0.5 rounded-full ${
                                        isDone 
                                            ? 'bg-emerald-100 text-emerald-800 font-black' 
                                            : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        {isDone ? '✨ Terbuka' : 'Terkunci'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Trainer / Teacher Observational Notes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Star size={22} className="text-emerald-600 fill-emerald-600" />
                            <span>Catatan & Evaluasi Pelatih</span>
                        </h2>
                        <span className="text-xs text-slate-500 font-semibold">Observasi Aspek Vokasi</span>
                    </div>

                    <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 shadow-sm">
                        {evaluations.length === 0 ? (
                            <div className="text-center py-10 space-y-3">
                                <div className="text-4xl">🦖📝</div>
                                <p className="font-black text-slate-600 text-base">Belum ada evaluasi praktik langsung dari guru.</p>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    Lakukan simulasi atau praktik seduh di kelas agar guru dapat memberikan catatan bintang dan feedback!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {evaluations.map((ev: any) => (
                                    <div 
                                        key={ev.id} 
                                        className="bg-emerald-50/40 border-2 border-emerald-100 rounded-2xl p-5 relative overflow-hidden group hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex flex-col h-full justify-between space-y-3">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-black text-slate-900 text-sm">
                                                        {ev.criteria?.criteria_name || 'Penilaian Sikap & Keterampilan'}
                                                    </h4>
                                                    <span className="bg-emerald-600 text-white font-black px-2.5 py-1 rounded-xl text-xs shadow-sm">
                                                        {ev.score} / 100
                                                    </span>
                                                </div>
                                                <p className="text-emerald-700 font-bold text-[10px] uppercase tracking-wider">
                                                    {ev.module?.title || 'Praktik Barista'}
                                                </p>
                                            </div>

                                            {ev.observation_notes && (
                                                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                                                    <p className="text-slate-700 italic text-xs leading-relaxed flex-1">
                                                        "{ev.observation_notes}"
                                                    </p>
                                                    <button 
                                                        onClick={() => speak(ev.observation_notes)}
                                                        title="Dengarkan Catatan Guru"
                                                        className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-50 rounded-lg transition-colors shrink-0"
                                                    >
                                                        <Volume2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Back to Dashboard Adventure */}
                <div className="text-center pt-2">
                    <Link 
                        href={route('student.dashboard')}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-black text-base shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <span>Kembali ke Peta Dino</span>
                        <ChevronRight size={20} />
                    </Link>
                </div>

            </div>
        </StudentLayout>
    );
}
