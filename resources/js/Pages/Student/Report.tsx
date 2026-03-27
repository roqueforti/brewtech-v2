import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { Trophy, Star, Medal, Award, CheckCircle } from 'lucide-react';

export default function Report({ progress, evaluations, modules, student }: any) {
    const completedModules = progress.filter((p:any) => p.status === 'completed').length;
    const totalModules = modules.length || 1;
    const avgScore = progress.length > 0 
        ? Math.round(progress.reduce((acc:any, p:any) => acc + (p.post_test_score || 0), 0) / progress.length)
        : 0;

    let titleText = "Pemula Kopi";
    let titleColor = "text-amber-500";
    if (completedModules > 2) { titleText = "Peracik Handal"; titleColor = "text-emerald-500"; }
    if (completedModules > 5) { titleText = "Master Barista"; titleColor = "text-primary"; }

    return (
        <StudentLayout user={{...student, role: 'student'}}>
            <Head title="Buku Rapor" />

            <div className="max-w-4xl mx-auto py-8 flex flex-col gap-10">
                {/* Profile & Stats Header */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 ring-1 ring-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 pointer-events-none opacity-50"></div>
                    <div className="w-24 h-24 bg-white rounded-2xl border border-slate-100 shadow-md flex items-center justify-center shrink-0 relative z-10 transition-transform hover:scale-105">
                        <Trophy size={48} className="text-primary" />
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
                        <div className="space-y-1">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Gelar Saat Ini</p>
                            <h1 className={`text-3xl font-bold ${titleColor}`}>{titleText}</h1>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <div className="bg-slate-50/50 border border-slate-100 px-5 py-3 rounded-2xl min-w-[120px] shadow-sm">
                                <span className="block text-2xl font-bold text-slate-900">{completedModules}/{totalModules}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modul Selesai</span>
                            </div>
                            <div className="bg-slate-50/50 border border-slate-100 px-5 py-3 rounded-2xl min-w-[120px] shadow-sm">
                                <span className="block text-2xl font-bold text-slate-900">{avgScore}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rata-rata Skor</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badge Collection */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 px-1">
                        <Medal size={20} className="text-yellow-500" /> Koleksi Lencana
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {modules.map((mod:any) => {
                            const isDone = progress.some((p:any) => p.module_id === mod.id && p.status === 'completed');
                            return (
                                <div key={mod.id} className={`flex flex-col items-center text-center p-5 rounded-3xl border transition-all ${isDone ? 'bg-white border-yellow-200 shadow-md shadow-yellow-500/5' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'}`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform ${isDone ? 'bg-yellow-50 text-yellow-500 border border-yellow-100 shadow-sm rotate-3' : 'bg-slate-200 text-slate-400'}`}>
                                        <Award size={28} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 leading-snug text-xs">{mod.title}</h3>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Soft Skill Evaluations */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 px-1">
                        <Star size={20} className="text-emerald-500" /> Catatan Pelatih
                    </h2>
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm ring-1 ring-slate-50">
                        {evaluations.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="font-bold text-slate-400">Belum ada evaluasi praktik.</p>
                                <p className="text-xs text-slate-300 mt-1">Terus semangat dan tunjukkan yang terbaik!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {evaluations.map((ev:any) => (
                                    <div key={ev.id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 relative overflow-hidden group hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                                        <div className="relative z-10 flex flex-col h-full justify-between">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-slate-900 line-clamp-1">{ev.criteria?.criteria_name || 'Penilaian Umum'}</h4>
                                                    <span className="bg-white text-emerald-600 font-bold px-2 py-1 rounded-lg border border-emerald-100 text-[10px] shadow-sm">
                                                        {ev.score} / 100
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider capitalize">{ev.module?.title}</p>
                                                </div>
                                                {ev.observation_notes && (
                                                    <p className="bg-white/50 p-3 rounded-xl text-slate-600 italic text-sm border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
                                                        "{ev.observation_notes}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

