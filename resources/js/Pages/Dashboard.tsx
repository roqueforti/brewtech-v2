import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-slate-800 leading-tight tracking-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden border border-slate-100 shadow-sm rounded-3xl">
                        <div className="p-8 text-slate-600 font-medium">Selamat datang! Silakan pilih modul di sidebar untuk memulai.</div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
