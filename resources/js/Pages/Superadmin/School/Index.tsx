import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Building2, MapPin, Phone, Mail, Plus, Trash2, X } from 'lucide-react';

export default function Index({ auth, schools }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', email: '', password: '', address: '', phone: ''
    });

    const submit = (e: any) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin mendaftarkan SLB baru ini?')) return;
        post(route('superadmin.schools.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            }
        });
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="text-2xl font-bold text-slate-800">Manajemen Mitra SLB</h2>}
        >
            <Head title="Mitra Sekolah" />

            <div className="py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <p className="text-slate-500 text-sm max-w-xl">
                        Daftar Sekolah Luar Biasa (SLB) yang terdaftar di ekosistem Brewtech. 
                        Sekolah dapat mengadopsi modul dan mendaftarkan siswanya.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-secondary/90 transition-all shadow-sm shrink-0"
                    >
                        <Plus size={16} /> Daftarkan SLB Baru
                    </button>
                </div>

                {/* GRID DAFTAR SEKOLAH */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schools.length === 0 ? (
                        <div className="col-span-full text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                            <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-base font-semibold text-slate-700 mb-1">Belum Ada Mitra Terdaftar</h3>
                            <p className="text-slate-400 text-sm">Mulai bangun ekosistem dengan mendaftarkan SLB pertama Anda.</p>
                        </div>
                    ) : (
                        schools.map((school: any) => (
                            <div key={school.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary/30 shadow-sm hover:shadow-md transition-all flex flex-col group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Building2 size={28} />
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg">Aktif</span>
                                </div>
                                <h3 className="font-semibold text-slate-800 mb-2 leading-tight">
                                    {school.name}
                                </h3>
                                
                                <div className="space-y-3 mt-4 flex-grow">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <Mail size={14} className="text-slate-400 shrink-0" /> 
                                        <span className="truncate text-xs">
                                            {school.users && school.users.length > 0 ? school.users[0].email : 'Belum ada admin'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Phone size={14} className="text-slate-400 shrink-0" /> 
                                        <span className="text-xs">{school.phone || '-'}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-slate-500">
                                        <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" /> 
                                        <span className="line-clamp-2 text-xs">{school.address || 'Alamat belum diisi'}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                                    <Link 
                                        as="button"
                                        onClick={() => {
                                            if (confirm('Yakin ingin menghapus sekolah ini secara permanen?')) {
                                                router.delete(route('superadmin.schools.destroy', school.id));
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5 text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors"
                                    >
                                        <Trash2 size={16} /> Hapus
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MODAL TAMBAH SEKOLAH */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0" 
                        onClick={() => setIsModalOpen(false)} // Tutup jika klik luar
                    ></div>
                    
                    <div className="bg-white rounded-2xl w-full max-w-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                                <Building2 size={18} className="text-primary" /> Daftarkan SLB Baru
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Sekolah (SLB)</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        required 
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none" 
                                        placeholder="Contoh: SLB Negeri 1 Malang" 
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Admin (Akses Login)</label>
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={e => setData('email', e.target.value)} 
                                            required 
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none" 
                                            placeholder="admin@slbn1.sch.id" 
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password Akun</label>
                                        <input 
                                            type="password" 
                                            value={data.password} 
                                            onChange={e => setData('password', e.target.value)} 
                                            required 
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none" 
                                            placeholder="Minimal 8 karakter" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Telepon Sekolah</label>
                                    <input 
                                        type="text" 
                                        value={data.phone} 
                                        onChange={e => setData('phone', e.target.value)} 
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none" 
                                        placeholder="08123xxxx" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Lengkap</label>
                                    <textarea 
                                        value={data.address} 
                                        onChange={e => setData('address', e.target.value)} 
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-0 outline-none" 
                                        rows={3} 
                                        placeholder="Alamat jalan..." 
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="flex-1 py-3 rounded-xl font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 shadow-sm"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Mitra'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}