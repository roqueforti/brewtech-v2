import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Users, Store, BookOpen, Building2, TrendingUp,
    Clock, Coffee, PlusCircle, FileDown, AreaChart as ChartIcon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IconMap: Record<string, any> = { Store, Building2, BookOpen, Users };

const iconColors = [
    { bg: 'bg-primary/10', text: 'text-primary', dot: 'text-primary' },
    { bg: 'bg-secondary/10', text: 'text-secondary', dot: 'text-secondary' },
    { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'text-purple-500' },
    { bg: 'bg-orange-100', text: 'text-orange-500', dot: 'text-orange-500' },
];

export default function Dashboard({ stats, recentActivities, chartData }: any) {
    const { auth } = usePage().props as any;
    const displayStats = stats || [];
    const activities = recentActivities || [];
    const dataGrafik = chartData || [];

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Dashboard Superadmin" />

            <div className="py-8 space-y-8 max-w-7xl mx-auto">
                
                {/* Page Header */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                            Ringkasan Sistem
                        </h2>
                        <p className="text-slate-500 font-medium">
                            Selamat datang, <span className="font-bold text-primary">{auth?.user?.name?.split(' ')[0] || 'Admin'}</span> — {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <a 
                        href={route('superadmin.export.pdf')} 
                        target="_blank"
                        className="relative z-10 inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all hover:bg-primary shadow-xl shadow-slate-200 hover:shadow-primary/20 active:scale-95"
                    >
                        <FileDown size={18} />
                        Ekspor PDF
                    </a>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {displayStats.map((stat: any, index: number) => {
                        const IconComponent = IconMap[stat.icon] || Store;
                        const color = iconColors[index % iconColors.length];
                        return (
                            <div key={index} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:shadow-slate-200/5 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 ${color.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <IconComponent size={24} className={color.text} />
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold bg-slate-50/50 px-2.5 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
                                        <TrendingUp size={11} className="text-green-500" />
                                        {stat.trend}
                                    </div>
                                </div>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Growth Chart */}
                    <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                                    <ChartIcon size={18} className="text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg leading-none">Tren Pertumbuhan</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data 6 Bulan Terakhir</span>
                                </div>
                            </h3>
                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Siswa</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" /> Sekolah</span>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dataGrafik}>
                                    <defs>
                                        <linearGradient id="colorSiswa" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#51CBE0" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#51CBE0" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorSekolah" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF007F" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#FF007F" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={8} />
                                    <YAxis hide />
                                    <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13}} cursor={{stroke: '#e2e8f0', strokeWidth: 1}} />
                                    <Area type="monotone" dataKey="siswa" stroke="#51CBE0" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSiswa)" activeDot={{ r: 5, strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="sekolah" stroke="#FF007F" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSekolah)" activeDot={{ r: 5, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        
                        {/* Quick Action Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                            <div className="relative z-10">
                                <h3 className="font-bold text-xl mb-2">Kelola Ekosistem</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">
                                    Pantau aktivitas mitra dan kembangkan kurikulum disabilitas secara nasional.
                                </p>
                                <Link 
                                    href={route('superadmin.cafes.index')}
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <PlusCircle size={16} /> Kelola Kafe
                                </Link>
                            </div>
                            <Coffee size={140} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Clock size={15} />
                                </div>
                                Aktivitas Terkini
                            </h3>
                            <div className="space-y-6">
                                {activities.length > 0 ? activities.slice(0, 4).map((activity: any) => (
                                    <div key={activity.id} className="flex gap-4 items-center group">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 border border-slate-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold uppercase transition-colors group-hover:bg-primary/5 group-hover:text-primary group-hover:border-primary/20">
                                            {activity.user.substring(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 leading-tight truncate">
                                                {activity.action} <span className="text-primary font-bold">{activity.target}</span>
                                            </p>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                                <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" /> {activity.time}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-slate-400 text-center py-4 font-bold uppercase tracking-widest">Belum ada aktivitas.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}