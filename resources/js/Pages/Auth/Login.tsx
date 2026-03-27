import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserCircle, KeyRound, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 flex items-center justify-center p-4">
            <Head title="Masuk ke Brewtech" />

            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border-2 border-slate-200 p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white border-2 border-primary shadow-[3px_3px_0px_rgba(0,0,0,0.1)] mx-auto mb-4">
                        <UserCircle size={32} />
                    </div>
                    <h1 className="font-display text-2xl font-black text-slate-800 mb-2">Masuk ke Brewtech</h1>
                    <p className="text-sm font-medium text-slate-500">Akses akun Anda untuk melanjutkan</p>
                </div>

                {status && <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">{status}</div>}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Email / Username</label>
                        <div className="relative">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={e => setData('email', e.target.value)} 
                                required 
                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" 
                                placeholder="admin@domain.com" 
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs font-bold mt-2">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                value={data.password} 
                                onChange={e => setData('password', e.target.value)} 
                                required 
                                className="w-full pl-12 pr-12 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-sm font-bold text-slate-800" 
                                placeholder="••••••••" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs font-bold mt-2">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={e => setData('remember', e.target.checked)}
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="ms-2 text-sm font-bold text-slate-600">Ingat saya</span>
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-bold text-primary hover:text-primary/80 underline"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="w-full py-4 mt-4 text-white font-display font-black text-lg rounded-xl transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:translate-y-1 hover:shadow-none flex items-center justify-center gap-2 border-2 bg-secondary border-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Memproses...' : 'Masuk Sekarang'} <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-700">
                        &larr; Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
