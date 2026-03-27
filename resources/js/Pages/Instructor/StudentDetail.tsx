import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { User, Activity, BookOpen, Star, AlertCircle, ArrowLeft, PenTool } from 'lucide-react';

export default function StudentDetail({ auth, student, progress, evaluations }: any) {
    const modules = student.student_class?.modules || [];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Profil ${student.name}`} />

            <div className="py-8 max-w-7xl mx-auto space-y-8">
                {/* Back Button */}
                <Link href={route('instructor.classes.index')} className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition-all bg-white px-5 py-2.5 border border-slate-100 rounded-xl shadow-sm text-xs w-max uppercase tracking-wider active:scale-95">
                    <ArrowLeft size={16} /> Kembali ke Kelas
                </Link>

                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 pointer-events-none opacity-50"></div>
                    
                    <div className="w-24 h-24 bg-emerald-500 text-white border border-emerald-400 rounded-2xl flex items-center justify-center text-3xl font-bold uppercase shadow-lg shadow-emerald-500/20 relative z-10 transition-transform hover:scale-105">
                        {student.name.substring(0, 2)}
                    </div>
                    <div className="relative z-10 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">{student.name}</h2>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="bg-slate-50 text-slate-500 font-bold text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider border border-slate-200 shadow-sm">
                                {student.school?.name || 'Sekolah Tidak Tersedia'}
                            </span>
                            <span className="bg-emerald-50 text-emerald-600 font-bold text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider border border-emerald-100 shadow-sm">
                                {student.disability_type || 'Disabilitas tidak ditentukan'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Modul & Progress */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <BookOpen size={14} className="text-emerald-500" /> Progress Belajar Modul
                        </h3>
                        
                        <div className="space-y-4">
                            {modules.length === 0 ? (
                                <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs text-center">
                                    Sekolah belum mengadopsi modul.
                                </div>
                            ) : (
                                modules.map((mod: any) => {
                                    const modProgress = progress.find((p: any) => p.module_id === mod.id);
                                    const isComplete = modProgress?.status === 'completed';
                                    const preScore = modProgress?.pre_test_score ?? '-';
                                    const postScore = modProgress?.post_test_score ?? '-';

                                    return (
                                        <div key={mod.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm group hover:border-emerald-500/20 transition-all">
                                            <div className="flex justify-between items-start mb-5">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-lg mb-1">{mod.title}</h4>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                        <Activity size={12} className="text-emerald-400" /> 
                                                        Pre: <span className="text-slate-600">{preScore}</span> | Post: <span className="text-slate-600">{postScore}</span>
                                                    </div>
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-slate-100 shadow-sm ${isComplete ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-400 opacity-60'}`}>
                                                    {isComplete ? 'Selesai' : 'Belajar'}
                                                </div>
                                            </div>
                                            
                                            <Link 
                                                href={route('instructor.evaluate.create', [student.id, mod.id])}
                                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-emerald-500 text-slate-600 hover:text-white border border-slate-200 hover:border-emerald-500 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-sm transition-all active:scale-95"
                                            >
                                                <PenTool size={14} /> Berikan Evaluasi Praktik
                                            </Link>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Riwayat Evaluasi Soft Skill */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <Star size={14} className="text-orange-400" /> Hasil Penilaian Soft Skill
                        </h3>
                        
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[300px]">
                            {evaluations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                    <AlertCircle size={40} className="mb-4 text-slate-200" />
                                    <p className="font-bold text-xs">Belum ada evaluasi praktik/soft skill.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {evaluations.map((ev: any) => (
                                        <div key={ev.id} className="p-5 border border-slate-100 rounded-3xl bg-white shadow-sm transition-all group hover:bg-slate-50/50">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-slate-700 leading-snug text-sm">
                                                        {ev.criteria?.criteria_name || 'Kriteria Bebas'}
                                                    </h5>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Modul: {ev.module?.title}</div>
                                                </div>
                                                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 font-bold text-orange-500 shadow-sm shrink-0 text-xs">
                                                    {ev.score} <span className="text-[10px] text-slate-300">/ 100</span>
                                                </div>
                                            </div>
                                            {ev.observation_notes && (
                                                <div className="mt-4 text-xs text-slate-500 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm italic font-semibold leading-relaxed">
                                                    "{ev.observation_notes}"
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
