import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Plus, Trash2, Settings, PlayCircle } from 'lucide-react';

export default function Index({ auth, modules = [] }: any) {

    // Fungsi konfirmasi sebelum menghapus modul
    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus modul ini secara permanen beserta semua materi dan kuisnya?')) {
            router.delete(route('superadmin.modules.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth?.user} 
        >
            <Head title="Modul Builder" />
            
            <div className="py-8 space-y-8 max-w-7xl mx-auto">
                
                {/* HEADER SECTION (Sesuai Gambar) */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <p className="text-slate-600 font-bold max-w-xl text-[15px] leading-relaxed">
                        Kelola "Bank Modul Nasional" Brewtech. Kurikulum yang disusun di sini akan dienkripsi dan didistribusikan ke seluruh SLB Mitra.
                    </p>
                    
                    {/* Tombol Pink (Pill shape) */}
                    <Link 
                        href={route('superadmin.modules.create')} 
                        className="flex items-center justify-center gap-2 bg-[#FF007F] hover:bg-[#e60073] text-white px-8 py-3.5 rounded-full font-bold transition-transform active:scale-95 shrink-0"
                    >
                        <Plus size={20} strokeWidth={3} /> Buat Modul Baru
                    </Link>
                </div>

                {/* GRID DAFTAR MODUL */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.length === 0 ? (
                        <div className="col-span-full text-center py-20 border-2 border-slate-200 rounded-[2.5rem] bg-white flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#51CBE0]/20 rounded-2xl flex items-center justify-center mb-4 text-[#51CBE0]">
                                <BookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-1">Belum Ada Kurikulum</h3>
                        </div>
                    ) : (
                        modules.map((m: any) => (
                            /* CARD PLAYFUL NEO-BRUTALISM */
                            /* Menggunakan border biru cyan dan solid shadow biru cyan */
                            <div 
                                key={m.id} 
                                className="bg-white border-2 border-[#51CBE0] rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_#51CBE0] flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#51CBE0]"
                            >
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 bg-[#51CBE0] text-white rounded-2xl flex items-center justify-center shrink-0">
                                        <BookOpen size={28} />
                                    </div>
                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-slate-200">
                                        Modul Ke-{m.order || 1}
                                    </span>
                                </div>
                                
                                {/* Judul & Deskripsi */}
                                <h3 className="font-black text-2xl text-slate-900 mb-1 leading-tight">
                                    {m.title}
                                </h3>
                                <p className="text-[13px] text-slate-400 font-medium mb-6 italic line-clamp-2 flex-grow">
                                    {m.description || 'Belum ada deskripsi.'}
                                </p>
                                
                                {/* Info Statistik (Box Abu-abu Lembut) */}
                                <div className="flex gap-3 mb-6">
                                    <div className="bg-slate-50 rounded-2xl py-3 px-2 flex-1 text-center border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Praktikum</p>
                                        <p className="font-black text-slate-700 text-base">{m.materials_count || 0} Item</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl py-3 px-2 flex-1 text-center border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Soal Kuis</p>
                                        <p className="font-black text-slate-700 text-base">{m.questions_count || 0} Soal</p>
                                    </div>
                                </div>

                                {/* Area Tombol Aksi Bawah */}
                                <div className="flex gap-2">
                                    {/* Tombol Hapus (Merah) - Menggunakan fungsi onClick yang ada konfirmasinya */}
                                    <button 
                                        onClick={() => handleDelete(m.id)}
                                        className="bg-red-50 text-red-400 hover:text-red-500 hover:bg-red-100 p-3.5 rounded-2xl transition-colors shrink-0 flex items-center justify-center"
                                        title="Hapus Modul"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    
                                    {/* Tombol Edit Isi (Abu-abu) - UPDATE RUTE KE .edit */}
                                    <Link 
                                        href={route('superadmin.modules.edit', m.id)} 
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-3.5 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 shrink-0 text-sm"
                                    >
                                        <Settings size={18} /> Edit Isi
                                    </Link>
                                    
                                    {/* Tombol Preview (Biru Cyan Solid) - UBAH JADI <Link> DAN ARAHKAN KE .show */}
                                    <Link 
                                        href={route('superadmin.modules.show', m.id)}
                                        className="bg-[#51CBE0] hover:bg-[#45b8cc] text-white py-3.5 rounded-2xl font-bold transition-colors flex flex-1 items-center justify-center gap-2 text-sm"
                                    >
                                        <PlayCircle size={18} /> Preview
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}