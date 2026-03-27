import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Package, Plus, Trash2, Edit, X } from 'lucide-react';

export default function Products({ auth, products }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', price: '', cost_price: '', stock: '', status: true
    });

    const submit = (e: any) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin menambahkan menu ini?')) return;
        post(route('cafe.products.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Produk" />

            <div className="py-8 max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 border border-orange-200 rounded-xl flex items-center justify-center">
                            <Package size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-0.5">Katalog Menu</h2>
                            <p className="text-slate-500 text-xs font-semibold tracking-tight">Kelola produk yang tersedia di POS kasir Anda.</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Tambah Menu
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full py-24 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400">
                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-1">Belum ada menu</h3>
                            <p className="text-xs font-medium opacity-60">Tambah menu pertama Anda untuk mulai berjualan.</p>
                        </div>
                    ) : (
                        products.map((product: any) => (
                            <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                <div className={`absolute top-0 right-0 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-bl-lg ${product.status ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                                    {product.status ? 'Aktif' : 'Habis'}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 leading-snug mt-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                <p className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                                    Rp{(parseFloat(product.price)).toLocaleString('id-ID')}
                                </p>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-dashed border-slate-200 pb-4">
                                    Modal (HPP): <span className="text-slate-600">Rp{(parseFloat(product.cost_price ?? 0)).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="mt-auto flex justify-between items-center text-[10px] font-semibold text-slate-400 bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-100 mb-4 items-center">
                                    <span className="uppercase tracking-wider">Stok:</span>
                                    <span className={product.stock < 10 ? 'text-red-500 font-bold' : 'text-slate-600 font-bold'}>{product.stock} unit</span>
                                </div>
                                
                                <button onClick={() => {
                                    if (confirm('Yakin ingin menghapus menu ini dari POS?')) {
                                        router.delete(route('cafe.products.destroy', product.id));
                                    }
                                }} className="w-full bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border border-slate-100">
                                    <Trash2 size={14} /> Hapus Menu
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Tambah Produk */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Tambah Menu Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-lg border border-transparent active:scale-95 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5">Nama Menu</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-800 focus:border-orange-500 focus:ring-0 placeholder:text-slate-300 placeholder:font-medium transition-all" placeholder="Kopi Susu Gula Aren" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5">Harga Jual (Rp)</label>
                                    <input type="number" value={data.price} onChange={e => setData('price', e.target.value)} required min="0" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-800 focus:border-orange-500 focus:ring-0 placeholder:text-slate-300 placeholder:font-medium transition-all" placeholder="15000" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5">Modal/HPP (Rp)</label>
                                    <input type="number" value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} required min="0" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-800 focus:border-orange-500 focus:ring-0 placeholder:text-slate-300 placeholder:font-medium transition-all" placeholder="8000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2.5">Stok Awal</label>
                                <input type="number" value={data.stock} onChange={e => setData('stock', e.target.value)} required min="0" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-slate-800 focus:border-orange-500 focus:ring-0 placeholder:text-slate-300 placeholder:font-medium transition-all" placeholder="50" />
                            </div>
                            <div className="flex items-center gap-3 py-2">
                                <input type="checkbox" checked={data.status} onChange={e => setData('status', e.target.checked)} id="status" className="w-5 h-5 rounded border-slate-200 text-orange-500 focus:ring-orange-500/20" />
                                <label htmlFor="status" className="text-xs font-bold text-slate-600 cursor-pointer">Menu langsung tersedia (Aktif)</label>
                            </div>

                            <button type="submit" disabled={processing} className="w-full mt-2 bg-primary text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50">
                                {processing ? 'Menyimpan...' : 'Simpan Menu'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
