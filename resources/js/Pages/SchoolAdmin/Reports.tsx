import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    FileText,
    Download,
    Printer,
    TrendingUp,
    Award,
    Users,
    Filter,
    BookOpen,
    PieChart as PieIcon,
    BarChart as BarIcon,
    Cpu,
    Calculator,
    Layers,
    Binary,
    CheckCircle2,
    X,
    Eye,
    ChevronRight,
    HelpCircle,
    Info,
    Sparkles
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface Props {
    auth: any;
    spkResults: any[];
    schoolInfo: any;
    spkAnalysis?: any;
    currentMethod?: string;
    availableMethods?: Record<string, string>;
}

export default function Reports({
    auth,
    spkResults = [],
    schoolInfo,
    spkAnalysis = {},
    currentMethod = 'saw',
    availableMethods = {
        saw: 'Simple Additive Weighting (SAW)',
        wp: 'Weighted Product (WP)',
        topsis: 'TOPSIS (Closeness to Ideal)',
    }
}: Props) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showMatrixModal, setShowMatrixModal] = useState(false);
    const [matrixTab, setMatrixTab] = useState<'matrixX' | 'matrixR' | 'vectors' | 'theory'>('matrixX');

    const activeMethodKey = currentMethod || spkAnalysis?.method || 'saw';
    const activeMethodName = spkAnalysis?.method_name || availableMethods[activeMethodKey] || 'SAW';
    const activeMethodDesc = spkAnalysis?.method_desc || 'Sistem Pendukung Keputusan Multi-Kriteria';

    const switchMethod = (method: string) => {
        router.get(
            route('school.reports.index'),
            { method },
            { preserveState: true, preserveScroll: true }
        );
    };

    const exportExcel = () => {
        window.location.href = route('school.reports.export', {
            format: 'excel',
            method: activeMethodKey,
        });
    };

    const exportPdf = () => {
        window.location.href = route('school.reports.export', {
            format: 'pdf',
            method: activeMethodKey,
        });
    };

    const printReport = () => {
        window.print();
    };

    const categories = [
        { id: 'all', label: 'Semua Kategori', color: 'bg-slate-100 text-slate-700' },
        { id: 'Siap Praktek Kerja (magang)', label: 'Siap Praktek Kerja (≥80)', color: 'bg-green-100 text-green-700' },
        { id: 'Perlu Pendampingan', label: 'Perlu Pendampingan (65-79)', color: 'bg-yellow-100 text-yellow-700' },
        { id: 'Perlu Pelatihan Lanjutan', label: 'Pelatihan Lanjutan (<65)', color: 'bg-red-100 text-red-700' },
    ];

    const filteredResults = selectedCategory === 'all'
        ? spkResults
        : spkResults.filter(result => result.kategori_spk === selectedCategory);

    // Pie Chart Data
    const pieData = [
        { name: 'Siap Praktek', value: spkResults.filter(r => (r.kategori_spk || '').includes('Siap') || (r.kategori_spk || '').includes('magang')).length, color: '#10B981' },
        { name: 'Pendampingan', value: spkResults.filter(r => (r.kategori_spk || '').includes('Pendampingan')).length, color: '#F59E0B' },
        { name: 'Lanjutan', value: spkResults.filter(r => (r.kategori_spk || '').includes('Lanjutan')).length, color: '#EF4444' },
    ].filter(d => d.value > 0);

    // Bar Chart Data (Averages)
    const avgHard = spkResults.reduce((acc, curr) => acc + (curr.hard_skill_score ?? curr.scores?.c1_hardskill ?? 0), 0) / (spkResults.length || 1);
    const avgSoft = spkResults.reduce((acc, curr) => acc + (curr.soft_skill_score ?? 0), 0) / (spkResults.length || 1);
    const avgFinal = spkResults.reduce((acc, curr) => acc + (curr.final_score ?? 0), 0) / (spkResults.length || 1);

    const barData = [
        { name: 'Teknis (Hard)', value: Number(avgHard.toFixed(1)), fill: '#0EA5E9' },
        { name: 'Sosial (Soft)', value: Number(avgSoft.toFixed(1)), fill: '#EC4899' },
        { name: 'Rata-rata Skor SPK', value: Number(avgFinal.toFixed(1)), fill: '#8B5CF6' },
    ];

    const matrices = spkAnalysis?.matrices || {};
    const criteriaList = spkAnalysis?.criteria || {};

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Laporan Analisis SPK (${activeMethodKey.toUpperCase()})`} />

            <div className="py-8 space-y-10 max-w-[1440px] mx-auto pb-24 px-4 sm:px-6">
                {/* HEADER SECTION */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl">
                            <Cpu size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                MCDM DECISION INTELLIGENCE
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
                            LAPORAN <span className="text-primary">ANALISIS SPK</span>
                        </h2>
                        <p className="text-slate-500 text-sm lg:text-base font-medium max-w-2xl">
                            Sistem pendukung keputusan multi-kriteria transparan untuk seleksi & rekomendasi penempatan magang barista siswa inklusif.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => setShowMatrixModal(true)}
                            className="h-14 px-6 bg-purple-50 text-purple-700 border border-purple-200 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-purple-100 transition-all flex items-center gap-2.5 active:scale-95 shadow-sm"
                        >
                            <Calculator size={18} /> MATRIKS ILMIAH
                        </button>
                        <button
                            onClick={printReport}
                            className="h-14 px-6 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-2.5 active:scale-95 shadow-sm"
                        >
                            <Printer size={18} /> CETAK
                        </button>
                        <button
                            onClick={exportPdf}
                            className="h-14 px-6 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-secondary/90 transition-all flex items-center gap-2.5 active:scale-95 shadow-lg shadow-secondary/20"
                        >
                            <FileText size={18} /> EXPORT PDF
                        </button>
                        <button
                            onClick={exportExcel}
                            className="h-14 px-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-2.5 active:scale-95 shadow-xl shadow-slate-900/20"
                        >
                            <Download size={18} /> EXPORT EXCEL
                        </button>
                    </div>
                </div>

                {/* ALGORITHM SWITCHER PILL BAR */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-4 lg:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-primary shadow-sm">
                            <Layers size={22} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Mode Algoritma Aktif
                            </span>
                            <h4 className="text-lg font-black text-slate-900 uppercase italic">
                                {activeMethodName}
                            </h4>
                        </div>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <button
                            onClick={() => switchMethod('saw')}
                            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                                activeMethodKey === 'saw'
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-102'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-cyan-300" />
                            SAW (Additive)
                        </button>

                        <button
                            onClick={() => switchMethod('wp')}
                            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                                activeMethodKey === 'wp'
                                    ? 'bg-secondary text-white shadow-md shadow-secondary/20 scale-102'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-pink-300" />
                            WP (Product)
                        </button>

                        <button
                            onClick={() => switchMethod('topsis')}
                            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                                activeMethodKey === 'topsis'
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 scale-102'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-purple-300" />
                            TOPSIS (Ideal)
                        </button>
                    </div>
                </div>

                {/* ANALYTICS CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Pie Chart Card */}
                    <div className="lg:col-span-5 bg-white rounded-[36px] p-8 border border-slate-100 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                                        Distribusi <span className="text-primary italic">Kelayakan</span>
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                        Klasifikasi Kesiapan Magang Kerja
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <PieIcon size={20} />
                                </div>
                            </div>

                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={65}
                                            outerRadius={95}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderRadius: '16px',
                                                border: '1px solid #f1f5f9',
                                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                        <Legend
                                            verticalAlign="bottom"
                                            iconType="circle"
                                            content={({ payload }) => (
                                                <div className="flex flex-wrap justify-center gap-4 mt-4">
                                                    {payload?.map((entry: any, index) => (
                                                        <div key={index} className="flex items-center gap-2">
                                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                            <span className="text-[10px] font-bold text-slate-600 uppercase">
                                                                {entry.value}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-semibold">
                            <span>Total Siswa: {spkResults.length}</span>
                            <span className="text-emerald-600 font-bold">
                                {spkResults.filter(r => (r.kategori_spk || '').includes('Siap') || (r.kategori_spk || '').includes('magang')).length} Siap Praktek
                            </span>
                        </div>
                    </div>

                    {/* Bar Chart Card */}
                    <div className="lg:col-span-7 bg-slate-900 rounded-[36px] p-8 shadow-2xl flex flex-col justify-between text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white">
                                        Rata-Rata <span className="text-primary italic">Kompetensi</span>
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                        Akumulasi Hard vs Soft vs Skor Akhir
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-white/10 text-primary flex items-center justify-center">
                                    <TrendingUp size={20} />
                                </div>
                            </div>

                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748b', fontSize: 10 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{
                                                backgroundColor: '#0f172a',
                                                borderRadius: '16px',
                                                border: '1px solid #334155',
                                                color: '#fff',
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[12, 12, 4, 4]} barSize={50}>
                                            {barData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="relative z-10 mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                            <span>Formula: {activeMethodKey.toUpperCase()}</span>
                            <span className="font-mono text-cyan-400">Index Scale: 0 - 100</span>
                        </div>
                    </div>
                </div>

                {/* FILTERS & MASTER TABLE */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm text-secondary">
                                <Filter size={20} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                                    Hasil Perankingan <span className="text-secondary italic">SPK Siswa</span>
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Peringkat Berbasis Nilai Preferensi Matematis ({activeMethodKey.toUpperCase()})
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`h-10 px-5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${
                                        selectedCategory === cat.id
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200/80">
                                        <th className="py-5 px-6 text-center text-[10px] font-black uppercase tracking-wider text-slate-400 w-16">
                                            Rank
                                        </th>
                                        <th className="py-5 px-6 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                            Nama Siswa & Disabilitas
                                        </th>
                                        <th className="py-5 px-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                            Kelas
                                        </th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-wider text-cyan-700 bg-cyan-50/50">
                                            C1: Teknis
                                        </th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                                            C2: Disiplin
                                        </th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                                            C3: Higienis
                                        </th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                                            C4: Tim
                                        </th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                                            C5: Relasi
                                        </th>
                                        <th className="py-5 px-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                                            C6: Inisiatif
                                        </th>
                                        <th className="py-5 px-6 text-center text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50/50">
                                            Skor SPK
                                        </th>
                                        <th className="py-5 px-6 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                                            Status Kelayakan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredResults.map((result, idx) => {
                                        const rank = result.rank || idx + 1;
                                        const st = result.student || {};
                                        const scores = result.scores || {};
                                        const c1 = scores.c1_hardskill ?? result.hard_skill_score ?? 0;
                                        const c2 = scores.c2_discipline ?? 0;
                                        const c3 = scores.c3_cleanliness ?? 0;
                                        const c4 = scores.c4_teamwork ?? 0;
                                        const c5 = scores.c5_communication ?? 0;
                                        const c6 = scores.c6_initiative ?? 0;

                                        return (
                                            <tr key={result.id || idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-5 px-6 text-center">
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-black text-xs ${
                                                        rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                                        rank === 2 ? 'bg-slate-200 text-slate-800' :
                                                        rank === 3 ? 'bg-orange-100 text-orange-800' :
                                                        'bg-slate-50 text-slate-600'
                                                    }`}>
                                                        #{rank}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div>
                                                        <h5 className="font-black text-slate-900 text-sm uppercase">
                                                            {st.name || '-'}
                                                        </h5>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                            {st.disability_type || 'Umum'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-4 text-xs font-semibold text-slate-600">
                                                    {st.class?.name || '-'}
                                                </td>
                                                <td className="py-5 px-4 text-center font-black text-cyan-600 bg-cyan-50/30 text-xs">
                                                    {Number(c1).toFixed(1)}
                                                </td>
                                                <td className="py-5 px-4 text-center text-xs font-semibold text-slate-600">
                                                    {Number(c2).toFixed(1)}
                                                </td>
                                                <td className="py-5 px-4 text-center text-xs font-semibold text-slate-600">
                                                    {Number(c3).toFixed(1)}
                                                </td>
                                                <td className="py-5 px-4 text-center text-xs font-semibold text-slate-600">
                                                    {Number(c4).toFixed(1)}
                                                </td>
                                                <td className="py-5 px-4 text-center text-xs font-semibold text-slate-600">
                                                    {Number(c5).toFixed(1)}
                                                </td>
                                                <td className="py-5 px-4 text-center text-xs font-semibold text-slate-600">
                                                    {Number(c6).toFixed(1)}
                                                </td>
                                                <td className="py-5 px-6 text-center bg-purple-50/30">
                                                    <span className="text-base font-black text-purple-700 italic">
                                                        {Number(result.final_score).toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 text-center">
                                                    <span className={`inline-flex px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider ${
                                                        (result.kategori_spk || '').includes('Siap') || (result.kategori_spk || '').includes('magang')
                                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                            : (result.kategori_spk || '').includes('Pendampingan')
                                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                            : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                        {result.kategori_spk || '-'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredResults.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="py-16 text-center text-slate-400">
                                                <p className="font-bold text-sm">Tidak ada data siswa pada filter ini.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* MODAL / DRAWER MATRIKS ILMIAH SPK */}
                {showMatrixModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-[36px] max-w-5xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100">
                            {/* Modal Header */}
                            <div className="p-6 lg:p-8 bg-slate-900 text-white flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                                        <Calculator size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase italic tracking-tight">
                                            Transparansi Matriks Matematis &bull; {activeMethodName}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium">
                                            Rincian matriks keputusan, faktor normalisasi, dan kalkulasi nilai preferensi SPK.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowMatrixModal(false)}
                                    className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Navigation Tabs */}
                            <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-200 overflow-x-auto">
                                <button
                                    onClick={() => setMatrixTab('matrixX')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                        matrixTab === 'matrixX' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                >
                                    1. Matriks Keputusan (X)
                                </button>
                                <button
                                    onClick={() => setMatrixTab('matrixR')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                        matrixTab === 'matrixR' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                >
                                    2. Matriks Normalisasi ({activeMethodKey === 'topsis' ? 'Y Terbobot' : 'R'})
                                </button>
                                <button
                                    onClick={() => setMatrixTab('vectors')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                        matrixTab === 'vectors' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                >
                                    3. Vektor Preferensi & Solusi
                                </button>
                                <button
                                    onClick={() => setMatrixTab('theory')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                        matrixTab === 'theory' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
                                    }`}
                                >
                                    4. Formulasi Teori
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 lg:p-8 overflow-y-auto space-y-6 flex-1">
                                {matrixTab === 'matrixX' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-black text-slate-800 uppercase text-sm">
                                                Matriks Keputusan Asal (X)
                                            </h4>
                                            <span className="text-xs text-slate-500">Nilai riil siswa pada kriteria C1 s/d C6</span>
                                        </div>
                                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                                            <table className="w-full text-xs">
                                                <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                                                    <tr>
                                                        <th className="p-3 text-left">Alternatif / Siswa</th>
                                                        <th className="p-3 text-center">C1 (Teknis)</th>
                                                        <th className="p-3 text-center">C2 (Disiplin)</th>
                                                        <th className="p-3 text-center">C3 (Higienis)</th>
                                                        <th className="p-3 text-center">C4 (Tim)</th>
                                                        <th className="p-3 text-center">C5 (Komunikasi)</th>
                                                        <th className="p-3 text-center">C6 (Inisiatif)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {spkResults.slice(0, 15).map((r) => {
                                                        const rowX = matrices?.decision_matrix?.[r.id] || r.scores || {};
                                                        return (
                                                            <tr key={r.id} className="hover:bg-slate-50">
                                                                <td className="p-3 font-bold text-slate-800">{r.student?.name}</td>
                                                                <td className="p-3 text-center font-mono">{rowX.c1_hardskill ?? '-'}</td>
                                                                <td className="p-3 text-center font-mono">{rowX.c2_discipline ?? '-'}</td>
                                                                <td className="p-3 text-center font-mono">{rowX.c3_cleanliness ?? '-'}</td>
                                                                <td className="p-3 text-center font-mono">{rowX.c4_teamwork ?? '-'}</td>
                                                                <td className="p-3 text-center font-mono">{rowX.c5_communication ?? '-'}</td>
                                                                <td className="p-3 text-center font-mono">{rowX.c6_initiative ?? '-'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {matrixTab === 'matrixR' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-black text-slate-800 uppercase text-sm">
                                                Matriks Ternormalisasi ({activeMethodKey === 'topsis' ? 'Matriks Terbobot Y' : 'Matriks R'})
                                            </h4>
                                            <span className="text-xs text-slate-500">
                                                {activeMethodKey === 'topsis'
                                                    ? 'Y_ij = r_ij * w_j'
                                                    : 'r_ij = x_ij / max(x_j)'}
                                            </span>
                                        </div>
                                        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                                            <table className="w-full text-xs">
                                                <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                                                    <tr>
                                                        <th className="p-3 text-left">Alternatif / Siswa</th>
                                                        <th className="p-3 text-center">C1</th>
                                                        <th className="p-3 text-center">C2</th>
                                                        <th className="p-3 text-center">C3</th>
                                                        <th className="p-3 text-center">C4</th>
                                                        <th className="p-3 text-center">C5</th>
                                                        <th className="p-3 text-center">C6</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {spkResults.slice(0, 15).map((r) => {
                                                        const targetMatrix = activeMethodKey === 'topsis'
                                                            ? (matrices?.weighted_matrix?.[r.id] || {})
                                                            : (matrices?.normalized_matrix?.[r.id] || {});
                                                        return (
                                                            <tr key={r.id} className="hover:bg-slate-50 font-mono">
                                                                <td className="p-3 font-bold font-sans text-slate-800">{r.student?.name}</td>
                                                                <td className="p-3 text-center">{targetMatrix.c1_hardskill ?? '-'}</td>
                                                                <td className="p-3 text-center">{targetMatrix.c2_discipline ?? '-'}</td>
                                                                <td className="p-3 text-center">{targetMatrix.c3_cleanliness ?? '-'}</td>
                                                                <td className="p-3 text-center">{targetMatrix.c4_teamwork ?? '-'}</td>
                                                                <td className="p-3 text-center">{targetMatrix.c5_communication ?? '-'}</td>
                                                                <td className="p-3 text-center">{targetMatrix.c6_initiative ?? '-'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {matrixTab === 'vectors' && (
                                    <div className="space-y-6">
                                        {activeMethodKey === 'topsis' ? (
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-800 uppercase text-sm">
                                                    Solusi Ideal Positif (A+) & Negatif (A-)
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                                                        <h5 className="font-black text-emerald-800 text-xs uppercase mb-2">Solusi Ideal Positif (A+)</h5>
                                                        <div className="text-[11px] font-mono space-y-1 text-emerald-900">
                                                            {Object.entries(matrices?.ideal_positive || {}).map(([k, v]: any) => (
                                                                <div key={k} className="flex justify-between">
                                                                    <span>{k}:</span>
                                                                    <span className="font-bold">{Number(v).toFixed(4)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                                                        <h5 className="font-black text-red-800 text-xs uppercase mb-2">Solusi Ideal Negatif (A-)</h5>
                                                        <div className="text-[11px] font-mono space-y-1 text-red-900">
                                                            {Object.entries(matrices?.ideal_negative || {}).map(([k, v]: any) => (
                                                                <div key={k} className="flex justify-between">
                                                                    <span>{k}:</span>
                                                                    <span className="font-bold">{Number(v).toFixed(4)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : activeMethodKey === 'wp' ? (
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-800 uppercase text-sm">
                                                    Vektor S dan Vektor V (Weighted Product)
                                                </h4>
                                                <p className="text-xs text-slate-500">
                                                    Total Vektor &Sigma; S: <strong className="font-mono">{matrices?.total_s ?? '-'}</strong>
                                                </p>
                                                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                                                    <table className="w-full text-xs">
                                                        <thead className="bg-slate-100 font-bold uppercase">
                                                            <tr>
                                                                <th className="p-3 text-left">Nama Siswa</th>
                                                                <th className="p-3 text-center">Vektor S (S_i)</th>
                                                                <th className="p-3 text-center">Vektor V (Preferensi)</th>
                                                                <th className="p-3 text-center">Skor Akhir SPK</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 font-mono">
                                                            {spkResults.slice(0, 10).map((r) => (
                                                                <tr key={r.id}>
                                                                    <td className="p-3 font-sans font-bold text-slate-800">{r.student?.name}</td>
                                                                    <td className="p-3 text-center">{r.vector_s ?? '-'}</td>
                                                                    <td className="p-3 text-center text-purple-600 font-bold">{r.vector_v ?? '-'}</td>
                                                                    <td className="p-3 text-center font-sans font-black">{r.final_score}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <h4 className="font-black text-slate-800 uppercase text-sm">
                                                    Nilai Ekstrem (Max / Min) Kriteria SAW
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                    {Object.entries(matrices?.extremes || {}).map(([k, v]: any) => (
                                                        <div key={k} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{k}</span>
                                                            <div className="flex justify-between items-center mt-2 font-mono text-xs">
                                                                <span>Max: {v.max}</span>
                                                                <span>Min: {v.min}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {matrixTab === 'theory' && (
                                    <div className="space-y-4">
                                        <h4 className="font-black text-slate-800 uppercase text-sm">
                                            Landasan Ilmiah Model {activeMethodName}
                                        </h4>
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-700 leading-relaxed">
                                            <p>
                                                <strong>Multi-Criteria Decision Making (MCDM)</strong> pada platform BREWTECH dirancang untuk menjembatani penilaian kompetensi vokasi inklusif barista secara objektif, dapat dipertanggungjawabkan, dan bebas dari bias subjektif.
                                            </p>
                                            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                                                <span className="font-bold text-primary uppercase text-[10px] tracking-wider block">
                                                    Formulasi Matematika Aktif
                                                </span>
                                                {activeMethodKey === 'saw' && (
                                                    <code className="text-xs font-mono block bg-slate-50 p-3 rounded-lg text-slate-800">
                                                        V_i = &Sigma;_(j=1)^n (w_j &times; r_ij) <br />
                                                        dimana r_ij = x_ij / max(x_ij) untuk benefit criteria
                                                    </code>
                                                )}
                                                {activeMethodKey === 'wp' && (
                                                    <code className="text-xs font-mono block bg-slate-50 p-3 rounded-lg text-slate-800">
                                                        S_i = &prod;_(j=1)^n (x_ij ^ w_j) <br />
                                                        V_i = S_i / &Sigma;_(k=1)^m S_k
                                                    </code>
                                                )}
                                                {activeMethodKey === 'topsis' && (
                                                    <code className="text-xs font-mono block bg-slate-50 p-3 rounded-lg text-slate-800">
                                                        r_ij = x_ij / &radic;(&Sigma; x_kj^2) <br />
                                                        D_i^+ = &radic;(&Sigma; (y_ij - A_j^+)^2), D_i^- = &radic;(&Sigma; (y_ij - A_j^-)^2) <br />
                                                        C_i = D_i^- / (D_i^+ + D_i^-)
                                                    </code>
                                                )}
                                            </div>
                                            <p className="text-slate-500 text-[11px]">
                                                Nilai preferensi akhir diskalakan secara seragam ke rentang persentase 0-100% untuk mempermudah instruktur dalam menerbitkan rapor kesiapan kerja dan menentukan apakah siswa membutuhkan pendampingan khusus di kafe mitra.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 lg:p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                                <button
                                    onClick={() => setShowMatrixModal(false)}
                                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-all"
                                >
                                    TUTUP MATRIKS
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
