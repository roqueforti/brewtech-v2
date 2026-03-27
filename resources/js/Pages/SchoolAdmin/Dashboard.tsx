import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    GraduationCap, 
    UserCheck, 
    Award, 
    TrendingUp, 
    Coffee, 
    BookOpen, 
    ChevronRight,
    ArrowUpRight,
    Sparkles,
    Calendar,
    ArrowRight
} from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    const statCards = [
        { label: 'Total Kelas', value: stats.totalClasses, sub: 'Kelas aktif hari ini', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/5', gradient: 'from-primary/10 to-transparent' },
        { label: 'Pelatih Aktif', value: stats.totalInstructors, sub: 'Monitor pengajaran', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50', gradient: 'from-emerald-500/10 to-transparent' },
        { label: 'Siswa Terdaftar', value: stats.totalStudents, sub: 'Pertumbuhan +12%', icon: Users, color: 'text-secondary', bg: 'bg-secondary/5', gradient: 'from-secondary/10 to-transparent' },
        { label: 'Siap PKL', value: stats.readyForPKL, sub: 'Verifikasi lencana', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50', gradient: 'from-amber-500/10 to-transparent' },
    ];

    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Selamat Pagi' : currentHour < 18 ? 'Selamat Siang' : 'Selamat Malam';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Beranda Admin Sekolah" />

            <div className="py-6 space-y-10 max-w-[1400px] mx-auto pb-20">

                {/* PREMIUM HERO SECTION - LIGHT THEME */}
                <div className="relative overflow-hidden bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 group border border-slate-100">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>
                    <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-[80px]"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                <Sparkles size={14} className="text-secondary" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{greeting}, {auth.user.name}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter italic">
                                TRANSFORMASI <span className="text-primary underline decoration-primary/30">VOKASI</span> <br />
                                <span className="text-secondary">TANPA BATAS.</span>
                            </h1>
                            <p className="text-slate-500 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                                Kelola kurikulum, pantau progres siswa, dan fasilitasi transisi kerja penyandang disabilitas dengan dashboard cerdas Brewtech.
                            </p>
                            <div className="pt-4 flex flex-wrap gap-4">
                                <Link href={route('school.reports.index')} className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 flex items-center gap-3">
                                    Analisis Sertifikasi <ArrowUpRight size={18} />
                                </Link>
                                <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
                                    Unduh Laporan Bulanan
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6">
                            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] text-center w-48 shadow-sm">
                                <p className="text-4xl font-black text-slate-800 mb-1 tracking-tighter tabular-nums">{stats.totalStudents}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Siswa Aktif</p>
                            </div>
                            <div className="p-8 bg-secondary/5 border border-secondary/20 rounded-[32px] text-center w-48 shadow-sm relative">
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                    <TrendingUp size={16} />
                                </div>
                                <p className="text-4xl font-black text-secondary mb-1 tracking-tighter tabular-nums">92%</p>
                                <p className="text-[10px] font-bold text-secondary/70 uppercase tracking-widest">Efisiensi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATS GRID - GLASSMORPHISM CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((s, i) => (
                        <div key={i} className="group relative bg-white border border-slate-100 rounded-[32px] p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                        <s.icon size={26} className={s.color} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-3xl font-black tracking-tight tabular-nums italic ${s.color}`}>{s.value}</span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                                            <TrendingUp size={10} /> +{Math.floor(Math.random() * 20)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-slate-800 text-[11px] uppercase tracking-widest italic">{s.label}</p>
                                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.15em]">{s.sub}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* LOWER SECTION: QUICK ACTIONS + TRENDS */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* QUICK ACTIONS PANEL */}
                    <div className="xl:col-span-2 bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Alur Cepat <span className="text-primary">Manajemen</span></h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Interaksi sistem paling sering diakses</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors cursor-pointer group/link">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Semua Fitur</span>
                                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {[
                                { route: 'school.classes.index', label: 'Kelola Kelas', subText: 'Atur kelas & pengampu', icon: GraduationCap, color: 'bg-primary', shadow: 'shadow-primary/20' },
                                { route: 'school.users.index', label: 'Data Pengguna', subText: 'Siswa, Pelatih, Wali', icon: Users, color: 'bg-secondary', shadow: 'shadow-secondary/20' },
                                { route: 'school.curriculum.index', label: 'Modul Belajar', subText: 'Sinkronisasi kurikulum', icon: BookOpen, color: 'bg-amber-400', shadow: 'shadow-amber-200' },
                            ].map((action, idx) => (
                                <Link 
                                    key={idx}
                                    href={route(action.route)} 
                                    className="group/btn relative overflow-hidden bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 p-8 rounded-[32px] transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50"
                                >
                                    <div className={`w-14 h-14 ${action.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl ${action.shadow} group-hover/btn:scale-110 transition-transform duration-500`}>
                                        <action.icon size={26} strokeWidth={2.5} />
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm uppercase tracking-tight group-hover/btn:text-primary transition-colors italic">{action.label}</p>
                                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider mt-1">{action.subText}</p>
                                    <div className="absolute bottom-6 right-8 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all duration-300">
                                        <ArrowRight size={20} className="text-primary" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RECENT INFO BOX - LIGHT ACCENT */}
                    <div className="bg-slate-50 border border-slate-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                                    <Calendar size={18} className="text-secondary" />
                                </div>
                                <h4 className="text-slate-800 font-black text-sm uppercase tracking-widest italic">Aktivitas Terakhir</h4>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { time: '10:45', action: 'Update Kurikulum', user: 'Admin' },
                                    { time: '09:20', action: 'Input Nilai Siswa', user: 'Budi (Pelatih)' },
                                    { time: 'Kemarin', action: 'Export Data SPK', user: 'Admin' },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4 group/log cursor-default">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white shadow-sm z-10"></div>
                                            {i !== 2 && <div className="w-0.5 h-10 bg-slate-200 my-1"></div>}
                                        </div>
                                        <div>
                                            <p className="text-slate-800 font-black text-xs group-hover/log:text-primary transition-colors italic uppercase tracking-tight">{log.action}</p>
                                            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">{log.time} • Oleh {log.user}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 pt-10 border-t border-slate-200 mt-10">
                            <button className="w-full py-4 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group shadow-sm">
                                Buka Log Aktivitas <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}