import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Activity, 
    User as UserIcon, 
    Clock, 
    Monitor, 
    Box, 
    ShoppingCart, 
    CreditCard, 
    BookOpen, 
    School, 
    Coffee,
    LogOut,
    LogIn,
    PlusCircle,
    Edit,
    Trash2,
    Crown,
    GraduationCap,
    Users,
    Baby,
    ChefHat
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ActivityLog {
    id: number;
    user_id: number | null;
    action: string;
    model_type: string | null;
    model_id: number | null;
    details: any;
    ip_address: string;
    user_agent: string;
    created_at: string;
    user: { id: number; name: string; role: string } | null;
}

interface PaginationData {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
}

interface RoleStat   { role: string; total: number; }
interface ActionStat { action: string; total: number; }

const ROLE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; ring: string }> = {
    superadmin:   { label: 'Superadmin',    icon: Crown,         color: 'text-violet-700', bg: 'bg-violet-50',  ring: 'ring-violet-200' },
    school_admin: { label: 'Admin Sekolah', icon: School,        color: 'text-blue-700',   bg: 'bg-blue-50',    ring: 'ring-blue-200'   },
    instructor:   { label: 'Pelatih',       icon: GraduationCap, color: 'text-emerald-700',bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
    student:      { label: 'Siswa',         icon: Baby,          color: 'text-orange-700', bg: 'bg-orange-50',  ring: 'ring-orange-200' },
    parent:       { label: 'Wali Murid',    icon: Users,         color: 'text-pink-700',   bg: 'bg-pink-50',    ring: 'ring-pink-200'   },
    cafe_admin:   { label: 'Admin Kafe',    icon: ChefHat,       color: 'text-amber-700',  bg: 'bg-amber-50',   ring: 'ring-amber-200'  },
};

const ACTION_CONFIG: Record<string, { color: string; bg: string }> = {
    Login:   { color: 'text-purple-700', bg: 'bg-purple-100' },
    Logout:  { color: 'text-slate-600',  bg: 'bg-slate-100'  },
    Created: { color: 'text-green-700',  bg: 'bg-green-100'  },
    Updated: { color: 'text-blue-700',   bg: 'bg-blue-100'   },
    Deleted: { color: 'text-red-700',    bg: 'bg-red-100'    },
};

const getActionColor = (action: string) => {
    const map: Record<string, string> = {
        Created: 'bg-green-100 text-green-700 border-green-200',
        Updated: 'bg-blue-100 text-blue-700 border-blue-200',
        Deleted: 'bg-red-100 text-red-700 border-red-200',
        Login:   'bg-purple-100 text-purple-700 border-purple-200',
        Logout:  'bg-gray-100 text-gray-700 border-gray-200',
    };
    return map[action] ?? 'bg-slate-100 text-slate-700 border-slate-200';
};

const getActionIcon = (action: string) => {
    const map: Record<string, React.ReactNode> = {
        Created: <PlusCircle className="w-4 h-4 mr-1.5" />,
        Updated: <Edit       className="w-4 h-4 mr-1.5" />,
        Deleted: <Trash2     className="w-4 h-4 mr-1.5" />,
        Login:   <LogIn      className="w-4 h-4 mr-1.5" />,
        Logout:  <LogOut     className="w-4 h-4 mr-1.5" />,
    };
    return map[action] ?? <Activity className="w-4 h-4 mr-1.5" />;
};

const getModelIcon = (modelType: string | null) => {
    if (!modelType) return <Monitor className="w-4 h-4" />;
    if (modelType.includes('User'))       return <UserIcon     className="w-4 h-4" />;
    if (modelType.includes('School') || modelType.includes('StudyClass')) return <School className="w-4 h-4" />;
    if (modelType.includes('Cafe'))       return <Coffee       className="w-4 h-4" />;
    if (modelType.includes('Product'))    return <ShoppingCart className="w-4 h-4" />;
    if (modelType.includes('Transaction'))return <CreditCard   className="w-4 h-4" />;
    if (modelType.includes('Module'))     return <BookOpen     className="w-4 h-4" />;
    return <Box className="w-4 h-4" />;
};

const formatModelName = (modelType: string | null) => {
    if (!modelType) return '-';
    const parts = modelType.split('\\');
    return parts[parts.length - 1];
};

export default function Logs({ auth, logs, roleStats, actionStats, totalLogs }: PageProps<{
    logs: PaginationData;
    roleStats: RoleStat[];
    actionStats: ActionStat[];
    totalLogs: number;
}>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200">
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-slate-800 leading-tight">Log Aktivitas Nasional</h2>
                        <p className="text-sm text-slate-500 font-medium">Monitoring sistem real-time terpusat — {totalLogs?.toLocaleString('id-ID')} total aktivitas.</p>
                    </div>
                </div>
            }
        >
            <Head title="Log Aktivitas" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                {/* ── STAT CARDS PER ROLE ── */}
                <div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">Aktivitas per Peran</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {roleStats?.map((rs) => {
                            const cfg = ROLE_CONFIG[rs.role] ?? { label: rs.role, icon: UserIcon, color: 'text-slate-700', bg: 'bg-slate-50', ring: 'ring-slate-200' };
                            const Icon = cfg.icon;
                            const pct = totalLogs > 0 ? Math.round((rs.total / totalLogs) * 100) : 0;
                            return (
                                <div key={rs.role} className={`bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4 group hover:shadow-lg transition-all active:scale-[0.98]`}>
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${cfg.bg} border border-slate-100 transition-transform group-hover:scale-110`}>
                                        <Icon className={`w-6 h-6 ${cfg.color}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-slate-900 leading-none">{rs.total.toLocaleString('id-ID')}</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</p>
                                    </div>
                                    <div className="space-y-2 mt-auto">
                                        <div className="w-full bg-slate-50 rounded-full h-1.5 border border-slate-100">
                                            <div className={`h-1.5 rounded-full ${cfg.bg.replace('bg-', 'bg-').replace('-50', '-500')} shadow-sm transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                                        </div>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{pct}% dari total</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── ACTION SUMMARY BAR ── */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-wrap gap-4 items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Top Aksi:</span>
                    {actionStats?.map((as) => {
                        const cfg = ACTION_CONFIG[as.action] ?? { color: 'text-slate-600', bg: 'bg-slate-100' };
                        return (
                            <span key={as.action} className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-bold border border-slate-100 shadow-sm ring-1 ring-slate-50 ${cfg.bg} ${cfg.color}`}>
                                {getActionIcon(as.action)}
                                <span className="uppercase tracking-tight">{as.action}</span>
                                <span className="ml-1 bg-white/60 px-2 py-0.5 rounded-lg border border-white/40 shadow-sm">{as.total.toLocaleString('id-ID')}</span>
                            </span>
                        );
                    })}
                </div>

                {/* ── TABLE ── */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm">
                                <Activity className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 leading-none">Riwayat Aktivitas</h3>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Monitoring National Network</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{logs.data.length} aktivitas di halaman ini</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] w-48">Waktu</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pelaku</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Target</th>
                                    <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Akses</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.data.length > 0 ? logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors duration-150">
                                        <td className="p-4">
                                            <div className="flex items-center text-sm text-slate-600">
                                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                                <span>{format(new Date(log.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                                                    {log.user ? log.user.name.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{log.user ? log.user.name : 'System / Guest'}</p>
                                                    {log.user && (
                                                        <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                                            {ROLE_CONFIG[log.user.role]?.label ?? log.user.role}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${getActionColor(log.action)}`}>
                                                {getActionIcon(log.action)}
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                                                <div className="mr-2 text-slate-400">{getModelIcon(log.model_type)}</div>
                                                {formatModelName(log.model_type)}
                                                {log.model_id && <span className="ml-1.5 text-slate-400">#{log.model_id}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end text-sm text-slate-500">
                                                <Monitor className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                                {log.ip_address || '-'}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            Tidak ada aktivitas yang tercatat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.last_page > 1 && (
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                                Halaman {logs.current_page} dari {logs.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {logs.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                            link.active
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                : link.url
                                                    ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                                    : 'bg-slate-50 text-slate-400 cursor-not-allowed hidden sm:block'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
