import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, User, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

export default function MyClasses({ auth, classes }: any) {
    const { t } = useLanguage();
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Kelas Saya" />

            <div className="py-8 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{t('kelas_saya')}</h2>
                        <p className="text-slate-500 text-xs font-semibold">{t('pantau_siswa')}</p>
                    </div>
                </div>

                {/* Class List */}
                <div className="space-y-5">
                    {classes.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                            <Users size={48} className="mx-auto mb-4 opacity-40" />
                            <h3 className="text-base font-semibold">{t('belum_ada_kelas')}</h3>
                            <p className="text-sm mt-1">{t('kelas_tugaskan')}</p>
                        </div>
                    ) : (
                        classes.map((kelas: any) => (
                            <div key={kelas.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                                {/* Class Header */}
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                                    <div className="text-3xl drop-shadow-sm">{kelas.emoji_icon || '☕'}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 text-lg">{kelas.name}</h3>
                                        <div className="flex gap-4 text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
                                            <span className="flex items-center gap-1"><Users size={12}/> {kelas.students.length} {t('siswa')}</span>
                                            <span className="flex items-center gap-1"><BookOpen size={12}/> {kelas.modules.length} {t('modul')}</span>
                                        </div>
                                    </div>
                                    <Link 
                                        href={route('classes.show', kelas.id)}
                                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-primary/20 hover:bg-primary transition-all flex items-center gap-2"
                                    >
                                        {t('detail_evaluasi')} <ArrowRight size={14} />
                                    </Link>
                                </div>
                                
                                {/* Student List */}
                                <div className="p-6 bg-slate-50/50">
                                    <h4 className="text-[10px] font-bold text-slate-400 mb-4 flex items-center gap-1.5 uppercase tracking-widest">
                                        <User size={14} className="text-slate-300" /> {t('daftar_siswa')}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {kelas.students.length === 0 ? (
                                            <p className="text-sm text-slate-400 italic">{t('belum_ada_siswa')}</p>
                                        ) : (
                                            kelas.students.map((student: any) => {
                                                const classModuleIds = kelas.modules.map((m: any) => m.id);
                                                const completedInClass = student.module_progresses?.filter((p: any) => 
                                                    p.status === 'completed' && classModuleIds.includes(p.module_id)
                                                ).length || 0;
                                                const totalInClass = kelas.modules.length || 0;
                                                const progressPercentage = totalInClass > 0 ? Math.round((completedInClass / totalInClass) * 100) : 0;
                                                
                                                return (
                                                    <Link 
                                                        key={student.id} 
                                                        href={route('instructor.students.show', student.id)}
                                                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all group lg:last:hidden xl:last:flex active:scale-[0.98] hover:bg-slate-50/50"
                                                    >
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/10 rounded-lg flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                                                                 {student.name.substring(0, 2)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-bold text-slate-800 text-sm truncate group-hover:text-primary transition-colors">
                                                                    {student.name}
                                                                </h5>
                                                                <p className="text-[10px] text-slate-400 truncate mt-0.5 font-semibold">
                                                                    {student.disability_type || t('kategori_tidak_spesifik')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                                <span className="font-bold uppercase tracking-wider">{t('progress')}</span>
                                                                <span className="font-bold">{completedInClass} / {totalInClass} {t('modul')} ({progressPercentage}%)</span>
                                                            </div>
                                                                <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                                                                    <div className="bg-primary h-full rounded-full transition-all" style={{width: `${progressPercentage}%`}} />
                                                                </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
