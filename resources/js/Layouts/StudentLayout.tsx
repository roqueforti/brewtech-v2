import React from 'react';
import { Link } from '@inertiajs/react';
import { Coffee, Home, ArrowLeft, LogOut } from 'lucide-react';

export default function StudentLayout({ children, user }: any) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-body text-slate-800">
            {/* Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Coffee size={24} className="text-primary" />
                    </div>
                    <div>
                        <span className="block font-display font-bold text-lg text-slate-900 leading-none tracking-tight">BREWTECH</span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Pusat Belajar Vokasi</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Siswa Terdaftar</span>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                        title="Keluar"
                    >
                        <LogOut size={20} />
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-10 max-w-5xl mx-auto w-full pb-32">
                {children}
            </main>

            {/* Fixed Bottom Navigation */}
            <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl border border-slate-200/50 p-2.5 rounded-2xl shadow-2xl z-50 flex gap-2">
                <Link
                    href={route('student.dashboard')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all ${route().current('student.dashboard') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                >
                    <Home size={22} strokeWidth={2.5} />
                    <span className="font-bold text-sm">Beranda</span>
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 shadow-sm"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                    <span className="font-bold text-sm">Kembali</span>
                </button>
            </footer>
        </div>
    );
}