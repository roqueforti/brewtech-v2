import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { BookOpen, Plus, X, GraduationCap } from 'lucide-react';

export default function AdopsiModul({ auth, modules, classes }) {
    const [selectedModule, setSelectedModule] = useState(null);
    const form = useForm({
        class_id: '',
    });

    const assignModule = (module) => {
        setSelectedModule(module);
    };

    const submitAssign = (e) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin menugaskan modul ini ke kelas yang dipilih?')) return;
        form.post(route('school.curriculum.adopt', { module_id: selectedModule.id }), {
            onSuccess: () => {
                setSelectedModule(null);
                form.reset();
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Adopsi Modul Kurikulum" />

            <div className="py-8 space-y-12 max-w-[1400px] mx-auto pb-24 px-4 sm:px-6">
                {/* PREMIUM HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl animate-fade-in">
                            <BookOpen size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">CURRICULUM EXPANSION</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
                            ADOPSI <span className="text-secondary">MODUL AJAR</span>
                        </h2>
                        <p className="text-slate-400 text-base font-medium max-w-2xl">
                            Perluas kapabilitas instruksional sekolah Anda dengan mengintegrasikan modul pembelajaran tersertifikasi ke dalam kelas.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white border border-slate-100 rounded-[24px] px-8 py-4 flex items-center gap-6 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Katalog Tersedia</span>
                                <span className="text-xl font-black text-slate-900 italic">{modules.length} MODUL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODULE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            className="group relative bg-white rounded-[48px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                            
                            <div className="p-10 flex-1 flex flex-col">
                                <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-[28px] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-primary/20 transition-all shadow-sm">
                                    <BookOpen size={32} className="text-primary" strokeWidth={2.5} />
                                </div>
                                
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                                        {module.name}
                                    </h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-3 italic">
                                        {module.description}
                                    </p>
                                </div>

                                <div className="pt-10 mt-10 border-t border-slate-50">
                                    <button
                                        onClick={() => assignModule(module)}
                                        className="w-full h-16 bg-slate-900 text-white rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:bg-primary hover:shadow-primary/20 transition-all active:scale-95"
                                    >
                                        <Plus size={18} strokeWidth={3} /> PILIH MODUL INI
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {modules.length === 0 && (
                    <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl p-24 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <BookOpen size={48} className="text-slate-200" strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-300 uppercase italic tracking-tighter">KATALOG MODUL KOSONG</h3>
                        <p className="text-slate-400 font-medium text-[10px] uppercase tracking-[0.2em] mt-2">HUBUNGI ADMINISTRATOR PUSAT UNTUK PEMBARUAN KURIKULUM</p>
                    </div>
                )}

                {/* INFO SECTION */}
                <div className="bg-slate-900 rounded-[56px] p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center shrink-0">
                            <GraduationCap size={40} className="text-secondary" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">ALUR <span className="text-secondary italic">IMPLEMENTASI</span></h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 max-w-2xl leading-loose italic">
                                Memilih modul akan mengintegrasikan seluruh materi, tugas, dan parameter evaluasi SPK yang relevan ke dalam dasbor profil kelas yang dituju.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Assignment */}
            {selectedModule && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[56px] shadow-[0_0_100px_rgba(0,0,0,0.3)] max-w-xl w-full overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="bg-slate-50 border-b border-slate-100 px-12 py-10 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[30px] flex items-center justify-center shadow-xl">
                                    <GraduationCap size={32} className="text-primary" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">KONFIGURASI <span className="text-primary italic">ADOPTI</span></h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic truncate max-w-[200px]">{selectedModule.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedModule(null)}
                                className="w-14 h-14 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:text-red-500 transition-all active:scale-90 shadow-sm"
                            >
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={submitAssign} className="p-12 space-y-10">
                            <div className="space-y-6">
                                <label className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full" /> TARGET IMPLEMENTASI KELAS
                                </label>
                                <div className="relative">
                                    <select
                                        value={form.data.class_id}
                                        onChange={(e) => form.setData('class_id', e.target.value)}
                                        required
                                        className="w-full h-20 px-8 rounded-[28px] border-2 border-slate-100 shadow-sm font-black text-xs uppercase tracking-widest bg-slate-50 outline-none focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer italic pr-16"
                                    >
                                        <option value="">-- PILIH UNIT KELAS --</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.emoji_icon} {cls.name.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                        <Plus size={20} strokeWidth={3} rotate={45} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-50">
                                <button
                                    type="submit"
                                    disabled={form.processing || !form.data.class_id}
                                    className="h-18 px-10 bg-primary text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Plus size={18} strokeWidth={3} /> ADOPSI SEKARANG
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedModule(null)}
                                    className="h-18 px-10 bg-white text-slate-400 border-2 border-slate-100 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-50 active:scale-95"
                                >
                                    BATALKAN
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}