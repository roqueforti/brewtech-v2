import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
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
    Layout
} from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function Reports({ auth, spkResults, schoolInfo }) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const exportExcel = () => {
        window.location.href = route('school.reports.export', { format: 'excel' });
    };

    const exportPdf = () => {
        window.location.href = route('school.reports.export', { format: 'pdf' });
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

    // Data for Pie Chart (Premium Polish)
    const pieData = [
        { name: 'Siap Praktek', value: spkResults.filter(r => r.kategori_spk === 'Siap Praktek Kerja (magang)').length, color: '#10B981' },
        { name: 'Pendampingan', value: spkResults.filter(r => r.kategori_spk === 'Perlu Pendampingan').length, color: '#F59E0B' },
        { name: 'Lanjutan', value: spkResults.filter(r => r.kategori_spk === 'Perlu Pelatihan Lanjutan').length, color: '#EF4444' },
    ].filter(d => d.value > 0);

    // Data for Bar Chart (Averages)
    const avgHard = spkResults.reduce((acc, curr) => acc + curr.hard_skill_score, 0) / (spkResults.length || 1);
    const avgSoft = spkResults.reduce((acc, curr) => acc + curr.soft_skill_score, 0) / (spkResults.length || 1);
    const avgFinal = spkResults.reduce((acc, curr) => acc + curr.final_score, 0) / (spkResults.length || 1);

    const barData = [
        { name: 'Keahlian Teknis', value: Number(avgHard.toFixed(1)), fill: '#0EA5E9' },
        { name: 'Keahlian Sosial', value: Number(avgSoft.toFixed(1)), fill: '#EC4899' },
        { name: 'Rata-rata Akhir', value: Number(avgFinal.toFixed(1)), fill: '#C0242D' },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Analisis SPK & Rapor" />

            <div className="py-8 space-y-12 max-w-[1400px] mx-auto pb-24 px-4 sm:px-6">
                {/* PREMIUM HEADER - ANALYTICS FOCUS */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-2xl animate-fade-in">
                            <TrendingUp size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">INTELLIGENCE DASHBOARD</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic uppercase">
                            LAPORAN <span className="text-secondary">ANALISIS SPK</span>
                        </h2>
                        <p className="text-slate-400 text-base font-medium max-w-2xl">
                            Visualisasi data keputusan strategis berdasarkan rekapan skor kompetensi teknis dan sosial siswa.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button 
                            onClick={printReport} 
                            className="h-16 px-8 bg-white border-2 border-slate-100 text-slate-900 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:border-primary/20 hover:bg-slate-50 transition-all flex items-center gap-3 active:scale-95 shadow-sm"
                        >
                            <Printer size={18} strokeWidth={2.5} /> CETAK LAPORAN
                        </button>
                        <button 
                            onClick={exportExcel} 
                            className="h-16 px-10 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:shadow-primary/20 hover:bg-primary transition-all flex items-center gap-3 active:scale-95"
                        >
                            <Download size={18} strokeWidth={3} /> EXPORT DATA MASTER
                        </button>
                    </div>
                </div>

                {/* ANALYTICS HUB - PIE & BAR CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[500px]">
                    {/* Pie Chart Card - Category Distribution */}
                    <div className="lg:col-span-5 bg-white rounded-[48px] p-10 border border-slate-100 shadow-xl group relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-[80px] group-hover:bg-secondary/10 transition-all duration-1000" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Sebaran <span className="text-primary italic">Kategori</span></h3>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Status Pencapaian Tier Siswa</p>
                                </div>
                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center">
                                    <PieIcon size={20} className="text-primary" strokeWidth={2.5} />
                                </div>
                            </div>
                            
                            <div className="h-[280px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '20px' }}
                                            itemStyle={{ color: '#0f172a', fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            iconType="circle"
                                            content={({ payload }) => (
                                                <div className="grid grid-cols-2 gap-4 mt-8">
                                                    {payload.map((entry: any, index) => (
                                                        <div key={index} className="flex items-center gap-3">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart Card - Performance Metrics */}
                    <div className="lg:col-span-7 bg-slate-900 rounded-[48px] p-10 shadow-2xl group relative flex flex-col overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                        
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Metrik <span className="text-primary italic">Performa</span></h3>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Rata-rata Akumulasi Kompetensi</p>
                                </div>
                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                    <TrendingUp size={20} className="text-primary" strokeWidth={2.5} />
                                </div>
                            </div>

                            <div className="flex-1 w-full min-h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#1e293b" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                                            dy={20}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} 
                                        />
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 24 }}
                                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '32px', border: '1px solid #1e293b', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                        />
                                        <Bar dataKey="value" radius={[24, 24, 8, 8]} barSize={64}>
                                            {barData.map((entry: any, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTERS & MASTER TABLE */}
                <section className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white border-2 border-slate-100 rounded-[28px] flex items-center justify-center shadow-xl">
                                <Filter size={24} className="text-secondary" strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">DATA <span className="text-secondary italic">TABULASI</span></h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter & Kelola Berkas Siswa</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`h-11 px-6 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${
                                        selectedCategory === category.id
                                            ? 'bg-slate-900 text-white shadow-xl scale-105'
                                            : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* PREMIUM TABLE DESIGN */}
                    <div className="bg-white border border-slate-100 rounded-[56px] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="text-left py-8 px-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Identitas Siswa</th>
                                        <th className="text-left py-8 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Program Kelas</th>
                                        <th className="text-center py-8 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic text-cyan-600">Teknis</th>
                                        <th className="text-center py-8 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic text-pink-600">Sosial</th>
                                        <th className="text-center py-8 px-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Indeks SPK</th>
                                        <th className="text-center py-8 px-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Status Tier</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredResults.map((result, i) => (
                                        <tr key={result.id} className="group hover:bg-slate-50/50 transition-all duration-500">
                                            <td className="py-8 px-12">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-100 rounded-[22px] flex items-center justify-center font-black text-slate-900 group-hover:border-primary/30 group-hover:rotate-3 transition-all shadow-sm relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span className="relative z-10 text-lg italic">{result.student.name.substring(0, 1)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-sm tracking-tight group-hover:text-primary transition-colors uppercase italic">{result.student.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{result.student.disability_type || 'UMUM'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8 px-8">
                                                <div className="inline-flex items-center px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider italic">{result.student.class?.name || 'BELUM TERPLOT'}</span>
                                                </div>
                                            </td>
                                            <td className="py-8 px-8 text-center text-sm font-black text-cyan-600 italic opacity-60 group-hover:opacity-100 transition-opacity">
                                                {result.hard_skill_score}
                                            </td>
                                            <td className="py-8 px-8 text-center text-sm font-black text-pink-600 italic opacity-60 group-hover:opacity-100 transition-opacity">
                                                {result.soft_skill_score}
                                            </td>
                                            <td className="py-8 px-8 text-center">
                                                <div className="w-16 h-16 bg-white border-2 border-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-sm group-hover:shadow-primary/20 group-hover:-translate-y-1 transition-all">
                                                    <p className="text-xl font-black text-primary italic leading-none">{result.final_score.toFixed(0)}</p>
                                                </div>
                                            </td>
                                            <td className="py-8 px-12 text-center">
                                                <div className={`inline-flex items-center px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg transition-all group-hover:scale-105 italic ${
                                                    result.kategori_spk === 'Siap Praktek Kerja (magang)' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                                                    result.kategori_spk === 'Perlu Pendampingan' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                                                    'bg-red-500 text-white shadow-red-500/20'
                                                }`}>
                                                    {result.kategori_spk}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredResults.length === 0 && (
                            <div className="py-40 text-center bg-white">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText size={40} className="text-slate-200" strokeWidth={1} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-300 uppercase italic tracking-tighter">DATA ANALISIS NIHIL</h3>
                                <p className="text-slate-400 font-medium text-[10px] uppercase tracking-[0.2em] mt-2">SESUAIKAN PARAMETER PENYARINGAN ANDA</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

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