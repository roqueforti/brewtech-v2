import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { PlayCircle, Lock, Trophy, Star } from 'lucide-react';

export default function StudentDashboard({ student, modules }: any) {
    return (
        <StudentLayout user={{...student, role: 'student'}}>
            <Head title="Peta Belajar" />
            
            <div className="max-w-4xl mx-auto py-8">
                {/* Header Profile */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center space-y-4 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="inline-block w-20 h-20 bg-primary/10 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-primary relative z-10">
                        {student.avatar}
                    </div>
                    <div className="space-y-1 relative z-10">
                        <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                            Halo, {student.name}! 👋
                        </h1>
                        <p className="text-slate-500 font-medium">Pilih petualangan belajarmu hari ini:</p>
                    </div>
                </div>

                {/* Grid Modul (Bento Style) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {modules.length === 0 ? (
                        <div className="col-span-full text-center bg-white p-12 rounded-3xl border border-slate-100 shadow-sm relative z-10">
                            <h3 className="text-xl font-semibold text-slate-400">Belum ada modul yang terbuka.</h3>
                        </div>
                    ) : (
                        modules.map((mod: any, index: number) => {
                            const isLocked = mod.is_locked;
                            const isCompleted = mod.status === 'completed';
                            const isAvailable = !isLocked && !isCompleted;
                            
                            // Styling Logic based on state
                            let cardStyle = "bg-white border border-slate-100 opacity-60 grayscale";
                            let iconBg = "bg-slate-100 text-slate-400";
                            let badge = null;
                            
                            if (isCompleted) {
                                cardStyle = "bg-white border border-green-100 shadow-lg shadow-green-500/5 ring-1 ring-green-50";
                                iconBg = "bg-green-500 text-white";
                                badge = (
                                    <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full font-bold text-[10px] shadow-sm flex items-center gap-1.5 z-20">
                                        <Star size={12} fill="currentColor"/> SELESAI
                                    </div>
                                );
                            } else if (isAvailable) {
                                cardStyle = "bg-white border border-primary/20 shadow-xl shadow-primary/10 ring-1 ring-primary/5 hover:-translate-y-1 transition-all cursor-pointer";
                                iconBg = "bg-primary text-white shadow-md shadow-primary/20";
                                badge = (
                                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-full font-bold text-[10px] shadow-sm animate-pulse z-20">
                                        SEDANG BELAJAR
                                    </div>
                                );
                            }

                            return (
                                <div key={mod.id} className={`flex flex-col p-6 rounded-3xl relative overflow-hidden group ${cardStyle}`}>
                                    {/* Icon Container */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconBg}`}>
                                            {isLocked ? <Lock size={24} /> : isCompleted ? <Trophy size={24} /> : <PlayCircle size={28} />}
                                        </div>
                                        {badge}
                                    </div>
                                    
                                    {/* Content Container */}
                                    <div className="flex-1 flex flex-col">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 block">Modul {index + 1}</span>
                                        <h3 className={`text-xl font-bold mb-3 leading-snug line-clamp-2 ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                                            {mod.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {mod.description || 'Pelajari langkah-langkah dasar pembuatan kopi.'}
                                        </p>
                                        
                                        {!isLocked && (
                                            <Link 
                                                href={route('student.modules.play', mod.id)}
                                                className={`w-full block text-center py-3.5 rounded-2xl font-bold transition-all mt-auto ${isCompleted ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95'}`}
                                            >
                                                {isCompleted ? 'Ulangi Materi' : 'Mulai Belajar'}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}