import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, GraduationCap, ArrowRight, Award, Activity } from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

export default function Dashboard({ auth, children }: any) {
    const { t } = useLanguage();
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('beranda')} />

            <div className="py-8 max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                            {t('halo')}, {auth.user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {t('selamat_datang_parent')}
                        </p>
                    </div>
                </div>

                {/* Children List */}
                <div>
                    <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 text-sm">
                        <Users size={16} className="text-primary" /> {t('profil_anak')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {children.length === 0 ? (
                            <div className="col-span-full text-center bg-white border border-slate-100 p-12 rounded-3xl text-slate-400 shadow-sm relative overflow-hidden">
                                <Users size={48} className="mx-auto mb-4 opacity-40" />
                                <h4 className="text-base font-semibold">{t('belum_anak_daftar')}</h4>
                                <p className="text-sm mt-1">{t('hubungi_admin_parent')}</p>
                            </div>
                        ) : (
                            children.map((child: any) => (
                                <div key={child.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all group active:scale-[0.99] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                                    {/* Child Info */}
                                    <div className="flex items-center gap-4 mb-6 relative z-10">
                                        <div className="w-14 h-14 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center font-bold text-lg uppercase shrink-0 shadow-sm">
                                            {child.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{child.name}</h4>
                                            <p className="text-slate-500 text-[11px] font-semibold mt-0.5 tracking-tight">{child.school_name || t('belum_ada_sekolah')} — {child.class_name || t('belum_ada_kelas')}</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
                                        <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                <Activity size={12} /> {t('progress')}
                                            </div>
                                            <div className="text-xl font-bold text-slate-800">{child.progress_percentage}%</div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                                <div className="bg-primary h-1.5 rounded-full transition-all" style={{width: `${child.progress_percentage}%`}} />
                                            </div>
                                        </div>
                                        <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                                <Award size={12} /> {t('skor_rata')}
                                            </div>
                                            <div className="text-xl font-bold text-primary">{child.average_score}</div>
                                            <div className="text-[10px] text-slate-400 font-semibold mt-1">{t('tingkat_kognitif')}</div>
                                        </div>
                                    </div>

                                    <Link 
                                        href={route('parent.report.detail', { student_id: child.id })}
                                        className="w-full flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 relative z-10"
                                    >
                                        {t('lihat_rapor_detail')} <ArrowRight size={15} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}