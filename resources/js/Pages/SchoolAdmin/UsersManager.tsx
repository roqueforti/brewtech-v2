import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    GraduationCap,
    User,
    Download,
    Upload,
    FileText,
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    X
} from 'lucide-react';

// Fungsi Render Form Input Global - Dipindah keluar agar cursor tidak ter-reset saat re-render
const InputField = ({ form, field, type = "text", placeholder, className = "", required = true }: any) => (
    <input
        type={type}
        placeholder={placeholder}
        value={form.data[field]}
        onChange={e => form.setData(field, e.target.value)}
        className={`w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 font-bold bg-white outline-none transition-all ${className}`}
        required={required}
    />
);

export default function UsersManager({ auth, instructors, students, parents, classes, parentsList }: any) {
    const [activeTab, setActiveTab] = useState('instructors');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const instructorForm = useForm({ name: '', email: '', password: '' });
    const studentForm = useForm({ name: '', disability_type: '', kelas_id: '', parent_id: '' });
    const parentForm = useForm({ name: '', email: '', password: '' });
    const importForm = useForm({ file: null as any });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        disability_type: '',
        kelas_id: '',
        parent_id: '',
    });

    const submitInstructor = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin menambahkan Pelatih ini?')) return;
        instructorForm.post(route('school.users.store', { role: 'instructor' }), {
            onSuccess: () => instructorForm.reset(),
        });
    };

    const submitStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin menambahkan Siswa ini?')) return;
        studentForm.post(route('school.users.store', { role: 'student' }), {
            onSuccess: () => studentForm.reset(),
        });
    };

    const submitParent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin menambahkan Wali Murid ini?')) return;
        parentForm.post(route('school.users.store', { role: 'parent' }), {
            onSuccess: () => parentForm.reset(),
        });
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email || '',
            password: '',
            disability_type: user.disability_type || '',
            kelas_id: user.kelas_id || '',
            parent_id: user.parent_id || '',
        });
    };

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('school.users.update', editingUser.id), {
            onSuccess: () => setEditingUser(null),
        });
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
        editForm.delete(route('school.users.destroy', id), {
            preserveScroll: true
        });
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        importForm.setData('file', file);
        importForm.post(route('school.users.import'), {
            onSuccess: () => {
                alert('Data berhasil diimpor!');
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (errors) => {
                alert('Terjadi kesalahan saat mengimpor data. Pastikan format file benar.');
                console.error(errors);
            }
        });
    };

    const exportData = (type: string) => {
        window.location.href = route('school.users.export', { type });
    };

    // Konfigurasi Tema Tab
    const tabs = [
        { id: 'instructors', label: 'Pelatih', icon: UserCheck, count: instructors.length, color: 'text-primary', bg: 'bg-primary/5' },
        { id: 'students', label: 'Siswa', icon: GraduationCap, count: students.length, color: 'text-secondary', bg: 'bg-secondary/5' },
        { id: 'parents', label: 'Wali Murid', icon: User, count: parents.length, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];


    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Pengguna" />

            <div className="py-6 space-y-10 max-w-[1400px] mx-auto pb-20">
                
                {/* PREMIUM HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-3">
                            <Users size={12} className="text-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Direktori Pengguna</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Data <span className="text-primary">Pengguna</span></h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">Manajemen pengampu, siswa, dan orang tua dalam satu platform terpadu.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            disabled={importForm.processing}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Upload size={16} /> {importForm.processing ? 'Sedang Impor...' : 'Impor'}
                        </button>
                        <button 
                            onClick={() => exportData('excel')} 
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Download size={16} /> Ekspor
                        </button>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-8 py-3 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} strokeWidth={3} /> Tambah Baru
                        </button>

                        <input 
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleImport}
                        />
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                    
                {/* TABS NAVIGATION (PREMIUM PILLS) */}
                <div className="bg-white p-2 border border-slate-100 rounded-[32px] flex flex-wrap gap-2 shadow-sm max-w-2xl mx-auto backdrop-blur-md sticky top-6 z-30">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 px-6 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 relative ${
                                    isActive
                                        ? `bg-slate-900 text-white shadow-xl shadow-slate-900/20`
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <tab.icon size={16} strokeWidth={isActive ? 3 : 1.5} className={isActive ? 'text-primary animate-pulse' : ''} />
                                {tab.label}
                                <span className={`ml-1 px-2.5 py-1 rounded-lg text-[9px] font-black ${isActive ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                    {/* SEARCH BAR */}
                    <div className="relative mb-10 group">
                        <Search size={22} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email pengguna secara cepat..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-slate-50/50 hover:bg-white focus:bg-white font-bold text-slate-900 outline-none shadow-sm transition-all"
                        />
                    </div>

                    {/* TAB CONTENT: INSTRUCTORS */}
                    {activeTab === 'instructors' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* TABLE INSTRUCTOR */}
                            <div className="overflow-hidden rounded-[32px] border border-slate-100 shadow-sm bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100">
                                            <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Pelatih</th>
                                            <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kontak & Akses</th>
                                            <th className="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {instructors.filter((i: any) => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((instructor: any) => (
                                            <tr key={instructor.id} className="group hover:bg-primary/[0.02] transition-colors">
                                                <td className="py-6 px-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-center font-black text-primary shadow-inner transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                                                            {instructor.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-base tracking-tighter uppercase italic">{instructor.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Username: {instructor.username}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-10">
                                                    <div className="inline-flex flex-col gap-1">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-slate-600 font-bold text-[11px] shadow-sm italic">
                                                            <FileText size={14} className="text-secondary" /> {instructor.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <button onClick={() => handleEdit(instructor)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 rounded-xl flex items-center justify-center shadow-sm transition-all hover:rotate-12 group/edit">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(instructor.id)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl flex items-center justify-center shadow-sm transition-all hover:-rotate-12 group/del">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT: STUDENTS */}
                    {activeTab === 'students' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* TABLE STUDENT */}
                            <div className="overflow-hidden rounded-[40px] border border-slate-100 shadow-sm bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100">
                                            <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Siswa</th>
                                            <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Akademik & Kelas</th>
                                            <th className="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Opsi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {students.filter((s: any) => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student: any) => (
                                            <tr key={student.id} className="group hover:bg-secondary/[0.02] transition-colors">
                                                <td className="py-6 px-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 bg-secondary/5 border border-secondary/10 rounded-2xl flex items-center justify-center font-black text-secondary shadow-inner transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-base tracking-tighter uppercase italic">{student.name}</p>
                                                            <span className="text-[9px] font-black bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-lg uppercase tracking-widest mt-1.5 inline-block italic">
                                                                {student.disability_type || 'UMUM'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-10">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                                                            <GraduationCap size={14} className="text-secondary" />
                                                            <span className="font-black text-slate-700 tracking-tight uppercase text-[10px]">{student.studentClass?.name || student.class?.name || 'BELUM TERPLOT'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold tracking-widest uppercase ml-1">
                                                            <User size={12} className="text-amber-500 opacity-70" /> {student.parent?.name || 'BELUM TERTAUT'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <button onClick={() => handleEdit(student)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-secondary hover:border-secondary/30 rounded-xl flex items-center justify-center shadow-sm transition-all hover:rotate-12">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(student.id)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl flex items-center justify-center shadow-sm transition-all hover:-rotate-12">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB CONTENT: PARENTS */}
                    {activeTab === 'parents' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* TABLE PARENTS */}
                            <div className="overflow-hidden rounded-[32px] border border-slate-100 shadow-sm bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/70 border-b border-slate-100">
                                            <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Wali Murid</th>
                                            <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggungan (Anak)</th>
                                            <th className="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Opsi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {parents.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((parent: any) => (
                                            <tr key={parent.id} className="group hover:bg-amber-50/30 transition-colors">
                                                <td className="py-6 px-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center font-black text-amber-600 shadow-inner transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                                                            {parent.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-base tracking-tighter uppercase italic">{parent.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{parent.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-10">
                                                    <div className="flex flex-wrap gap-2">
                                                        {parent.children?.map((child: any, index: number) => (
                                                            <span key={index} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md italic">
                                                                {child.name}
                                                            </span>
                                                        ))}
                                                        {(!parent.children || parent.children.length === 0) && (
                                                            <span className="text-slate-300 font-bold text-[9px] uppercase tracking-widest italic leading-loose">BELUM ADA DATA TERTAUT</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <button onClick={() => handleEdit(parent)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-200 rounded-xl flex items-center justify-center shadow-sm transition-all hover:rotate-12">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(parent.id)} className="w-10 h-10 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl flex items-center justify-center shadow-sm transition-all hover:-rotate-12">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Registrasi <span className="text-primary">Baru</span></h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Pilih peran dan isi detail data pengguna</p>
                            </div>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Toggle Role for Add */}
                        <div className="flex bg-slate-50 p-1 rounded-2xl mb-8">
                            {['instructor', 'student', 'parent'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setActiveTab(role === 'instructor' ? 'instructors' : role === 'student' ? 'students' : 'parents')}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        (activeTab === 'instructors' && role === 'instructor') ||
                                        (activeTab === 'students' && role === 'student') ||
                                        (activeTab === 'parents' && role === 'parent')
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {role === 'instructor' ? 'Pelatih' : role === 'student' ? 'Siswa' : 'Wali'}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'instructors' && (
                            <form onSubmit={(e) => { submitInstructor(e); setIsCreateModalOpen(false); }} className="space-y-6">
                                <InputField form={instructorForm} field="name" placeholder="Nama Lengkap Pelatih" />
                                <InputField form={instructorForm} field="email" type="email" placeholder="Alamat Email" />
                                <InputField form={instructorForm} field="password" type="password" placeholder="Password Access" />
                                <button type="submit" disabled={instructorForm.processing} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all disabled:opacity-50">
                                    Simpan Data Pelatih
                                </button>
                            </form>
                        )}

                        {activeTab === 'students' && (
                            <form onSubmit={(e) => { submitStudent(e); setIsCreateModalOpen(false); }} className="space-y-6">
                                <InputField form={studentForm} field="name" placeholder="Nama Lengkap Siswa" />
                                <InputField form={studentForm} field="disability_type" placeholder="Tipe Disabilitas (Contoh: Autisme)" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Penempatan Kelas</label>
                                        <select value={studentForm.data.kelas_id} onChange={e => studentForm.setData('kelas_id', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold bg-white outline-none focus:ring-4 focus:ring-primary/10">
                                            <option value="">Pilih Kelas</option>
                                            {classes.map((cls: any) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Wali Terkait</label>
                                        <select value={studentForm.data.parent_id} onChange={e => studentForm.setData('parent_id', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold bg-white outline-none focus:ring-4 focus:ring-primary/10">
                                            <option value="">Pilih Wali</option>
                                            {parentsList.map((parent: any) => <option key={parent.id} value={parent.id}>{parent.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" disabled={studentForm.processing} className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50">
                                    Simpan Data Siswa
                                </button>
                            </form>
                        )}

                        {activeTab === 'parents' && (
                            <form onSubmit={(e) => { submitParent(e); setIsCreateModalOpen(false); }} className="space-y-6">
                                <InputField form={parentForm} field="name" placeholder="Nama Lengkap Wali" />
                                <InputField form={parentForm} field="email" type="email" placeholder="Email Wali" />
                                <InputField form={parentForm} field="password" type="password" placeholder="Password Access" />
                                <button type="submit" disabled={parentForm.processing} className="w-full py-5 rounded-2xl bg-amber-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all disabled:opacity-50">
                                    Simpan Data Wali
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Edit {editingUser.role === 'instructor' ? 'Pelatih' : editingUser.role === 'student' ? 'Siswa' : 'Wali Murid'}</h3>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={submitUpdate} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Nama Lengkap</label>
                                <InputField form={editForm} field="name" placeholder="Nama Lengkap" />
                            </div>

                            {(editingUser.role === 'instructor' || editingUser.role === 'parent') && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email</label>
                                        <InputField form={editForm} field="email" type="email" placeholder="Email" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Password (Kosongkan jika tidak diubah)</label>
                                        <InputField form={editForm} field="password" type="password" placeholder="Password Baru" required={false} />
                                    </div>
                                </>
                            )}

                            {editingUser.role === 'student' && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Tipe Disabilitas</label>
                                        <InputField form={editForm} field="disability_type" placeholder="Tipe Disabilitas" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Kelas</label>
                                            <select value={editForm.data.kelas_id} onChange={e => editForm.setData('kelas_id', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold bg-white outline-none">
                                                {classes.map((cls: any) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Wali</label>
                                            <select value={editForm.data.parent_id} onChange={e => editForm.setData('parent_id', e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 font-bold bg-white outline-none">
                                                {parentsList.map((parent: any) => <option key={parent.id} value={parent.id}>{parent.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-8 py-4 rounded-2xl border border-slate-200 font-bold uppercase tracking-widest text-xs text-slate-500 hover:bg-slate-50 transition-all">
                                    Batal
                                </button>
                                <button type="submit" disabled={editForm.processing} className="flex-1 px-8 py-4 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
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