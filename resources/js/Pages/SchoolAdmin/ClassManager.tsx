import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { GraduationCap, Plus, Users, BookOpen, Edit2, Trash2, X } from 'lucide-react';

export default function ClassManager({ auth, classes, instructors }) {
    const [showForm, setShowForm] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);

    const form = useForm({
        name: '',
        emoji_icon: '📚',
        instructor_id: '',
    });

    const editForm = useForm({
        name: '',
        emoji_icon: '',
        instructor_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin menambahkan Kelas ini?')) return;
        form.post(route('school.classes.store'), {
            onSuccess: () => {
                form.reset();
                setShowForm(false);
            },
        });
    };

    const handleEdit = (cls: any) => {
        setEditingClass(cls);
        editForm.setData({
            name: cls.name,
            emoji_icon: cls.emoji_icon,
            instructor_id: cls.instructor_id,
        });
    };

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('school.classes.update', editingClass.id), {
            onSuccess: () => setEditingClass(null),
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus kelas ini? Semua data siswa yang terhubung akan tetap ada namun tidak memiliki kelas.')) return;
        form.delete(route('school.classes.destroy', id), {
            preserveScroll: true
        });
    };

    const emojis = ['📚', '🎓', '📖', '🎯', '✨', '🌟', '💡', '🔥', '🎨', '🎭', '🎪', '🎬'];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Kelas" />

            <div className="py-6 space-y-10 max-w-[1400px] mx-auto pb-20">
                
                {/* PREMIUM HEADER - LIGHT THEME */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full mb-3">
                            <GraduationCap size={12} className="text-secondary" />
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Akademik & Kelas</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Manajemen <span className="text-primary">Kelas</span></h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">Atur alokasi instruktur dan pantau perkembangan setiap kelas.</p>
                    </div>
                    
                    <button 
                        onClick={() => setShowForm(true)}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} /> Buat Kelas Baru
                    </button>
                </div>
 
                {/* Classes Grid */}
                <div className="px-4 md:px-0">
                    {classes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {classes.map(cls => (
                                <div key={cls.id} className="group relative bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                    {/* Decorative Background */}
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-10">
                                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[28px] flex items-center justify-center text-5xl shadow-inner transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                                                {cls.emoji_icon}
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(cls)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white text-slate-400 shadow-sm transition-all duration-300 group/edit">
                                                    <Edit2 size={16} strokeWidth={2.5} />
                                                </button>
                                                <button onClick={() => handleDelete(cls.id)} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white text-slate-400 shadow-sm transition-all duration-300 group/del">
                                                    <Trash2 size={16} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
 
                                        <div className="mb-8">
                                            <h4 className="font-black text-slate-900 text-2xl tracking-tighter uppercase italic line-clamp-1 group-hover:text-secondary transition-colors italic">{cls.name}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sesi Aktif</p>
                                            </div>
                                        </div>
 
                                        <div className="space-y-4 mb-10">
                                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                                                    <Users size={18} className="text-secondary" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Siswa Terdaftar</p>
                                                    <p className="text-sm font-black text-slate-800 tracking-tight italic">{cls.students_count || 0} PESERTA</p>
                                                </div>
                                            </div>
 
                                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                                                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                                                    <BookOpen size={18} className="text-primary" strokeWidth={2.5} />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Instruktur</p>
                                                    <p className="text-sm font-black text-slate-800 tracking-tight uppercase italic line-clamp-1">{cls.instructor?.name || 'BELUM TERPLOT'}</p>
                                                </div>
                                            </div>
                                        </div>
 
                                        <Link 
                                            href={route('school.classes.show', cls.id)}
                                            className="w-full h-14 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group/btn"
                                        >
                                            Detail Kurikulum <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" strokeWidth={3} />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center bg-white border-2 border-dashed border-slate-100 rounded-[48px] animate-in fade-in zoom-in-95 shadow-sm">
                            <GraduationCap size={64} className="text-slate-100 mx-auto mb-6" strokeWidth={1} />
                            <h3 className="text-2xl font-black text-slate-900 uppercase italic">Belum ada kelas</h3>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest max-w-sm mx-auto mt-2">Mulai petualangan belajar dengan membuat kelas pertama Anda hari ini.</p>
                        </div>
                    )}
                </div>
            </div>
 
            {/* ADD FORM MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Bentuk <span className="text-primary">Kelas</span></h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Inisialisasi grup belajar baru Anda</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
 
                        <form onSubmit={submit} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Nama Identitas Kelas</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: ADVANCED BARISTA A"
                                        value={form.data.name}
                                        onChange={e => form.setData('name', e.target.value)}
                                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-black text-slate-900 placeholder:text-slate-300 uppercase italic transition-all"
                                        required
                                    />
                                </div>
 
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Visual Ikon Kelas</label>
                                    <div className="grid grid-cols-6 gap-3">
                                        {emojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => form.setData('emoji_icon', emoji)}
                                                className={`h-16 text-3xl rounded-2xl border-2 transition-all flex items-center justify-center ${
                                                    form.data.emoji_icon === emoji
                                                        ? 'border-primary bg-primary/5 shadow-inner scale-105'
                                                        : 'border-slate-50 hover:border-slate-200 hover:bg-white'
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
 
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Instruktur Pengampu</label>
                                    <select
                                        value={form.data.instructor_id}
                                        onChange={e => form.setData('instructor_id', e.target.value)}
                                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none font-black text-slate-900 bg-white transition-all uppercase italic"
                                        required
                                    >
                                        <option value="">Pilih Instruktur</option>
                                        {instructors.map((instructor: any) => (
                                            <option key={instructor.id} value={instructor.id}>{instructor.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
 
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 h-16 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="flex-2 h-16 px-12 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Luncurkan Kelas
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
 
            {/* EDIT MODAL */}
            {editingClass && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Revisi <span className="text-secondary">Kelas</span></h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Perbarui konfigurasi entitas belajar</p>
                            </div>
                            <button onClick={() => setEditingClass(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
 
                        <form onSubmit={submitUpdate} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Nama Identitas Kelas</label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={e => editForm.setData('name', e.target.value)}
                                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 focus:border-secondary focus:ring-0 outline-none font-black text-slate-900 uppercase italic transition-all"
                                        required
                                    />
                                </div>
 
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Instruktur Pengampu</label>
                                    <select
                                        value={editForm.data.instructor_id}
                                        onChange={e => editForm.setData('instructor_id', e.target.value)}
                                        className="w-full h-16 px-6 rounded-2xl border-2 border-slate-100 focus:border-secondary focus:ring-0 outline-none font-black text-slate-900 bg-white transition-all uppercase italic"
                                        required
                                    >
                                        <option value="">Pilih Instruktur</option>
                                        {instructors.map((instructor: any) => (
                                            <option key={instructor.id} value={instructor.id}>{instructor.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
 
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Visual Ikon Kelas</label>
                                    <div className="flex flex-wrap gap-3">
                                        {emojis.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => editForm.setData('emoji_icon', emoji)}
                                                className={`w-16 h-16 text-3xl rounded-2xl border-2 transition-all flex items-center justify-center ${
                                                    editForm.data.emoji_icon === emoji
                                                        ? 'border-secondary bg-secondary/5 shadow-inner scale-105'
                                                        : 'border-slate-50 hover:border-slate-200 hover:bg-white'
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
 
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditingClass(null)} className="flex-1 h-16 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 transition-all">
                                    Batal
                                </button>
                                <button type="submit" disabled={editForm.processing} className="flex-2 h-16 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-secondary/20 hover:bg-secondary/90 transition-all active:scale-95">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}