import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    GraduationCap, Users, BookOpen, ChevronLeft, 
    CheckCircle2, Circle, TrendingUp, Trophy, 
    ArrowRight, Star, Settings, Plus, X, Search, CheckSquare, Square
} from 'lucide-react';

export default function ClassDetail({ auth, class: classroom, allModules, stats }) {
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleToggleModule = (moduleId) => {
        router.post(route('school.classes.toggle_module', classroom.id), {
            module_id: moduleId
        }, {
            preserveScroll: true,
        });
    };

    const isModuleAdopted = (moduleId) => {
        return classroom.modules.some(m => m.id === moduleId);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Detail Kelas - ${classroom.name}`} />

            <div className="py-6 space-y-10 max-w-[1400px] mx-auto pb-20">
                
                {/* PREMIER BREADCRUMB & HEADER */}
                <div className="px-4 md:px-0">
                    <Link 
                        href={route('school.classes.index')}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-black text-[10px] uppercase tracking-widest mb-6 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Manajemen Kelas
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white border border-slate-100 shadow-xl rounded-[32px] flex items-center justify-center text-6xl shadow-secondary/5">
                                {classroom.emoji_icon}
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                    <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">Dashboard Kelas Aktif</span>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{classroom.name}</h2>
                                <p className="text-slate-400 text-sm font-medium mt-1 flex items-center gap-2">
                                    <BookOpen size={14} /> Instruktur: <span className="text-slate-900 font-bold uppercase">{classroom.instructor?.name || 'Belum Ditentukan'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowModuleModal(true)}
                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Settings size={18} strokeWidth={3} /> Kelola Kurikulum
                            </button>
                        </div>
                    </div>
                </div>

                {/* PERFORMANCE STATS */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-4 md:px-0">
                    <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Siswa</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{classroom.students?.length || 0}</h3>
                            <span className="text-[9px] font-black text-emerald-500 uppercase pb-1.5">Peserta</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-secondary/10 transition-colors" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Rerata Hardskill</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{stats.avg_hardskill}</h3>
                            <span className="text-[9px] font-black text-primary uppercase pb-1.5">Poin</span>
                        </div>
                    </div>

                    {/* NEW: SOFTSKILL STAT */}
                    <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-amber-500/10 transition-colors" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Rerata Softskill</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic text-amber-500">{stats.avg_softskill}</h3>
                            <span className="text-[9px] font-black text-amber-500 uppercase pb-1.5">Poin</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Progres Kelas</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{stats.avg_progress}%</h3>
                            <span className="text-[9px] font-black text-emerald-500 uppercase pb-1.5">Selesai</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-slate-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-slate-500/10 transition-colors" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Modul Diadopsi</p>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{classroom.modules?.length || 0}</h3>
                            <span className="text-[9px] font-black text-slate-400 uppercase pb-1.5">Materi</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 md:px-0">
                    
                    {/* STUDENT PERFORMANCE LIST */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                                <Users className="text-primary" /> Daftar & Performa Siswa
                            </h3>
                            <div className="h-0.5 flex-1 bg-slate-100 mx-6 opacity-50" />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Siswa</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Hard Skill</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Soft Skill</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Modul</th>
                                            <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {classroom.students?.map((student) => {
                                            const totalModuleCount = allModules.length || 1;

                                            return (
                                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-slate-900 uppercase italic text-sm group-hover:text-primary transition-colors">{student.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.disability_type}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${student.avg_hardskill >= 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                                {student.avg_hardskill}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${student.avg_softskill >= 80 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                                                {student.avg_softskill}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-black text-slate-900 text-xs italic">{student.completed_modules} / {totalModuleCount}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {auth.user.role === 'instructor' || auth.user.id === classroom.instructor_id ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {classroom.modules?.map(mod => (
                                                                    <Link 
                                                                        key={mod.id}
                                                                        href={route('instructor.evaluate.create', [student.id, mod.id])}
                                                                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-wider hover:bg-primary transition-all shadow-sm"
                                                                        title={`Nilai Softskill: ${mod.title}`}
                                                                    >
                                                                        Nilai {mod.title.split(' ')[0]}
                                                                    </Link>
                                                                ))}
                                                                {(!classroom.modules || classroom.modules.length === 0) && (
                                                                    <span className="text-[9px] text-slate-300 font-bold italic uppercase">Adopsi Modul Dulu</span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-[9px] text-slate-300 font-bold italic uppercase tracking-widest">Hanya Instruktur</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {(!classroom.students || classroom.students.length === 0) && (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest">Belum ada siswa di kelas ini</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* ADOPTED MODULES LIST */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                                <BookOpen className="text-secondary" /> Kurikulum Kelas
                            </h3>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-4">
                            {classroom.modules?.length > 0 ? (
                                classroom.modules.map((mod, idx) => (
                                    <div key={mod.id} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-slate-900 text-xs uppercase italic truncate">{mod.title}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Modul Pembelajaran</p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-secondary" />
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
                                        <BookOpen size={32} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Belum ada kurikulum yang diadopsi untuk kelas ini.</p>
                                    <button 
                                        onClick={() => setShowModuleModal(true)}
                                        className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline"
                                    >
                                        + Mulai Adopsi Modul
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* PERFORMANCE CARD */}
                        <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-10">
                                <Trophy className="text-amber-400 mb-6" size={32} />
                                <h4 className="text-xl font-black uppercase italic tracking-tighter">Performa Kelas</h4>
                                <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">
                                    Analisis ketercapaian kompetensi berdasarkan penyelesaian modul dan penilaian instruktur.
                                </p>
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inovasi Pembelajaran</p>
                                            <p className="text-sm font-bold mt-1">Metode Praktik Langsung</p>
                                        </div>
                                        <ArrowRight size={20} className="text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CURRICULUM MANAGEMENT MODAL */}
            {showModuleModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl p-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Kelola <span className="text-secondary">Kurikulum</span></h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Pilih modul untuk dipelajari di kelas ini</p>
                            </div>
                            <button onClick={() => setShowModuleModal(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search size={20} strokeWidth={2.5} />
                            </div>
                            <input 
                                type="text"
                                placeholder="CARI MODUL PEMBELAJARAN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-16 pl-14 pr-6 bg-slate-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-2xl outline-none font-black text-[11px] uppercase tracking-widest transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {allModules
                                .filter(mod => mod.title.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((mod) => {
                                const isAdopted = isModuleAdopted(mod.id);
                                return (
                                    <div 
                                        key={mod.id} 
                                        onClick={() => handleToggleModule(mod.id)}
                                        className={`flex items-center gap-6 p-6 rounded-3xl border-2 cursor-pointer transition-all group ${
                                            isAdopted 
                                            ? 'border-secondary bg-secondary/5' 
                                            : 'border-slate-50 hover:border-slate-200 bg-white'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                            isAdopted ? 'bg-secondary text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100'
                                        }`}>
                                            {isAdopted ? <CheckSquare size={24} strokeWidth={3} /> : <Square size={24} strokeWidth={2.5} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-900 text-sm uppercase italic">{mod.title}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 line-clamp-1">{mod.description}</p>
                                        </div>
                                        {isAdopted && (
                                            <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em] animate-fade-in">Aktif</span>
                                        )}
                                    </div>
                                );
                            })}
                            {allModules.filter(mod => mod.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                <div className="py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={40} className="text-slate-200" strokeWidth={1} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Modul tidak ditemukan</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="pt-10">
                            <button 
                                onClick={() => setShowModuleModal(false)}
                                className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Selesai Pengaturan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
