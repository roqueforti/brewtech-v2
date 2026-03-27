import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    BookOpen, 
    LogOut, 
    Menu, 
    X, 
    Image as ImageIcon,
    Coffee,
    Building2,
    Store,
    Users,
    GraduationCap,
    BarChart3,
    Settings,
    Users2,
    ClipboardSignature,
    PlayCircle,
    FileText,
    Award,
    ShoppingCart,
    Receipt,
    UserCheck,
    HeartPulse,
    Activity
} from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

export default function Authenticated({ user, header, children }: any) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { locale, setLocale, t } = useLanguage();

    const handleLocaleChange = (newLocale: any) => {
        setLocale(newLocale);
    };
    
    const userRole = user?.role || 'guest';
    
    // Format Role untuk sub-logo (cth: "school_admin" -> "School Admin Panel")
    const formattedRole = userRole.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

    const getDashboardRoute = (role: string) => {
        const routeMap: { [key: string]: string } = {
            'superadmin': 'superadmin.dashboard',
            'school_admin': 'school.dashboard',
            'instructor': 'instructor.dashboard',
            'student': 'student.dashboard',
            'parent': 'parent.dashboard',
            'cafe_admin': 'cafe.dashboard',
        };
        return routeMap[role] || 'login';
    };
    
    const dashboardRoute = getDashboardRoute(userRole);

    // Komponen Menu Sesuai Gambar (Bentuk Pil menempel ke kiri)
    const NavItem = ({ href, icon: Icon, active, children }: any) => (
        <Link
            href={href}
            className={`flex items-center gap-4 px-6 py-3.5 my-1 text-sm font-semibold transition-all duration-200 rounded-r-full mr-4 border-y border-r border-transparent ${
                active 
                    ? 'bg-[#51CBE0]/10 text-[#51CBE0] border-[#51CBE0]/20 font-bold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
        >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span>{children}</span>
            
            {/* Indikator aktif yang lebih halus */}
            {active && <div className="w-1.5 h-1.5 rounded-full bg-[#51CBE0] ml-auto animate-pulse"></div>}
        </Link>
    );

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isSidebarOpen]);

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-body text-slate-800">
            
            {/* OVERLAY MOBILE */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR CLEAN MODERN */}
            <aside 
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center px-6 shrink-0 mt-2">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-[#51CBE0]/10 border border-[#51CBE0]/20 rounded-xl flex items-center justify-center text-[#51CBE0]">
                            <Coffee size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="font-bold text-xl tracking-tight text-slate-800 block leading-none">
                                BREWTECH
                            </span>
                            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1 block">
                                {formattedRole} Panel
                            </span>
                        </div>
                    </Link>
                    <button 
                        className="ml-auto lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigasi */}
                <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    
                    <NavItem href={route(dashboardRoute)} icon={LayoutDashboard} active={route().current(dashboardRoute)}>
                        {t('beranda')}
                    </NavItem>

                     {/* SUPERADMIN */}
                     {userRole === 'superadmin' && (
                         <>
                             <NavItem href={route('superadmin.modules.index')} icon={BookOpen} active={route().current('superadmin.modules.*')}>
                                 {t('master_modul')}
                             </NavItem>
                             <NavItem href={route('superadmin.schools.index')} icon={Building2} active={route().current('superadmin.schools.*')}>
                                 {t('sekolah')}
                             </NavItem>
                             <NavItem href={route('superadmin.cafes.index')} icon={Store} active={route().current('superadmin.cafes.*')}>
                                 {t('kafe')}
                             </NavItem>
                             <NavItem href={route('superadmin.logs.index')} icon={Activity} active={route().current('superadmin.logs.*')}>
                                 {t('logs')}
                             </NavItem>
                             <NavItem href={route('superadmin.cms.index')} icon={ImageIcon} active={route().current('superadmin.cms.*')}>
                                 {t('landing')}
                             </NavItem>
                         </>
                     )}

                    {/* SCHOOL ADMIN */}
                    {userRole === 'school_admin' && (
                        <>
                            <NavItem href={route('school.classes.index')} icon={Users2} active={route().current('school.classes.*')}>
                                {t('kelas_man')}
                            </NavItem>
                            <NavItem href={route('school.curriculum.index')} icon={BookOpen} active={route().current('school.curriculum.*')}>
                                {t('modul_bel')}
                            </NavItem>
                            <NavItem href={route('school.users.index')} icon={HeartPulse} active={route().current('school.users.*')}>
                                {t('data_peng')}
                            </NavItem>
                            <NavItem href={route('school.reports.index')} icon={BarChart3} active={route().current('school.reports.*')}>
                                {t('analisis')}
                            </NavItem>
                            <NavItem href={route('school.spk.settings')} icon={Settings} active={route().current('school.spk.*')}>
                                {t('pengaturan')}
                            </NavItem>
                        </>
                    )}

                    {/* INSTRUCTOR */}
                    {userRole === 'instructor' && (
                        <>
                            <NavItem href={route('instructor.classes.index')} icon={Users2} active={route().current('instructor.classes.*')}>
                                {t('kelas_saya')}
                            </NavItem>
                            <NavItem href={route('instructor.dashboard')} icon={ClipboardSignature} active={route().current('instructor.evaluate.*')}>
                                {t('penilaian')}
                            </NavItem>
                        </>
                    )}

                    {/* STUDENT */}
                    {userRole === 'student' && (
                        <>
                            <NavItem href={route('student.dashboard')} icon={PlayCircle} active={route().current('student.modules.*')}>
                                {t('belajar_skrg')}
                            </NavItem>
                            <NavItem href={route('student.report.index')} icon={Award} active={route().current('student.report.*')}>
                                {t('rapor')}
                            </NavItem>
                        </>
                    )}

                    {/* PARENT */}
                    {userRole === 'parent' && (
                        <>
                            <NavItem href={route('parent.report.detail')} icon={FileText} active={route().current('parent.report.*')}>
                                {t('rapor_siswa')}
                            </NavItem>
                            <NavItem href={route('parent.report.download')} icon={Award} active={route().current('parent.report.*')}>
                                {t('unduh_rapor')}
                            </NavItem>
                        </>
                    )}

                    {/* CAFE ADMIN */}
                    {userRole === 'cafe_admin' && (
                        <>
                            <NavItem href={route('cafe.pos.index')} icon={ShoppingCart} active={route().current('cafe.pos.*')}>
                                {t('kasir')}
                            </NavItem>
                            <NavItem href={route('cafe.products.index')} icon={Coffee} active={route().current('cafe.products.*')}>
                                {t('katalog')}
                            </NavItem>
                            <NavItem href={route('cafe.transactions.index')} icon={Receipt} active={route().current('cafe.transactions.*')}>
                                {t('riwayat')}
                            </NavItem>
                            <NavItem href={route('cafe.talent_pool.index')} icon={UserCheck} active={route().current('cafe.talent_pool.*')}>
                                {t('talent')}
                            </NavItem>
                        </>
                    )}
                </nav>

                {/* Bottom Logout & Language */}
                <div className="p-4 mt-auto border-t border-slate-50">
                    {/* Language Toggle */}
                    {/* Language Toggle */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
                        <button 
                            onClick={() => handleLocaleChange('id')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-lg ${
                                locale === 'id' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-primary' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            ID
                        </button>
                        <button 
                            onClick={() => handleLocaleChange('en')}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-lg ${
                                locale === 'en' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-primary' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            EN
                        </button>
                    </div>

                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className="flex items-center gap-3 text-[#ef4444] font-semibold text-sm px-6 py-4 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                    >
                        <LogOut size={18} strokeWidth={2} />
                        {t('keluar')}
                    </Link>
                </div>
            </aside>

            {/* KONTEN UTAMA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0 z-30 shadow-sm">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-transparent active:scale-95"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="font-bold text-lg text-slate-800 tracking-tight text-center">BREWTECH</div>
                    <div className="w-10"></div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                    <div className="min-h-full">
                        {/* Jika halaman memiliki prop header khusus, render di sini */}
                        {header && (
                            <div className="px-6 py-6 lg:px-10 lg:py-8 max-w-[1400px] mx-auto">
                                {header}
                            </div>
                        )}
                        
                        {/* Anak Komponen / Isi Halaman Utama */}
                        <div className="px-6 pb-12 lg:px-10 max-w-[1400px] mx-auto">
                            {children}
                        </div>
                    </div>
                </main>

                <FlashAlerts />
            </div>
        </div>
    );
}

function FlashAlerts() {
    const { t } = useLanguage();
    const { flash }: any = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if (flash?.message) {
            setMessage(flash.message);
            setType('success');
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-10 right-10 z-[200] animate-in slide-in-from-bottom-5 duration-300">
            <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border ${
                type === 'success' 
                    ? 'bg-emerald-500 text-white border-emerald-400' 
                    : 'bg-red-500 text-white border-red-400'
            }`}>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    {type === 'success' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">
                        {type === 'success' ? t('berhasil') : t('kesalahan')}
                    </p>
                    <p className="text-sm font-bold tracking-tight">{message}</p>
                </div>
                <button onClick={() => setVisible(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
        </div>
    );
}