import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Settings, AlertCircle, Sliders, CheckCircle, AlertTriangle, Save } from 'lucide-react';

export default function SpkSettings({ auth, schoolInfo }) {
    const { data, setData, put, processing } = useForm({
        spk_hard_skill_weight: schoolInfo?.spk_hard_skill_weight || 40,
        spk_soft_skill_weight: schoolInfo?.spk_soft_skill_weight || 60,
    });

    const totalWeight = data.spk_hard_skill_weight + data.spk_soft_skill_weight;
    const isValid = totalWeight === 100;

    const adjustWeights = (amount: number) => {
        const newHard = Math.min(100, Math.max(0, data.spk_hard_skill_weight + amount));
        setData({
            ...data,
            spk_hard_skill_weight: newHard,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        if (!confirm('Apakah Anda yakin ingin menyimpan pengaturan SPK ini?')) return;
        put(route('school.spk.update'), {
            onSuccess: () => alert('Pengaturan SPK berhasil diperbarui!'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Konfigurasi Algoritma SPK" />

            <div className="py-8 space-y-12 max-w-[1400px] mx-auto pb-24 px-4 sm:px-6">
                {/* PREMIUM HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/5 border border-secondary/10 rounded-2xl animate-fade-in">
                            <Settings size={14} className="text-secondary" />
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">ENGINE CONFIGURATION</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
                            PENGATURAN <span className="text-primary">BOBOT SPK</span>
                        </h2>
                        <p className="text-slate-400 text-base font-medium max-w-2xl">
                            Konfigurasi metrik kalkulasi untuk menentukan tingkat prioritas antara kompetensi teknis dan sosial.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex items-center gap-6 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Status Integritas</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className={`text-[10px] font-black uppercase ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                                        {isValid ? 'VALID (100%)' : `INVALID (${totalWeight}%)`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                    {/* LEFT SIDE: CONTROLS */}
                    <div className="xl:col-span-12">
                         <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40" />
                            
                            <form onSubmit={submit} className="relative z-10 space-y-16">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Hard Skill Section */}
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[28px] flex items-center justify-center shadow-xl group hover:rotate-6 transition-all">
                                                    <CheckCircle size={28} className="text-cyan-500" strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">BOBOT <span className="text-cyan-500 italic">TEKNIS</span></h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Keahlian Praktis (Hard Skill)</p>
                                                </div>
                                            </div>
                                            <div className="px-6 py-3 bg-cyan-50 border border-cyan-100 rounded-2xl">
                                                <span className="text-4xl font-black text-cyan-600 italic tracking-tighter">{data.spk_hard_skill_weight}%</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-10 space-y-8">
                                            <div className="flex items-center gap-6">
                                                <button type="button" onClick={() => adjustWeights(-5)} className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 hover:text-cyan-600 hover:border-cyan-200 transition-all active:scale-90 shadow-sm">-5</button>
                                                <div className="flex-1">
                                                    <input 
                                                        type="range" min="0" max="100" step="5"
                                                        value={data.spk_hard_skill_weight}
                                                        onChange={(e) => setData('spk_hard_skill_weight', parseInt(e.target.value))}
                                                        className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                                    />
                                                </div>
                                                <button type="button" onClick={() => adjustWeights(5)} className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 hover:text-cyan-600 hover:border-cyan-200 transition-all active:scale-90 shadow-sm">+5</button>
                                            </div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center italic">GESER SLIDER UNTUK PENYESUAIAN PERSENTASE</p>
                                        </div>
                                    </div>

                                    {/* Soft Skill Section */}
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-[28px] flex items-center justify-center shadow-xl group hover:-rotate-6 transition-all">
                                                    <CheckCircle size={28} className="text-secondary" strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">BOBOT <span className="text-secondary italic">SOSIAL</span></h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Keadaban & Perilaku (Soft Skill)</p>
                                                </div>
                                            </div>
                                            <div className="px-6 py-3 bg-pink-50 border border-pink-100 rounded-2xl">
                                                <span className="text-4xl font-black text-secondary italic tracking-tighter">{data.spk_soft_skill_weight}%</span>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-10 space-y-8">
                                            <div className="flex items-center gap-6">
                                                <button type="button" onClick={() => adjustWeights(5)} className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 hover:text-secondary hover:border-pink-200 transition-all active:scale-90 shadow-sm">-5</button>
                                                <div className="flex-1">
                                                    <input 
                                                        type="range" min="0" max="100" step="5"
                                                        value={data.spk_soft_skill_weight}
                                                        onChange={(e) => setData('spk_soft_skill_weight', parseInt(e.target.value))}
                                                        className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-pink-500"
                                                    />
                                                </div>
                                                <button type="button" onClick={() => adjustWeights(-5)} className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 hover:text-secondary hover:border-pink-200 transition-all active:scale-90 shadow-sm">+5</button>
                                            </div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center italic">GESER SLIDER UNTUK PENYESUAIAN PERSENTASE</p>
                                        </div>
                                    </div>
                                </div>

                                {/* VISUAL BAR */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] inline-flex items-center gap-3 italic">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-ping" /> INTEGRASI VISUAL KOMPETENSI
                                        </h4>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase">Teknis</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-pink-500" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase">Sosial</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="h-20 bg-slate-100 rounded-[28px] overflow-hidden flex border-4 border-white shadow-2xl relative">
                                        <div 
                                            className="h-full bg-cyan-500 transition-all duration-1000 flex items-center justify-center text-white font-black text-base italic shadow-inner"
                                            style={{ width: `${data.spk_hard_skill_weight}%` }}
                                        >
                                            {data.spk_hard_skill_weight > 15 && `${data.spk_hard_skill_weight}%`}
                                        </div>
                                        <div 
                                            className="h-full bg-pink-500 transition-all duration-1000 flex items-center justify-center text-white font-black text-base italic shadow-inner"
                                            style={{ width: `${data.spk_soft_skill_weight}%` }}
                                        >
                                            {data.spk_soft_skill_weight > 15 && `${data.spk_soft_skill_weight}%`}
                                        </div>
                                        {!isValid && (
                                            <div className="absolute inset-0 bg-red-600/10 backdrop-blur-[2px] flex items-center justify-center">
                                                <div className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                                    <AlertTriangle size={14} /> PERSENTASE TIDAK SEIMBANG: {totalWeight}%
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* FOOTER ACTIONS */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-12 border-t border-slate-50">
                                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-[24px]">
                                        <AlertCircle size={20} className="text-secondary" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest max-w-[400px]">Data akan diperbarui secara global dan mempengaruhi kalkulasi laporan rapor berikutnya.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || !isValid}
                                        className={`h-20 px-12 rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-4 transition-all active:scale-95 shadow-2xl ${
                                            isValid 
                                            ? 'bg-slate-900 text-white shadow-slate-900/40 hover:bg-primary' 
                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        <Save size={20} className={processing ? 'animate-spin' : ''} />
                                        SIMPAN CONFIGURATION
                                    </button>
                                </div>
                            </form>
                         </div>
                    </div>
                </div>

                {/* INFORMATION PROTOCOL */}
                <div className="bg-slate-900 rounded-[56px] p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-center shrink-0">
                            <Settings size={48} className="text-primary" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">PROTOKOL <span className="text-primary italic">SISTEM KEPUTUSAN</span></h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { icon: Sliders, text: 'Proporsi wajib 100%' },
                                    { icon: CheckCircle, text: 'Berlaku Global' },
                                    { icon: AlertCircle, text: 'Efek Instan' },
                                    { icon: Save, text: 'Back-up Otomatis' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon size={16} className="text-primary" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 4px solid currentColor;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    transition: all 0.2s;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}