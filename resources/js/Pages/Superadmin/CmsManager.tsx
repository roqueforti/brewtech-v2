import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Image as ImageIcon, 
    Upload, 
    X, 
    Check, 
    Layout, 
    Camera,
    ChevronRight,
    Search,
    AlertCircle,
    Store
} from 'lucide-react';

export default function CmsManager({ auth, assets }: any) {
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [flash, setFlash] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        type: 'hero_banner' as string,
        image: null as File | null,
        title: '',
        description: '',
        order: 0,
        is_active: true,
    });

    const amongRasaSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('section') === 'rasa' && amongRasaSectionRef.current) {
            amongRasaSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const showFlash = (type: 'success' | 'error', msg: string) => {
        setFlash({ type, msg });
        setTimeout(() => setFlash(null), 4000);
    };

    const openCreateModal = () => {
        setEditingAsset(null);
        reset();
        setPreviewImage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (asset: any) => {
        setEditingAsset(asset);
        setData({
            type: asset.type,
            image: null,
            title: asset.title || '',
            description: asset.description || '',
            order: asset.order,
            is_active: !!asset.is_active,
        });
        setPreviewImage(asset.full_image_url || asset.image_path);
        setIsModalOpen(true);
    };

    const [compressing, setCompressing] = useState(false);

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const MAX_SIZE_BYTES = 9 * 1024 * 1024; // 9MB target
            const MAX_DIMENSION = 2560; // max width/height

            // If already small enough, skip compression
            if (file.size <= MAX_SIZE_BYTES) {
                resolve(file);
                return;
            }

            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);

                // Scale dimensions if too large
                let { width, height } = img;
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);

                // Iteratively reduce quality until under MAX_SIZE_BYTES
                let quality = 0.85;
                const tryCompress = () => {
                    canvas.toBlob((blob) => {
                        if (!blob) { resolve(file); return; }
                        if (blob.size <= MAX_SIZE_BYTES || quality <= 0.2) {
                            const compressed = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressed);
                        } else {
                            quality -= 0.1;
                            tryCompress();
                        }
                    }, 'image/jpeg', quality);
                };
                tryCompress();
            };
            img.src = url;
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isInstaller = ['apk_file', 'ipa_file'].includes(data.type);

        if (isInstaller) {
            setData('image', file);
            setPreviewImage(null); // No preview for installers
            return;
        }

        setCompressing(true);
        try {
            const compressed = await compressImage(file);
            setData('image', compressed);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(compressed);
        } finally {
            setCompressing(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = editingAsset
            ? route('superadmin.cms.update', editingAsset.id)
            : route('superadmin.cms.store');

        post(routeName, {
            forceFormData: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setEditingAsset(null);
                reset();
                showFlash('success', editingAsset ? 'Asset berhasil diperbarui!' : 'Asset baru berhasil ditambahkan!');
            },
            onError: (errs) => {
                showFlash('error', Object.values(errs)[0] as string || 'Terjadi kesalahan, coba lagi.');
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus aset ini?')) {
            destroy(route('superadmin.cms.destroy', id), {
                onSuccess: () => showFlash('success', 'Asset berhasil dihapus.'),
            });
        }
    };

    const banners = assets.filter((a: any) => a.type === 'hero_banner');
    const gallery = assets.filter((a: any) => a.type === 'gallery_documentation');
    const amongRasa = assets.filter((a: any) => a.type === 'among_rasa');
    const installers = assets.filter((a: any) => ['apk_file', 'ipa_file'].includes(a.type));

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Kelola Landing Page" />

            <div className="py-6 space-y-12 max-w-[1400px] mx-auto pb-20">

                {/* Flash notification */}
                {flash && (
                    <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-black uppercase tracking-widest flex items-center gap-3 transition-all animate-in slide-in-from-top-4 duration-300 ${
                        flash.type === 'success' ? 'bg-emerald-500 shadow-emerald-400/30' : 'bg-red-500 shadow-red-400/30'
                    }`}>
                        {flash.type === 'success' ? <Check size={18} strokeWidth={3} /> : <AlertCircle size={18} strokeWidth={3} />}
                        {flash.msg}
                    </div>
                )}

                {/* PREMIUM HEADER - CMS LIGHT THEME */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-3">
                            <Layout size={12} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">KONTEN & MEDIA</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">CMS <span className="text-secondary">Welcome Page</span></h2>
                        <p className="text-slate-400 text-sm font-medium mt-1">Kelola banner hero dan galleri dokumentasi untuk halaman depan.</p>
                    </div>
                    
                    <button 
                        onClick={openCreateModal}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} /> Tambah Konten Baru
                    </button>
                </div>

                {/* AMONG RASA SECTION */}
                <section ref={amongRasaSectionRef} className="px-4 md:px-0 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-primary">
                            <Store size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase italic">Mitra Among Rasa</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kelola konten visual dan informasi mitra Kafe Among Rasa</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {amongRasa.map((asset: any) => (
                            <div key={asset.id} className="group relative bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="aspect-[16/9] relative overflow-hidden bg-slate-50">
                                    <img src={asset.full_image_url} alt={asset.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {!asset.is_active && (
                                        <div className="absolute top-6 right-6 bg-red-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-red-400/30">NONAKTIF</div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="font-black text-lg leading-tight uppercase tracking-tight italic text-slate-800">{asset.title || 'Mitra Content'}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 line-clamp-1">{asset.description || 'Tidak ada deskripsi'}</p>
                                        </div>
                                        <div className="bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/10">
                                            <p className="text-[8px] font-black text-primary uppercase tracking-widest">SECTION RASA</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(asset)} className="w-11 h-11 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-white hover:border-primary/30 rounded-xl flex items-center justify-center transition-all hover:rotate-6 group/edit shadow-sm">
                                                <Edit2 size={18} strokeWidth={2.5} />
                                            </button>
                                            <button onClick={() => handleDelete(asset.id)} className="w-11 h-11 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-white hover:border-red-200 rounded-xl flex items-center justify-center transition-all hover:-rotate-6 group/del shadow-sm">
                                                <Trash2 size={18} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {amongRasa.length === 0 && (
                            <div className="col-span-full border-4 border-dashed border-slate-100 rounded-[48px] py-16 flex flex-col items-center justify-center text-slate-200 bg-white/50">
                                <Store size={48} className="mb-4 opacity-20" strokeWidth={1} />
                                <h4 className="text-lg font-black uppercase italic text-slate-400 tracking-tighter">Belum ada konten Among Rasa</h4>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-1">Unggah visual pendukung untuk section mitra kafe</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* HERO BANNERS SECTION */}
                <section className="px-4 md:px-0">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-primary">
                            <Layout size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase italic">Slide Banner Hero</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tampilan utama slideshow halaman depan</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {banners.map((asset: any) => (
                            <div key={asset.id} className="group relative bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="aspect-[16/9] relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                    <img src={asset.full_image_url || asset.image_path} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.classList.add('bg-slate-200'); }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex items-end p-8">
                                        <div className="text-white">
                                            <p className="font-black text-xl leading-tight uppercase tracking-tight italic">{asset.title || 'Tanpa Judul'}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-white/20">ORDER #{asset.order}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {!asset.is_active && (
                                        <div className="absolute top-6 right-6 bg-red-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border border-red-400/30">NONAKTIF</div>
                                    )}
                                </div>
                                <div className="p-6 flex items-center justify-between bg-white">
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(asset)} className="w-11 h-11 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-white hover:border-primary/30 rounded-xl flex items-center justify-center transition-all hover:rotate-6 group/edit shadow-sm">
                                            <Edit2 size={18} strokeWidth={2.5} />
                                        </button>
                                        <button onClick={() => handleDelete(asset.id)} className="w-11 h-11 bg-slate-50 border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-white hover:border-red-200 rounded-xl flex items-center justify-center transition-all hover:-rotate-6 group/del shadow-sm">
                                            <Trash2 size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                    <div className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 italic">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest text-right italic">HERO BANNER</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {banners.length === 0 && (
                            <div className="col-span-full border-4 border-dashed border-slate-100 rounded-[48px] py-24 flex flex-col items-center justify-center text-slate-200 bg-white/50">
                                <ImageIcon size={64} className="mb-6 opacity-20" strokeWidth={1} />
                                <h4 className="text-xl font-black uppercase italic text-slate-400 tracking-tighter">Belum ada banner slideshow</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-2">Segera unggah visual terbaik untuk halaman depan</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* GALLERY SECTION */}
                <section className="px-4 md:px-0">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-secondary">
                            <Camera size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase italic">Galeri Dokumentasi</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kolase momen & kegiatan instruksional</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {gallery.map((asset: any) => (
                            <div key={asset.id} className="group relative bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="aspect-square relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                    <img src={asset.full_image_url || asset.image_path} alt={asset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.classList.add('bg-slate-200'); }} />
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(asset)} className="w-12 h-12 bg-white text-secondary rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl border border-secondary/20"><Edit2 size={20} strokeWidth={3} /></button>
                                            <button onClick={() => handleDelete(asset.id)} className="w-12 h-12 bg-white text-red-500 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-xl border border-red-100"><Trash2 size={20} strokeWidth={3} /></button>
                                        </div>
                                    </div>
                                    {!asset.is_active && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-xl border border-red-400/30">STATUS: OFF</div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <p className="font-black text-xs text-slate-800 truncate uppercase tracking-tight italic italic">{asset.title || 'Foto Dokumentasi'}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Dokumentasi #{asset.order}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DEVELOPER ASSETS SECTION */}
                <section className="px-4 md:px-0">
                    <div className="flex items-center gap-3 mb-8 border-t border-slate-100 pt-12">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-cyan-500">
                            <Upload size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic uppercase italic">Developer Assets</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Installer Android (APK) & iOS (IPA)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {installers.map((asset: any) => (
                            <div key={asset.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${asset.type === 'apk_file' ? 'bg-emerald-100 text-emerald-600' : 'bg-cyan-100 text-cyan-600'}`}>
                                        <Upload size={24} strokeWidth={3} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-800 uppercase tracking-tight truncate italic">{asset.title || (asset.type === 'apk_file' ? 'Installer Android' : 'Installer iOS')}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{asset.type === 'apk_file' ? 'APK File' : 'IPA File'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(asset)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary rounded-xl border border-slate-100 transition-all"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(asset.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status:</p>
                                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${asset.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'}`}>{asset.is_active ? 'TERPASANG' : 'NONAKTIF'}</span>
                                </div>
                                <a href={asset.image_path} target="_blank" className="w-full py-3 bg-slate-900 text-white rounded-xl text-center text-[9px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-xl active:scale-95 transition-all">TEST DOWNLOAD</a>
                            </div>
                        ))}
                        {installers.length === 0 && (
                            <div className="md:col-span-3 border-2 border-dashed border-slate-100 rounded-3xl py-10 flex flex-col items-center justify-center text-slate-300">
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Belum ada master installer untuk developer</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* MODAL EDIT/CREATE - PREMIUM VERSION */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                    {editingAsset ? 'Revisi ' : 'Bentuk '}
                                    <span className={editingAsset ? 'text-secondary' : 'text-primary'}>
                                        {editingAsset ? 'Konten' : 'Media Baru'}
                                    </span>
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">PROSES KONFIGURASI ASET VISUAL</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white hover:bg-slate-100 text-slate-400 rounded-2xl transition-all border border-slate-100 active:scale-95 shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Format Arsitektur Media</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'hero_banner', label: 'Slide Hero', icon: Layout, color: 'primary' },
                                            { id: 'gallery_documentation', label: 'Foto Galeri', icon: Camera, color: 'secondary' },
                                            { id: 'among_rasa', label: 'Among Rasa', icon: Store, color: 'emerald-500' },
                                            { id: 'apk_file', label: 'Master APK', icon: Upload, color: 'emerald-600' },
                                            { id: 'ipa_file', label: 'Master IPA', icon: Upload, color: 'cyan-600' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                    setData('type', t.id as any);
                                                    setPreviewImage(null);
                                                }}
                                                className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                                                    data.type === t.id 
                                                        ? t.id === 'among_rasa' ? 'bg-emerald-500/5 border-emerald-500 text-emerald-500 shadow-inner'
                                                        : t.id === 'apk_file' ? 'bg-emerald-600/5 border-emerald-600 text-emerald-600 shadow-inner'
                                                        : t.id === 'ipa_file' ? 'bg-cyan-600/5 border-cyan-600 text-cyan-600 shadow-inner'
                                                        : `bg-${t.color}/5 border-${t.color} text-${t.color} shadow-inner` 
                                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                                }`}
                                            >
                                                <div className={`p-2.5 rounded-xl transition-colors ${data.type === t.id ? (t.id === 'among_rasa' ? 'bg-emerald-500/10' : t.id === 'apk_file' ? 'bg-emerald-600/10' : t.id === 'ipa_file' ? 'bg-cyan-600/10' : `bg-${t.color}/10`) : 'bg-slate-50'}`}>
                                                    <t.icon size={20} strokeWidth={3} />
                                                </div>
                                                <span className="text-[11px] font-black uppercase tracking-widest">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Visual Media Unggahan</label>
                                    <div 
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                        className={`relative aspect-[16/9] rounded-[32px] border-4 border-dashed overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden ${
                                            previewImage ? 'border-primary/20' : 'border-slate-100 hover:border-primary/30 bg-slate-50'
                                        }`}
                                    >
                                        {compressing ? (
                                            <div className="flex flex-col items-center justify-center gap-4 p-8">
                                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                                <p className="text-[11px] font-black text-primary uppercase tracking-widest italic">Mengompresi Gambar...</p>
                                            </div>
                                        ) : previewImage ? (
                                            <>
                                                <img src={previewImage} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                    <div className="bg-white px-6 py-3 rounded-2xl text-primary font-black text-[10px] uppercase tracking-widest shadow-2xl scale-95 hover:scale-100 transition-transform">GANTI VISUAL MEDIA</div>
                                                </div>
                                            </>
                                        ) : ['apk_file', 'ipa_file'].includes(data.type) && data.image ? (
                                            <div className="text-center p-8 group">
                                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm mx-auto mb-4 ${data.type === 'apk_file' ? 'bg-emerald-100 text-emerald-600' : 'bg-cyan-100 text-cyan-600'}`}>
                                                    <Check size={32} strokeWidth={3} />
                                                </div>
                                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic">{data.image.name}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">File Siap Unggah</p>
                                            </div>
                                        ) : (
                                            <div className="text-center p-8 group">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload size={28} strokeWidth={1.5} />
                                                </div>
                                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">
                                                    Ketuk untuk Mengunggah
                                                </p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2 bg-slate-200/50 px-3 py-1 rounded-full inline-block">
                                                    Maksimum 10MB
                                                </p>
                                            </div>
                                        )}
                                        <input 
                                            id="image-upload" 
                                            type="file" 
                                            className="hidden" 
                                            onChange={handleFileChange}
                                            accept={['apk_file', 'ipa_file'].includes(data.type) ? ".apk,.ipa,.zip" : "image/*"}
                                        />
                                    </div>
                                    {errors.image && <p className="text-red-500 text-[10px] font-black mt-3 italic ml-4 uppercase tracking-widest">{errors.image}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Identitas Judul (Opsional)</label>
                                        <input 
                                            type="text" 
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-[13px] font-black text-slate-900 placeholder:text-slate-300 outline-none focus:border-primary focus:bg-white transition-all uppercase italic" 
                                            placeholder="Label media..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-4">Urutan</label>
                                        <input 
                                            type="number" 
                                            value={data.order}
                                            onChange={e => setData('order', parseInt(e.target.value))}
                                            className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-sm font-black text-slate-900 outline-none focus:border-primary focus:bg-white transition-all shadow-inner" 
                                            min="0"
                                        />
                                    </div>
                                </div>
                                
                                <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 text-slate-400'}`}>
                                            <Check size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-tight text-slate-700 italic">Status Publikasi</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tampilkan aset di welcome page</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`w-14 h-8 rounded-full transition-all relative ${data.is_active ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${data.is_active ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 h-16 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all italic"
                                >
                                    BATALKAN
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`flex-[2] h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 text-white ${
                                        editingAsset ? 'bg-secondary shadow-secondary/20 hover:bg-secondary/90' : 'bg-primary shadow-primary/20 hover:bg-primary/90'
                                    }`}
                                >
                                    {processing ? 'SINCHRONIZING...' : (editingAsset ? 'SIMPAN PERUBAHAN' : 'LANCARKAN MEDIA')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
