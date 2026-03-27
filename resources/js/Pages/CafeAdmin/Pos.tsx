import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ShoppingCart, Plus, Minus, Trash, CheckCircle } from 'lucide-react';

export default function Pos({ auth, products }: any) {
    const [cart, setCart] = useState<any[]>([]);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(item => item.product_id === product.id);
            if (existing) {
                return prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product_id: product.id, name: product.name, price: parseFloat(product.price), quantity: 1, stock: product.stock }];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.product_id === id) {
                    const newQ = item.quantity + delta;
                    if (newQ < 1 || newQ > item.stock) return item;
                    return { ...item, quantity: newQ };
                }
                return item;
            });
        });
    };

    const removeItem = (id: number) => {
        setCart(prev => prev.filter(item => item.product_id !== id));
    };

    const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        router.post(route('cafe.pos.checkout'), {
            items: cart.map(c => ({ product_id: c.product_id, quantity: c.quantity })),
            total_amount: totalAmount,
            customer_name: 'Guest'
        }, {
            onSuccess: () => setCart([])
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="POS Kasir" />

            {/* Split layout: Left (Products), Right (Cart) */}
            <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 p-4 md:p-8 max-w-[1400px] mx-auto">
                
                {/* Left: Products */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center">
                            <ShoppingCart size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Menu Tersedia</h2>
                            <p className="text-xs text-slate-500 font-semibold tracking-tight">Pilih item untuk ditambahkan ke pesanan</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {products.length === 0 ? (
                            <div className="col-span-full py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400">
                                <p className="font-bold text-sm">Belum ada menu tersedia.</p>
                            </div>
                        ) : (
                            products.map((p: any) => (
                                <button 
                                    key={p.id} 
                                    onClick={() => addToCart(p)}
                                    disabled={p.stock < 1}
                                    className="bg-white border border-slate-100 rounded-xl p-6 text-left shadow-sm hover:shadow-md transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group flex flex-col h-full relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full -mr-8 -mt-8 group-hover:bg-primary/5 transition-colors"></div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors mb-4 relative z-10 leading-snug">{p.name}</h3>
                                    <div className="mt-auto relative z-10">
                                        <p className="text-lg font-bold text-slate-900">Rp{parseFloat(p.price).toLocaleString('id-ID')}</p>
                                        <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-widest">Stok: {p.stock}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Cart Panel */}
                <div className="w-full lg:w-[420px] bg-slate-900 text-white rounded-2xl p-8 shadow-2xl flex flex-col h-[500px] lg:h-full shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-white/10 pb-6 mb-8 relative z-10">Pesanan Saat Ini</h3>
                    
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-dark-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-700 font-bold italic relative z-10">
                                <ShoppingCart size={48} className="mb-4 opacity-20" />
                                <p className="text-xs uppercase tracking-widest opacity-40">Keranjang Kosong</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product_id} className="bg-white/[0.03] rounded-xl p-5 border border-white/5 relative z-10 group hover:bg-white/[0.05] transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-white text-sm pr-4 line-clamp-2 leading-relaxed">{item.name}</h4>
                                        <button onClick={() => removeItem(item.product_id)} className="text-slate-500 hover:text-red-400 p-1.5 transition-colors">
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="font-bold text-emerald-400">
                                            Rp{(item.price * item.quantity).toLocaleString('id-ID')}
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-950 px-3 py-2 rounded-lg border border-white/5">
                                            <button onClick={() => updateQuantity(item.product_id, -1)} className="text-slate-500 hover:text-white transition-colors"><Minus size={14} /></button>
                                            <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product_id, 1)} className="text-slate-500 hover:text-white transition-colors"><Plus size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-white/5 pt-8 mt-auto relative z-10">
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Total Tagihan</span>
                            <span className="text-3xl font-bold text-emerald-400 tracking-tighter">Rp{totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                        
                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full bg-primary text-white py-5 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <CheckCircle size={18} /> Checkout Sekarang
                        </button>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
