import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Store, Plus, Phone, MapPin, 
    Trash2, Edit3, Search, X, Save,
    Coffee, AlertCircle
} from 'lucide-react';

interface Cafe {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: 'active' | 'inactive' | 'maintenance';
}

export default function Index({ auth, cafes = [] }: { auth: any, cafes: Cafe[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, patch, processing, reset, errors, clearErrors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active' as const,
    });

    const filteredCafes = useMemo(() => {
        return cafes.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, cafes]);

    const openCreateModal = () => {
        setEditMode(false);
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (cafe: Cafe) => {
        setEditMode(true);
        setSelectedId(cafe.id);
        clearErrors();
        setData({
            name: cafe.name,
            email: cafe.email,
            phone: cafe.phone || '',
            address: cafe.address || '',
            status: cafe.status,
        });
        setIsModalOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const actionText = editMode ? 'menyimpan perubahan' : 'mendaftarkan kafe baru';
        if (!confirm(`Apakah Anda yakin ingin ${actionText}?`)) return;

        if (editMode && selectedId) {
            patch(route('superadmin.cafes.update', selectedId), { 
                onSuccess: () => setIsModalOpen(false) 
            });
        } else {
            post(route('superadmin.cafes.store'), { 
                onSuccess: () => setIsModalOpen(false) 
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus mitra kafe ini secara permanen?')) {
            router.delete(route('superadmin.cafes.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Manajemen Kafe" />
            
            <div className="py-8 space-y-8 max-w-7xl mx-auto">
                
                {/* HEADER SECTION (Playful EdTech Style) */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Mitra Industri Kafe</h2>
                        <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
                            Kelola data mitra industri dan lokasi kerja lapangan tempat siswa mempraktikkan keterampilan mereka.
                        </p>
                    </div>
                    
                    {/* Tombol Pink Pill */}
                    <button 
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shrink-0"
                    >
                        <Plus size={16} /> Daftarkan Kafe Baru
                    </button>
                </div>

                {/* TOOLBAR PENCARIAN (Pill Shape) */}
                <div className="relative max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} strokeWidth={3} />
                    <input 
                        type="text"
                        placeholder="Cari nama kafe atau email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-0 focus:border-primary outline-none text-sm text-slate-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* GRID LIST KAFE */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCafes.length === 0 ? (
                        <div className="col-span-full text-center py-16 border border-slate-200 rounded-2xl bg-white flex flex-col items-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                                <Store size={24} />
                            </div>
                            <h3 className="text-base font-semibold text-slate-800 mb-1">Belum Ada Mitra Terdaftar</h3>
                            <p className="text-sm text-slate-400">Pencarian tidak menemukan hasil, atau data masih kosong.</p>
                        </div>
                    ) : (
                        filteredCafes.map((cafe) => (
                            <div 
                                key={cafe.id} 
                                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 flex flex-col relative transition-all"
                            >
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                        <Coffee size={22} />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                        cafe.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                        cafe.status === 'maintenance' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                        'bg-amber-50 text-amber-600 border-amber-200'
                                    }`}>
                                        {cafe.status}
                                    </span>
                                </div>
                                
                                {/* Judul & Email */}
                                <h3 className="font-semibold text-slate-900 mb-0.5 leading-tight truncate">
                                    {cafe.name}
                                </h3>
                                <p className="text-[13px] text-slate-400 font-medium mb-6 italic truncate">
                                    {cafe.email}
                                </p>
                                
                                {/* Info Alamat & Telp (Box Lembut) */}
                                <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 space-y-2 flex-grow">
                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                                        <p className="line-clamp-2 leading-relaxed">{cafe.address || 'Alamat belum diatur'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone size={14} className="text-primary" />
                                        <p>{cafe.phone || 'Nomor tidak tersedia'}</p>
                                    </div>
                                </div>

                                {/* Area Tombol Aksi Bawah */}
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleDelete(cafe.id)}
                                        className="bg-red-50 text-red-400 hover:text-red-500 hover:bg-red-100 p-3.5 rounded-2xl transition-colors shrink-0 flex items-center justify-center"
                                        title="Hapus Kafe"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <button 
                                        onClick={() => openEditModal(cafe)}
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold transition-colors flex flex-1 items-center justify-center gap-2 text-sm"
                                    >
                                        <Edit3 size={18} /> Edit Mitra
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* MODAL (Playful Style) */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                        
                        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        {editMode ? 'Edit Data Mitra' : 'Daftarkan Kafe'}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-0.5">Lengkapi informasi resmi kafe di bawah ini.</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-colors">
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Nama Usaha / Kafe</label>
                                    <input 
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-bold text-slate-700 outline-none"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Contoh: Kopi Nako"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1 ml-2"><AlertCircle size={14} strokeWidth={3}/> {errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Email Resmi</label>
                                        <input 
                                            type="email"
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-bold text-slate-700 outline-none"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="admin@kafe.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1 ml-2"><AlertCircle size={14} strokeWidth={3}/> {errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Status</label>
                                        <select 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-bold text-slate-700 outline-none"
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value as any)}
                                        >
                                            <option value="active">Active</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Nomor Telepon</label>
                                    <input 
                                        type="text"
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-bold text-slate-700 outline-none"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="08123456789"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Alamat Fisik</label>
                                    <textarea 
                                        rows={3}
                                        className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-bold text-slate-700 resize-none outline-none"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        placeholder="Tuliskan alamat lengkap..."
                                    />
                                </div>

                                <div className="pt-6 flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-3.5 rounded-full font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        disabled={processing}
                                        className="flex-1 bg-[#FF007F] hover:bg-[#e60073] text-white py-3.5 rounded-full font-bold transition-transform active:scale-95 flex justify-center items-center gap-2"
                                    >
                                        {processing ? (
                                            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <><Save size={20} strokeWidth={3} /> {editMode ? 'Simpan Perubahan' : 'Daftarkan Mitra'}</>
                                        )}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}