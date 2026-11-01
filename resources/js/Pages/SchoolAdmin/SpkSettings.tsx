import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Settings,
    AlertCircle,
    Sliders,
    CheckCircle,
    AlertTriangle,
    Save,
    Cpu,
    Sparkles,
    Check,
    RotateCcw,
    Scale,
    Layers,
    Info
} from 'lucide-react';

interface CriteriaItem {
    code: string;
    name: string;
    type: string;
    weight: number;
    description: string;
}

interface MethodItem {
    id: string;
    name: string;
    short: string;
    tagline: string;
    description: string;
}

interface Props {
    auth: any;
    schoolInfo: any;
    criteria: Record<string, CriteriaItem>;
    currentMethod: string;
    availableMethods: Record<string, MethodItem>;
}

export default function SpkSettings({
    auth,
    schoolInfo,
    criteria = {},
    currentMethod = 'saw',
    availableMethods = {}
}: Props) {
    // Initial weights map
    const initialCriteriaWeights: Record<string, number> = {};
    Object.keys(criteria).forEach((key) => {
        initialCriteriaWeights[key] = criteria[key]?.weight || 15;
    });

    const { data, setData, put, processing } = useForm({
        spk_method: schoolInfo?.spk_method || currentMethod || 'saw',
        spk_hard_skill_weight: schoolInfo?.spk_hard_skill_weight || 40,
        spk_soft_skill_weight: schoolInfo?.spk_soft_skill_weight || 60,
        spk_criteria_weights: schoolInfo?.spk_criteria_weights || initialCriteriaWeights,
    });

    const [activeTab, setActiveTab] = useState<'algorithm' | 'criteria'>('algorithm');

    // Total weights
    const totalMacro = (Number(data.spk_hard_skill_weight) || 0) + (Number(data.spk_soft_skill_weight) || 0);
    const isMacroValid = totalMacro === 100;

    const totalMicro = Object.values(data.spk_criteria_weights || {}).reduce(
        (sum: number, val: any) => sum + (Number(val) || 0),
        0
    );
    const isMicroValid = Math.round(totalMicro) === 100;

    const updateCriteriaWeight = (key: string, value: number) => {
        setData('spk_criteria_weights', {
            ...data.spk_criteria_weights,
            [key]: Math.max(0, Math.min(100, value)),
        });
    };

    const normalizeCriteriaTo100 = () => {
        if (totalMicro <= 0) return;
        const normalized: Record<string, number> = {};
        let currentSum = 0;
        const keys = Object.keys(data.spk_criteria_weights);

        keys.forEach((key, idx) => {
            if (idx === keys.length - 1) {
                normalized[key] = Math.max(0, 100 - currentSum);
            } else {
                const calculated = Math.round(((Number(data.spk_criteria_weights[key]) || 0) / totalMicro) * 100);
                normalized[key] = calculated;
                currentSum += calculated;
            }
        });

        setData('spk_criteria_weights', normalized);
    };

    const resetToDefaultCriteria = () => {
        const defaults: Record<string, number> = {
            c1_hardskill: 30,
            c2_discipline: 15,
            c3_cleanliness: 20,
            c4_teamwork: 15,
            c5_communication: 10,
            c6_initiative: 10,
        };
        setData('spk_criteria_weights', defaults);
    };

    const adjustMacroWeights = (amount: number) => {
        const newHard = Math.min(100, Math.max(0, data.spk_hard_skill_weight + amount));
        setData({
            ...data,
            spk_hard_skill_weight: newHard,
            spk_soft_skill_weight: 100 - newHard,
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('school.spk.update'), {
            preserveScroll: true,
            onSuccess: () => alert('Pengaturan SPK Multi-Kriteria berhasil disimpan!'),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Konfigurasi Algoritma SPK" />

            <div className="py-8 space-y-10 max-w-[1400px] mx-auto pb-24 px-4 sm:px-6">
                {/* PREMIUM HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/5 border border-secondary/10 rounded-2xl">
                            <Cpu size={14} className="text-secondary" />
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                                MCDM DECISION ENGINE CONFIG
                            </span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
                            PENGATURAN <span className="text-primary">ALGORITMA & BOBOT SPK</span>
                        </h2>
                        <p className="text-slate-500 text-base font-medium max-w-3xl">
                            Pilih model kalkulasi Multi-Criteria Decision Making (SAW, WP, atau TOPSIS) serta tentukan preferensi bobot kriteria untuk penilaian kesiapan kerja siswa inklusif.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-slate-50 border border-slate-200/80 rounded-[24px] p-6 flex items-center gap-6 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                                    Metode Aktif
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-sm font-black uppercase text-slate-800 tracking-wider">
                                        {data.spk_method?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-12">
                    {/* SECTION 1: PILIHAN ALGORITMA UTAMA */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 lg:p-10 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-600 italic">
                                    Langkah 1 &bull; Model Matematis
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mt-1">
                                    Pilih Algoritma <span className="text-primary italic">MCDM Utama</span>
                                </h3>
                            </div>
                            <span className="text-xs font-semibold text-slate-400">
                                Sistem secara otomatis mengkalkulasi matriks sesuai algoritma terpilih.
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card SAW */}
                            <div
                                onClick={() => setData('spk_method', 'saw')}
                                className={`cursor-pointer rounded-[32px] p-8 border-2 transition-all relative flex flex-col justify-between ${
                                    data.spk_method === 'saw'
                                        ? 'border-primary bg-primary/[0.03] shadow-xl shadow-primary/10 ring-4 ring-primary/10'
                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                                }`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-xl bg-cyan-100 text-cyan-700 text-[10px] font-black uppercase tracking-wider">
                                            Linear Additive
                                        </span>
                                        {data.spk_method === 'saw' && (
                                            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 uppercase italic">
                                        SAW <span className="text-slate-400 font-semibold text-xs block normal-case">Simple Additive Weighting</span>
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        Menormalisasi matriks keputusan ke skala 0-1, kemudian menghitung penjumlahan terbobot dari seluruh atribut kriteria.
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                                    <span>Formula:</span>
                                    <span className="font-bold text-slate-700">V_i = &Sigma; (w_j &times; r_ij)</span>
                                </div>
                            </div>

                            {/* Card WP */}
                            <div
                                onClick={() => setData('spk_method', 'wp')}
                                className={`cursor-pointer rounded-[32px] p-8 border-2 transition-all relative flex flex-col justify-between ${
                                    data.spk_method === 'wp'
                                        ? 'border-secondary bg-secondary/[0.03] shadow-xl shadow-secondary/10 ring-4 ring-secondary/10'
                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                                }`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-xl bg-pink-100 text-secondary text-[10px] font-black uppercase tracking-wider">
                                            Multiplicative Power
                                        </span>
                                        {data.spk_method === 'wp' && (
                                            <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shadow-md">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 uppercase italic">
                                        WP <span className="text-slate-400 font-semibold text-xs block normal-case">Weighted Product</span>
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        Menggunakan perkalian untuk menghubungkan rating atribut, di mana setiap atribut dipangkatkan dengan bobot kriteria terkait.
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                                    <span>Formula:</span>
                                    <span className="font-bold text-slate-700">S_i = &prod; (x_ij ^ w_j)</span>
                                </div>
                            </div>

                            {/* Card TOPSIS */}
                            <div
                                onClick={() => setData('spk_method', 'topsis')}
                                className={`cursor-pointer rounded-[32px] p-8 border-2 transition-all relative flex flex-col justify-between ${
                                    data.spk_method === 'topsis'
                                        ? 'border-purple-600 bg-purple-500/[0.03] shadow-xl shadow-purple-500/10 ring-4 ring-purple-500/10'
                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                                }`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider">
                                            Euclidean Distance
                                        </span>
                                        {data.spk_method === 'topsis' && (
                                            <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 uppercase italic">
                                        TOPSIS <span className="text-slate-400 font-semibold text-xs block normal-case">Technique for Order Preference</span>
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                        Memilih alternatif yang memiliki jarak terpendek dari Solusi Ideal Positif (A+) dan jarak terjauh dari Solusi Ideal Negatif (A-).
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                                    <span>Formula:</span>
                                    <span className="font-bold text-slate-700">C_i = D_i^- / (D_i^+ + D_i^-)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: BOBOT 6 KRITERIA VOKASI (C1 - C6) */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 lg:p-10 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary italic">
                                    Langkah 2 &bull; Detail Kriteria Vokasi
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mt-1">
                                    Bobot Spesifik <span className="text-secondary italic">6 Kriteria Vokasi (C1 - C6)</span>
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={resetToDefaultCriteria}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-all active:scale-95"
                                >
                                    <RotateCcw size={14} /> Reset Bobot Standar
                                </button>
                                <button
                                    type="button"
                                    onClick={normalizeCriteriaTo100}
                                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-2 transition-all active:scale-95 shadow-md"
                                >
                                    <Scale size={14} /> Normalkan Jadi 100%
                                </button>
                                <div className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 ${
                                    isMicroValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                    Total: {Math.round(totalMicro)}% {isMicroValid ? '(SEIMBANG)' : '(BELUM 100%)'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(criteria).map(([key, item]) => {
                                const val = data.spk_criteria_weights?.[key] !== undefined ? data.spk_criteria_weights[key] : item.weight;
                                return (
                                    <div key={key} className="bg-slate-50/70 border border-slate-100 rounded-3xl p-6 space-y-4 hover:border-slate-200 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-primary shadow-sm">
                                                    {item.code}
                                                </span>
                                                <div>
                                                    <h5 className="font-bold text-slate-900 text-sm">{item.name}</h5>
                                                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{item.type}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-primary italic">{val}%</span>
                                            </div>
                                        </div>

                                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                                            {item.description}
                                        </p>

                                        <div className="space-y-2 pt-2">
                                            <input
                                                type="range"
                                                min="1"
                                                max="60"
                                                step="1"
                                                value={val}
                                                onChange={(e) => updateCriteriaWeight(key, parseInt(e.target.value) || 0)}
                                                className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                                <span>1%</span>
                                                <span>60%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION 3: BOBOT MAKRO HARD SKILL VS SOFT SKILL */}
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8 lg:p-10 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 italic">
                                    Langkah 3 &bull; Rasio Makro
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mt-1">
                                    Rasio Makro <span className="text-slate-700 italic">Teknis (Hard) vs Sosial (Soft)</span>
                                </h3>
                            </div>
                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                                isMacroValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                                Total: {totalMacro}% {isMacroValid ? '(VALID)' : '(TIDAK SEIMBANG)'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Hard Skill */}
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center font-black">
                                            H
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 uppercase text-sm">Bobot Teknis (Hard Skill)</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Keahlian Mesin & Resep Seduh</p>
                                        </div>
                                    </div>
                                    <span className="text-3xl font-black text-cyan-600 italic">{data.spk_hard_skill_weight}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={data.spk_hard_skill_weight}
                                    onChange={(e) => {
                                        const h = parseInt(e.target.value) || 0;
                                        setData({ ...data, spk_hard_skill_weight: h, spk_soft_skill_weight: 100 - h });
                                    }}
                                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>

                            {/* Soft Skill */}
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-pink-100 text-secondary flex items-center justify-center font-black">
                                            S
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 uppercase text-sm">Bobot Sosial (Soft Skill)</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Disiplin, Etika & Kebersihan Bar</p>
                                        </div>
                                    </div>
                                    <span className="text-3xl font-black text-secondary italic">{data.spk_soft_skill_weight}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={data.spk_soft_skill_weight}
                                    onChange={(e) => {
                                        const s = parseInt(e.target.value) || 0;
                                        setData({ ...data, spk_soft_skill_weight: s, spk_hard_skill_weight: 100 - s });
                                    }}
                                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-pink-500"
                                />
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="h-10 bg-slate-100 rounded-2xl overflow-hidden flex border-2 border-white shadow-inner">
                            <div
                                className="h-full bg-cyan-500 transition-all flex items-center justify-center text-white font-black text-xs italic"
                                style={{ width: `${data.spk_hard_skill_weight}%` }}
                            >
                                {data.spk_hard_skill_weight > 10 && `Teknis: ${data.spk_hard_skill_weight}%`}
                            </div>
                            <div
                                className="h-full bg-pink-500 transition-all flex items-center justify-center text-white font-black text-xs italic"
                                style={{ width: `${data.spk_soft_skill_weight}%` }}
                            >
                                {data.spk_soft_skill_weight > 10 && `Sosial: ${data.spk_soft_skill_weight}%`}
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON BAR */}
                    <div className="bg-slate-900 rounded-[36px] p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <Sparkles size={24} className="text-primary" />
                            </div>
                            <div>
                                <h4 className="font-black text-base uppercase tracking-tight">
                                    Simpan Perubahan Engine SPK
                                </h4>
                                <p className="text-xs text-slate-400 font-medium">
                                    Perubahan metode dan bobot akan langsung diterapkan pada seluruh laporan perankingan siswa.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="h-16 px-10 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                        >
                            <Save size={18} className={processing ? 'animate-spin' : ''} />
                            SIMPAN KONFIGURASI ENGINE
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
