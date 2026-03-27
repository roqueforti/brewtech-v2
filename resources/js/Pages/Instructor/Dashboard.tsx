import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Users, ClipboardCheck, ArrowRight } from 'lucide-react';

export default function Dashboard({ auth }: any) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Pelatih" />

            <div className="py-8 max-w-7xl mx-auto space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                            Halo, {auth.user.name.split(' ')[0]}! 👋
                        </h2>
                        <p className="text-slate-500 text-sm font-semibold">
                            Siap membimbing siswa hari ini? Pantau perkembangan kelas dan berikan evaluasi praktik.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold uppercase tracking-wider">Status: Aktif</span>
                    </div>
                </div>

                {/* Menu Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Kelas Saya */}
                    <Link href={route('instructor.classes.index')} className="group flex flex-col bg-white border border-slate-100 p-8 rounded-3xl shadow-sm transition-all relative overflow-hidden active:scale-[0.98]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                        
                        <div className="w-14 h-14 bg-primary/10 text-primary border border-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <Users size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Kelas Saya</h3>
                        <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed font-semibold">
                            Pantau daftar siswa, lihat progress belajar mandiri mereka di modul, dan manajemen kelas secara efisien.
                        </p>
                        <div className="flex items-center text-primary text-sm font-bold gap-2 group-hover:translate-x-1 transition-all">
                            Lihat Kelas <ArrowRight size={16} />
                        </div>
                    </Link>

                    {/* Evaluasi Praktik (Coming Soon) */}
                    <div className="flex flex-col bg-slate-50 border border-slate-100 p-8 rounded-3xl relative overflow-hidden group shadow-sm">
                        <div className="w-14 h-14 bg-slate-100 text-slate-400 border border-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <ClipboardCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Evaluasi Cepat</h3>
                        <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed font-semibold">
                            Pilih siswa dari kelas Anda untuk melakukan observasi kemampuan soft skill secara langsung.
                        </p>
                        <div className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-3 py-2 rounded-lg w-max uppercase tracking-wider shadow-sm">
                            Tersedia di Menu Kelas
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 flex items-center gap-5 shadow-sm">
                    <div className="w-12 h-12 bg-white text-primary rounded-2xl shadow-sm flex items-center justify-center shrink-0 text-2xl border border-slate-100">
                        💡
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-sm">Tips Hari Ini</p>
                        <p className="text-slate-500 text-sm mt-0.5 font-semibold leading-relaxed">
                            Berikan umpan balik spesifik kepada setiap siswa — komentar yang tepat meningkatkan motivasi belajar hingga <span className="text-primary font-bold">40%</span>.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}