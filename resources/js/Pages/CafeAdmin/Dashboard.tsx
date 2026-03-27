import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Store, Package, ShoppingCart, Users, ArrowRight, TrendingUp, Calendar, Wallet } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ auth, stats, chartData = [], recentTransactions = [] }: any) {
    const statCards = [
        { label: 'Total Menu / Produk', value: stats?.totalProducts ?? 0, icon: Package, color: 'text-orange-500', bg: 'bg-orange-100' },
        { label: 'Total Transaksi (POS)', value: stats?.totalTransactions ?? 0, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Talenta Siap Kerja', value: stats?.totalTalents ?? 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ];

    const formatRp = (number: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    const formatTanggal = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Mitra Kafe" />

            <div className="py-8 max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center">
                            <Store size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-0.5">
                                Halo, Mitra Kafe! ☕
                            </h2>
                            <p className="text-slate-500 text-xs font-semibold tracking-tight">
                                Kelola produk, catat transaksi di mesin POS, dan temukan barista berbakat.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href={route('cafe.pos.index')} className="group inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                            <ShoppingCart size={16} /> Buka POS Kasir
                        </Link>
                        <Link href={route('cafe.talent_pool.index')} className="group inline-flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                            <Users size={16} className="text-slate-400 group-hover:text-primary transition-colors" /> Cari Barista
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statCards.map((s, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-primary/5 transition-colors"></div>
                            
                            <div className={`w-12 h-12 ${s.bg} ${s.color} border border-slate-100 rounded-xl flex items-center justify-center mb-6 relative z-10`}>
                                <s.icon size={24} />
                            </div>
                            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1 relative z-10">{s.label}</p>
                            <p className="text-3xl font-bold text-slate-900 relative z-10 tracking-tight">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* INSIGHTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* CHART PENDAPATAN 7 HARI TERAKHIR */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-primary" /> Pemasukan 7 Hari Terakhir
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">Tren kas masuk (debit) kafe Anda.</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full h-[250px] min-h-[250px]">
                            {chartData && chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" tick={{fontSize: 11, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                                        <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                                        <Tooltip 
                                            formatter={(value: number) => [formatRp(value), 'Pemasukan']}
                                            labelStyle={{color: '#64748b', fontWeight: 'bold'}}
                                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                                        />
                                        <Line type="monotone" dataKey="pv" stroke="#51CBE0" strokeWidth={3} dot={{r: 4, fill: '#51CBE0', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
                                    <TrendingUp size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm font-medium">Belum ada data pemasukan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RECENT TRANSACTIONS */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Wallet size={18} className="text-orange-500" /> Transaksi Terakhir
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">Catatan terbaru di buku kas.</p>
                            </div>
                            <Link href={route('cafe.transactions.index')} className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-primary/80 flex items-center gap-1">
                                Lihat Semua <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="flex-1 p-0 overflow-x-auto">
                            {recentTransactions && recentTransactions.length > 0 ? (
                                <table className="w-full text-left whitespace-nowrap">
                                    <tbody className="divide-y divide-slate-100">
                                        {recentTransactions.map((trx: any) => (
                                            <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${trx.tipe === 'debit' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
                                                            {trx.tipe === 'debit' ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingUp size={14} strokeWidth={3} className="rotate-180" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{trx.keterangan}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                                <Calendar size={10} /> {formatTanggal(trx.tanggal)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <p className={`text-sm font-bold ${trx.tipe === 'debit' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                        {trx.tipe === 'debit' ? '+' : '-'}{formatRp(trx.nominal)}
                                                    </p>
                                                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">{trx.tipe}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-slate-400 p-6">
                                    <Package size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm font-medium">Data transaksi masih kosong.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}