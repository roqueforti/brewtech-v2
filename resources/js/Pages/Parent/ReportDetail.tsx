import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Star, Download, Medal, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

export default function ReportDetail({ auth, child, modules, progress, evaluations }: any) {
    const { t } = useLanguage();
    
    // Stats calculation
    const completedModules = progress.filter((p:any) => p.status === 'completed').length;
    const totalModules = modules.length || 1;
    const avgScore = progress.length > 0 
        ? Math.round(progress.reduce((acc:any, p:any) => acc + (p.post_test_score || 0), 0) / progress.length)
        : 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${t('rapor')} ${child.name}`} />

            <div className="py-8 max-w-5xl mx-auto space-y-8">
                {/* Back Link */}
                <Link href={route('parent.dashboard')} className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors bg-white px-5 py-2.5 border border-slate-200 rounded-full shadow-sm text-sm w-max group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t('kembali_dashboard')}
                </Link>

                {/* Profile Banner */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm ring-1 ring-slate-100">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-2xl uppercase shadow-sm border border-primary/20 shrink-0">
                            {child.name.substring(0, 2)}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                                {child.name}
                            </h2>
                            <p className="text-slate-500 font-medium">{child.school?.name} — {child.studentClass?.name}</p>
                        </div>
                    </div>

                    <a 
                        href={route('parent.report.download', { student_id: child.id })} 
                        className="flex items-center gap-2 bg-slate-900 text-white hover:bg-primary px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-slate-200 hover:shadow-primary/20 active:scale-95"
                    >
                        <Download size={18} /> {t('unduh_rapor')}
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Stats & Skills */}
                    <div className="space-y-8 lg:col-span-1">
                        <div className="bg-primary rounded-3xl p-8 shadow-xl shadow-primary/10 relative overflow-hidden ring-1 ring-primary/20">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-8">{t('ringkasan_akademik')}</h3>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <div className="text-5xl font-bold tracking-tight text-white">{completedModules}/{totalModules}</div>
                                    <div className="text-xs font-bold text-white/60 mt-2 uppercase tracking-widest">{t('modul_selesai')}</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold tracking-tight text-white">{avgScore}</div>
                                    <div className="text-xs font-bold text-white/60 mt-2 uppercase tracking-widest">{t('skor_kognitif')}</div>
                                </div>
                            </div>
                            <Medal size={160} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
                        </div>
                    </div>

                    {/* Right Column: Detailed Progress */}
                    <div className="space-y-8 lg:col-span-2">
                        
                        {/* Modules Progress */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm ring-1 ring-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                                <BookOpen className="text-primary" size={20} /> {t('histori_belajar')}
                            </h3>
                            
                            <div className="space-y-3">
                                {modules.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-medium">{t('belum_ada_modul_kelas')}</p>
                                    </div>
                                ) : (
                                    modules.map((mod:any, idx:number) => {
                                        const modProgress = progress.find((p:any) => p.module_id === mod.id);
                                        const isComplete = modProgress?.status === 'completed';
                                        
                                        return (
                                            <div key={mod.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-primary/20 transition-all gap-4 group">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-700 group-hover:text-primary transition-colors">{idx + 1}. {mod.title}</h4>
                                                    <div className="flex gap-4 mt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                        <span>Pre-test: {modProgress?.pre_test_score ?? '-'}</span>
                                                        <span>Post-test: {modProgress?.post_test_score ?? '-'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {isComplete && (
                                                        <a 
                                                            href={route('parent.certificate.module.download', { student: child.id, module: mod.id })}
                                                            className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm border border-primary/10"
                                                            title={t('unduh_sertifikat')}
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                    )}
                                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isComplete ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                        {isComplete ? t('lulus') : t('belum')}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Soft Skill Evaluations */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm ring-1 ring-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                                <Star className="text-amber-500" size={20} /> {t('evaluasi_praktik')}
                            </h3>
                            
                            <div className="space-y-4">
                                {evaluations.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-medium px-8">{t('belum_evaluasi_praktik')}</p>
                                    </div>
                                ) : (
                                    evaluations.map((ev:any) => (
                                        <div key={ev.id} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 relative overflow-hidden hover:bg-white hover:border-amber-200 transition-all group">
                                            <div className="relative z-10 flex flex-col gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 uppercase text-sm leading-tight group-hover:text-amber-600 transition-colors">{ev.criteria?.criteria_name || t('penilaian_umum')}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{ev.module?.title}</p>
                                                    </div>
                                                    <div className="bg-white px-4 py-2 rounded-xl font-bold text-primary shadow-sm border border-slate-100 group-hover:border-amber-100 transition-all">
                                                        {ev.score}/100
                                                    </div>
                                                </div>
                                                {ev.observation_notes && (
                                                    <div className="bg-white/80 p-4 rounded-xl border border-slate-100 text-sm font-medium text-slate-600 italic relative z-10 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all">
                                                        "{ev.observation_notes}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
