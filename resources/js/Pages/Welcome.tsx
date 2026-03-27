import { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Coffee, Maximize, Minimize, Users, Award, 
    Image as ImageIcon, ChevronRight, X, UserCircle, KeyRound, Lock,
    Store, GraduationCap, Globe, ArrowRight, Building2, BookOpen,
    Eye, EyeOff, TrendingUp, BarChart2, CheckCircle, MapPin, Activity, Smartphone, Apple, PlusSquare, Share, MoreVertical, Download
} from 'lucide-react';

const Tape = ({ className }: { className?: string }) => (
    <div className={`absolute h-8 w-24 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm z-10 ${className}`}></div>
);

interface Student { id: number; name: string; kelas_id: number; }
interface KelasData { id: number; nama: string; emoji: string; students: Student[]; school_id: number; }
interface Props { 
    topTalents: any[]; 
    stats: any; 
    evidences: any[]; 
    kelasFromDB: KelasData[]; 
    schools: { id: number; name: string; address?: string }[];
    cafes?: { id: number; name: string; city?: string }[];
    performanceData?: {
        monthlyGrowth: { bulan: string; siswa: number; sekolah: number }[];
        completionRate: number;
        disabilityBreakdown: { label: string; value: number }[];
        totalProvinsi: number;
    };
    landingAssets?: {
        hero_banner?: any[];
        gallery_documentation?: any[];
        apk_file?: any[];
        ipa_file?: any[];
        among_rasa?: any[];
    };
}

export default function Welcome({ topTalents, stats, evidences, kelasFromDB, schools, cafes = [], performanceData, landingAssets }: Props) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // State Modal Login Satu Pintu
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginMode, setLoginMode] = useState<'pilihan' | 'siswa' | 'umum'>('pilihan');

    // State Khusus Login Siswa
    const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
    const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [searchSchool, setSearchSchool] = useState('');
    const [searchStudent, setSearchStudent] = useState('');

    // Form Khusus Email & Password
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false
    });

    // ✅ FIX ERROR CRASH: Tambahan state untuk show/hide password
    const [showPassword, setShowPassword] = useState(false);
    const [installDevice, setInstallDevice] = useState<'android' | 'ios'>('android');

    // Hero slideshow
    const dbHeroImages = landingAssets?.hero_banner?.map(a => a.image_path) || [];
    const heroImages = dbHeroImages.length > 0 ? dbHeroImages : ['/images/hero_1.png', '/images/hero_2.png', '/images/hero_3.png'];
    const [heroSlide, setHeroSlide] = useState(0);
    const prevSlide = () => setHeroSlide(s => (s - 1 + heroImages.length) % heroImages.length);
    const nextSlide = () => setHeroSlide(s => (s + 1) % heroImages.length);

    const kelasList = Array.isArray(kelasFromDB) ? kelasFromDB.filter(k => !selectedSchool || k.school_id === selectedSchool) : [];
    const filteredSchools = schools.filter(s => s.name.toLowerCase().includes(searchSchool.toLowerCase()));
    const activeClass = selectedKelas ? kelasList.find(k => k.id === selectedKelas) : null;
    const filteredStudents = activeClass?.students?.filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase())) || [];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Auto-advance slideshow every 5 seconds
        const timer = setInterval(() => setHeroSlide(s => (s + 1) % heroImages.length), 5000);

        // ── Scroll Reveal via IntersectionObserver ──
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target); // fire once
                    }
                });
            },
            { threshold: 0.12 }
        );
        // Observe all .reveal elements (added after first render)
        const revealEls = document.querySelectorAll('.reveal');
        revealEls.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            clearInterval(timer);
            observer.disconnect();
        };
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(e => console.error(e));
        else if (document.exitFullscreen) document.exitFullscreen();
    };

    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedKelas && selectedStudentId) {
            router.post('/login/student', { kelas_id: selectedKelas, user_id: selectedStudentId });
        }
    };

    // MENGGUNAKAN ROUTE LOGIN BARU
    const handleGeneralLogin = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    const openModal = () => {
        setIsLoginModalOpen(true);
        setLoginMode('pilihan');
        setSelectedSchool(null);
        setSelectedKelas(null);
        setSelectedStudentId(null);
        setSearchSchool('');
        setSearchStudent('');
        reset();
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 selection:bg-primary selection:text-white overflow-x-hidden relative scroll-smooth">
            <Head title="Brewtech - Platform Vokasi Disabilitas Terintegrasi" />

            <div className="fixed inset-0 bg-dots opacity-30 pointer-events-none z-0"></div>

            <button 
                onClick={toggleFullScreen}
                className="fixed bottom-6 left-6 z-50 bg-white p-3 rounded-2xl shadow-[4px_4px_0px_hsl(var(--primary))] border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
            >
                {isFullscreen ? <Minimize size={24} strokeWidth={3} /> : <Maximize size={24} strokeWidth={3} />}
            </button>

            <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-b border-slate-200' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Logo */}
                    <a href="#hero" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Coffee fill="currentColor" size={20} />
                        </div>
                        <div>
                            <span className={`block text-xl font-display font-black tracking-tight leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                                BREWTECH
                            </span>
                            <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block">
                                Inclusive Vocation Platform
                            </span>
                        </div>
                    </a>

                    {/* Desktop nav links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {[
                            { href: '#talenta',   label: 'Talenta' },
                            { href: '#performa',  label: 'Performa' },
                            { href: '#mitra-kafe', label: 'Mitra Kafe' },
                            { href: '#sekolah',   label: 'Sekolah' },
                            { href: '#galeri',    label: 'Galeri' },
                            { href: '#download',  label: 'Download App' },
                        ].map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-white/20 ${
                                    scrolled ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'text-white/80 hover:text-white'
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA + Hamburger */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={openModal}
                            className="bg-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-secondary/90 flex items-center gap-2 shadow-sm"
                        >
                            <Lock size={14} /> Masuk Portal
                        </button>
                        {/* Hamburger (mobile only) */}
                        <button
                            className={`lg:hidden p-2 rounded-xl transition-colors ${scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/20'}`}
                            onClick={() => setMobileMenuOpen(o => !o)}
                            aria-label="Menu"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {mobileMenuOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-4 flex flex-col gap-1">
                        {[
                            { href: '#talenta',    label: 'Talenta' },
                            { href: '#performa',   label: 'Performa' },
                            { href: '#mitra-kafe', label: 'Mitra Kafe' },
                            { href: '#sekolah',    label: 'Sekolah' },
                            { href: '#galeri',     label: 'Galeri' },
                            { href: '#download',   label: 'Download App' },
                        ].map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </nav>

            <section id="hero" className="relative overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
                {/* ── Slideshow background images ── */}
                {heroImages.map((src, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                        style={{
                            backgroundImage: `url(${src})`,
                            opacity: heroSlide === i ? 1 : 0,
                            zIndex: 0,
                        }}
                    />
                ))}
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80 z-[1]" />

                {/* Arrow prev */}
                <button
                    onClick={prevSlide}
                    className="absolute left-5 z-20 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition border border-white/30"
                >
                    <ChevronRight size={20} className="rotate-180" />
                </button>
                {/* Arrow next */}
                <button
                    onClick={nextSlide}
                    className="absolute right-5 z-20 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition border border-white/30"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Slide dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {heroImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setHeroSlide(i)}
                            className={`rounded-full transition-all duration-300 border border-white/50 ${heroSlide === i ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40'}`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-40 pb-28">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold text-xs uppercase tracking-widest shadow-sm mb-10">
                        <Globe size={16} className="text-secondary" /> Diimplementasikan di Seluruh Indonesia
                    </div>
                    
                    <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.15] tracking-tight text-white mb-6 drop-shadow-lg">
                        Satu Portal <span className="text-primary">Inklusif.</span> <br/>
                        Dari Pelatihan ke <span className="relative inline-block px-2 z-10"><span className="absolute inset-0 bg-secondary rounded-lg -z-10 transform -rotate-1"></span><span className="text-white">Dunia Kerja</span></span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/80 font-medium max-w-3xl mx-auto mb-16 leading-relaxed drop-shadow">
                        Platform SaaS pendidikan vokasi disabilitas. Mencetak talenta barista melalui <strong className="text-white">BREWTECH</strong>, dinilai dengan SPK, dan disalurkan langsung ke <strong className="text-secondary">Mitra Kafe</strong>.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                        <div className="bg-white/15 backdrop-blur-sm px-6 py-6 rounded-3xl border border-white/30 flex flex-col items-center justify-center shadow-sm">
                            <h3 className="font-display text-4xl font-black text-primary">{stats?.total_siswa || 0}</h3>
                            <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Siswa Terdaftar</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm px-6 py-6 rounded-3xl border border-white/30 flex flex-col items-center justify-center shadow-sm">
                            <h3 className="font-display text-4xl font-black text-secondary">{stats?.jumlah_modul || 0}</h3>
                            <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Modul Tersedia</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm px-6 py-6 rounded-3xl border border-white/30 flex flex-col items-center justify-center shadow-sm">
                            <h3 className="font-display text-4xl font-black text-green-400">{stats?.jumlah_sekolah || 0}</h3>
                            <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Sekolah Binaan</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm px-6 py-6 rounded-3xl border border-white/30 flex flex-col items-center justify-center shadow-sm">
                            <h3 className="font-display text-4xl font-black text-white">{stats?.jumlah_kafe || 0}</h3>
                            <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest mt-2">Mitra Kafe</p>
                        </div>
                    </div>
                </div>
            </section>


            <section id="talenta" className="py-24 bg-white relative border-t-2 border-slate-100">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="reveal reveal-left">
                            <div className="inline-flex items-center gap-3 mb-3">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users size={24} /></div>
                                <h2 className="font-display text-4xl font-black text-slate-900">Live Talent Pool</h2>
                            </div>
                            <p className="font-body text-slate-500 text-lg">Daftar lulusan terbaik dari berbagai sekolah binaan.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topTalents?.length > 0 ? topTalents.map((talent: any, idx: number) => (
                            <div key={idx} className={`reveal reveal-up reveal-delay-${Math.min(idx+1,6)} bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-primary shadow-sm hover:shadow-[4px_4px_0px_hsl(var(--primary))] transition-all duration-300 flex flex-col h-full group`}>
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white ${talent.predikat === 'Coffee Master' ? 'bg-secondary' : 'bg-primary'}`}>
                                        {talent.name.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                                        Skor: <span className="text-slate-700">{talent.skor}</span>
                                    </span>
                                </div>
                                <h3 className="font-display text-xl font-black text-slate-800 mb-1">{talent.name}</h3>
                                <p className="text-sm font-bold text-slate-500 mb-6 flex-grow">{talent.sekolah} • {talent.disabilitas}</p>
                                <div className={`p-3 rounded-xl border-2 text-center ${talent.predikat === 'Coffee Master' ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                                    <p className="text-[10px] font-black uppercase tracking-wider mb-0.5">Predikat</p>
                                    <p className="font-black text-sm">{talent.predikat}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-16 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">Belum ada data talenta yang masuk.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================================================
                SECTION: PERFORMA APLIKASI – Stats & Charts
            ============================================================ */}
            <section id="performa" className="py-24 bg-[#F8FAFC] relative border-t-2 border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16 reveal reveal-up">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest shadow-sm mb-6">
                            <Activity size={14} className="text-secondary" /> Data Performa Real-time
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 mb-4">Dampak Nyata di <span className="text-primary">Seluruh Nusantara</span></h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Angka-angka ini mencerminkan transformasi nyata yang dialami penyandang disabilitas di seluruh Indonesia melalui platform BREWTECH.</p>
                    </div>

                    {/* ── Top KPI Row ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[
                            { icon: CheckCircle, label: 'Tingkat Penyelesaian Modul', value: `${performanceData?.completionRate ?? 0}%`, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
                            { icon: MapPin,      label: 'Provinsi Terjangkau',         value: performanceData?.totalProvinsi ?? 0, color: 'text-blue-600',    bg: 'bg-blue-50',    ring: 'ring-blue-200'    },
                            { icon: Users,       label: 'Total Siswa Aktif',            value: (stats?.total_siswa ?? 0).toLocaleString('id-ID'), color: 'text-violet-600', bg: 'bg-violet-50', ring: 'ring-violet-200' },
                            { icon: TrendingUp,  label: 'Mitra Industri',               value: stats?.jumlah_kafe ?? 0, color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200' },
                        ].map((kpi, i) => {
                            const Icon = kpi.icon;
                            return (
                                <div key={i} className={`reveal reveal-up reveal-delay-${i+1} bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm ring-1 ${kpi.ring} flex flex-col gap-3`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                                    </div>
                                    <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">{kpi.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* ── Grafik Pertumbuhan Siswa (bar chart manual) ── */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm reveal reveal-left">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-primary/10 rounded-xl"><BarChart2 className="w-5 h-5 text-primary" /></div>
                                <div>
                                    <h3 className="font-black text-slate-800">Pertumbuhan Siswa</h3>
                                    <p className="text-xs text-slate-400 font-medium">6 bulan terakhir</p>
                                </div>
                            </div>
                            <div className="flex items-end gap-3 h-40">
                                {(performanceData?.monthlyGrowth ?? []).map((d, i) => {
                                    const maxVal = Math.max(...(performanceData?.monthlyGrowth ?? []).map(x => x.siswa), 1);
                                    const pct = Math.round((d.siswa / maxVal) * 100);
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-bold text-slate-500">{d.siswa}</span>
                                            <div className="w-full bg-slate-100 rounded-t-lg relative" style={{ height: '120px' }}>
                                                <div
                                                    className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-700"
                                                    style={{ height: `${Math.max(pct, 4)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{d.bulan}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Distribusi Disabilitas (horizontal bar) ── */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm reveal reveal-right">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-secondary/10 rounded-xl"><Users className="w-5 h-5 text-secondary" /></div>
                                <div>
                                    <h3 className="font-black text-slate-800">Distribusi Jenis Disabilitas</h3>
                                    <p className="text-xs text-slate-400 font-medium">Berdasarkan data siswa terdaftar</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {(() => {
                                    const breakdown = performanceData?.disabilityBreakdown ?? [];
                                    const total = breakdown.reduce((sum, x) => sum + x.value, 0) || 1;
                                    const colors = ['bg-primary', 'bg-secondary', 'bg-emerald-500', 'bg-orange-400', 'bg-violet-500', 'bg-blue-400'];
                                    return breakdown.slice(0, 6).map((d, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                                <span className="capitalize">{d.label}</span>
                                                <span className="text-slate-400">{d.value} siswa</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full ${colors[i % colors.length]} transition-all duration-700`}
                                                    style={{ width: `${Math.round((d.value / total) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ));
                                })()}
                                {(!performanceData?.disabilityBreakdown?.length) && (
                                    <p className="text-slate-400 text-sm text-center py-8">Data belum tersedia.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="mitra-kafe" className="py-24 bg-slate-900 text-white relative">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="reveal reveal-left">
                        <span className="bg-white/10 text-secondary font-black tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-6 inline-flex items-center gap-2 border border-white/20">
                            <Store size={14} /> Hilirisasi Industri
                        </span>
                        <h2 className="font-display text-5xl font-black mb-6 leading-tight">
                            Mitra <span className="text-primary">Among Rasa</span>
                        </h2>
                        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                            Bukti nyata keberhasilan ekosistem kami. Lulusan terbaik Brewtech langsung diserap sebagai barista di Kafe Among Rasa.
                            <br/><br/>
                            Platform ini dilengkapi dengan <strong>Sistem POS (Point of Sales)</strong> khusus untuk mengelola operasional, kasir, dan laporan kafe yang dapat dipantau dari Dashboard Anda.
                        </p>
                    </div>
                    
                    <div className="bg-slate-800 p-4 rounded-[2rem] border-2 border-slate-700 shadow-2xl reveal reveal-right flex items-center justify-center overflow-hidden">
                        {landingAssets?.among_rasa?.[0] ? (
                            <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden relative group">
                                <img 
                                    src={landingAssets?.among_rasa?.[0]?.full_image_url} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                    alt="Among Rasa"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-8 left-8">
                                    <h3 className="font-display font-black text-3xl text-white tracking-widest uppercase">
                                        {landingAssets?.among_rasa?.[0]?.title || 'AMONG RASA'}
                                    </h3>
                                    <p className="font-body font-bold text-secondary text-sm tracking-widest uppercase mt-2">
                                        {landingAssets?.among_rasa?.[0]?.description || 'Sistem Operasional Kafe'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-[4/3] bg-slate-900 rounded-[1.5rem] overflow-hidden relative flex flex-col items-center justify-center border border-slate-700 w-full">
                                <Store size={80} className="text-slate-700 mb-4" />
                                <h3 className="font-display font-black text-3xl text-white tracking-widest">AMONG RASA</h3>
                                <p className="font-body font-bold text-secondary text-sm tracking-widest uppercase mt-2">Sistem Operasional Kafe</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- MODAL LOGIN SATU PINTU (REDESIGNED) --- */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsLoginModalOpen(false)} />

                    {/* Modal container — wider, taller, split panel */}
                    <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl relative z-10 flex overflow-hidden max-h-[95vh] border border-slate-200" style={{ minHeight: '560px' }}>

                        {/* ── LEFT PANEL: Branding ── */}
                        <div
                            className="hidden lg:flex flex-col justify-between w-2/5 shrink-0 p-10 relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)' }}
                        >
                            {/* Background decorative circles */}
                            <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full" />
                            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-white/10 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full" />

                            {/* Logo */}
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                        <Coffee fill="white" size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-display font-black text-white tracking-tight leading-none">BREWTECH</span>
                                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Inclusive Vocation Platform</span>
                                    </div>
                                </div>

                                <h2 className="font-display text-3xl font-black text-white leading-tight mb-4">
                                    Portal Terpadu<br />Vokasi Disabilitas
                                </h2>
                                <p className="text-white/70 text-sm leading-relaxed mb-8">
                                    Satu pintu masuk untuk semua aktor dalam ekosistem pendidikan vokasi inklusi nasional.
                                </p>

                                {/* Feature bullets */}
                                <div className="space-y-3">
                                    {[
                                        { icon: GraduationCap, text: 'Pelatihan barista berbasis kompetensi' },
                                        { icon: Award, text: 'Penilaian SPK transparan & akurat' },
                                        { icon: Store, text: 'Serapan kerja langsung ke Mitra Kafe' },
                                        { icon: Globe, text: 'Jangkauan nasional dari Sabang–Merauke' },
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                                <f.icon size={16} className="text-white" />
                                            </div>
                                            <span className="text-white/80 text-sm font-medium">{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom stat strip */}
                            <div className="relative z-10 grid grid-cols-3 gap-3 mt-8">
                                {[
                                    { val: stats?.total_siswa ?? 0, lbl: 'Siswa' },
                                    { val: stats?.jumlah_sekolah ?? 0, lbl: 'Sekolah' },
                                    { val: stats?.jumlah_kafe ?? 0, lbl: 'Mitra Kafe' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
                                        <p className="text-2xl font-black text-white">{s.val}</p>
                                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{s.lbl}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT PANEL: Form ── */}
                        <div className="flex flex-col flex-1 min-w-0">
                            {/* Header */}
                            <div className="px-8 pt-8 pb-5 border-b border-slate-100 flex justify-between items-start shrink-0">
                                <div>
                                    {/* Mobile-only logo */}
                                    <div className="flex items-center gap-2 mb-3 lg:hidden">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary))' }}>
                                            <Coffee size={16} className="text-white" fill="white" />
                                        </div>
                                        <span className="font-display font-black text-slate-800 tracking-tight">BREWTECH</span>
                                    </div>
                                    <h2 className="font-display text-2xl font-black text-slate-900">
                                        {loginMode === 'pilihan' ? 'Selamat Datang 👋' : (loginMode === 'siswa' ? 'Masuk sebagai Siswa' : 'Masuk Pengurus & Mitra')}
                                    </h2>
                                    <p className="text-slate-400 text-sm font-medium mt-1">
                                        {loginMode === 'pilihan' ? 'Pilih metode masuk yang sesuai peran Anda.' : (loginMode === 'siswa' ? 'Tanpa password — pilih kelas & nama Anda.' : 'Gunakan email dan password akun Anda.')}
                                    </p>
                                </div>
                                <button onClick={() => setIsLoginModalOpen(false)} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-colors shrink-0 ml-4">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Scrollable body */}
                            <div className="p-8 overflow-y-auto flex-grow">

                                {/* HALAMAN 1: PILIHAN MODE LOGIN */}
                                {loginMode === 'pilihan' && (
                                    <div className="space-y-4 h-full flex flex-col justify-center">
                                        <button onClick={() => setLoginMode('siswa')} className="w-full flex items-center gap-5 text-left p-6 bg-slate-50 hover:bg-primary/5 rounded-2xl border-2 border-slate-100 hover:border-primary transition-all group">
                                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-sm">
                                                <GraduationCap size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-display text-xl font-black text-slate-800 mb-1">Saya Siswa</h3>
                                                <p className="text-sm font-medium text-slate-500">Masuk tanpa password — pilih sekolah, kelas, lalu nama Anda.</p>
                                            </div>
                                            <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors shrink-0" size={22} />
                                        </button>

                                        <button onClick={() => setLoginMode('umum')} className="w-full flex items-center gap-5 text-left p-6 bg-slate-50 hover:bg-secondary/5 rounded-2xl border-2 border-slate-100 hover:border-secondary transition-all group">
                                            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shrink-0 shadow-sm">
                                                <Building2 size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-display text-xl font-black text-slate-800 mb-1">Pengurus / Mitra</h3>
                                                <p className="text-sm font-medium text-slate-500">Admin Sekolah, Instruktur, Wali Murid, Kafe, dan Superadmin.</p>
                                            </div>
                                            <ChevronRight className="text-slate-300 group-hover:text-secondary transition-colors shrink-0" size={22} />
                                        </button>

                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-center text-xs text-slate-400 font-medium">
                                                🔒 Seluruh data dilindungi dan terenkripsi. Platform ini eksklusif untuk anggota terdaftar.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* HALAMAN 2: LOGIN SISWA */}
                                {loginMode === 'siswa' && (
                                    <div className="animate-in slide-in-from-right-4">
                                        <button onClick={() => { setLoginMode('pilihan'); }} className="text-sm font-bold text-slate-400 hover:text-slate-700 mb-6 flex items-center gap-1.5 transition-colors">
                                            <ChevronRight size={16} className="rotate-180" /> Kembali
                                        </button>

                                        <div className="space-y-4">
                                            {!selectedSchool ? (
                                                <div className="space-y-3">
                                                    <p className="text-sm font-bold text-slate-600 mb-3">Pilih sekolah Anda untuk memulai:</p>
                                                    <div className="relative">
                                                        <input type="text" placeholder="Cari sekolah..." value={searchSchool} onChange={e => setSearchSchool(e.target.value)} className="w-full pl-4 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-primary outline-none text-sm font-medium" />
                                                    </div>
                                                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                                                        {filteredSchools.length > 0 ? filteredSchools.map((school) => (
                                                            <button key={school.id} onClick={() => setSelectedSchool(school.id)} className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 group text-left">
                                                                <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                                                    <Building2 size={20} />
                                                                </div>
                                                                <h4 className="font-display font-black text-slate-800 flex-1 text-sm">{school.name}</h4>
                                                                <ChevronRight className="text-primary shrink-0" size={18} />
                                                            </button>
                                                        )) : <div className="text-center py-8 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-xl text-sm">Tidak ada sekolah ditemukan.</div>}
                                                    </div>
                                                </div>
                                            ) : !selectedKelas ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0"><Building2 size={18} /></div>
                                                            <div><p className="text-[10px] font-bold text-primary/70 uppercase">Sekolah Terpilih</p><p className="font-black text-slate-800 text-sm">{schools.find(s => s.id === selectedSchool)?.name}</p></div>
                                                        </div>
                                                        <button onClick={() => {setSelectedSchool(null); setSearchSchool('');}} className="text-xs font-bold text-red-400 hover:text-red-600 underline shrink-0">Ganti</button>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-600">Pilih kelas Anda:</p>
                                                    <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                                        {kelasList.length > 0 ? kelasList.map((k) => (
                                                            <button key={k.id} onClick={() => setSelectedKelas(k.id)} className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 group text-left">
                                                                <span className="text-2xl shrink-0">{k.emoji}</span>
                                                                <div className="flex-1"><h4 className="font-black text-slate-800 text-sm">{k.nama}</h4><p className="text-[10px] font-bold text-slate-400 uppercase">{k.students.length} Siswa</p></div>
                                                                <ChevronRight className="text-primary shrink-0" size={18} />
                                                            </button>
                                                        )) : <div className="text-center py-8 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-xl text-sm">Belum ada kelas di sekolah ini.</div>}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4 animate-in slide-in-from-right-4">
                                                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{activeClass?.emoji}</span>
                                                            <div><p className="text-[10px] font-bold text-primary/70 uppercase">Kelas Terpilih</p><p className="font-black text-slate-800 text-sm">{activeClass?.nama}</p></div>
                                                        </div>
                                                        <button onClick={() => {setSelectedKelas(null);}} className="text-xs font-bold text-red-400 hover:text-red-600 underline shrink-0">Ganti</button>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-600 mb-3">Siapa nama Anda?</p>
                                                        <input type="text" placeholder="Cari nama siswa..." value={searchStudent} onChange={e => setSearchStudent(e.target.value)} className="w-full p-3 border-2 border-slate-200 rounded-xl mb-3 focus:border-primary outline-none text-sm font-medium" />
                                                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
                                                            {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                                                                <button key={s.id} onClick={() => setSelectedStudentId(s.id)} className={`p-3 rounded-xl text-sm font-bold border-2 transition-all text-left ${selectedStudentId === s.id ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary/50 hover:bg-primary/5'}`}>{s.name}</button>
                                                            )) : <div className="col-span-2 text-center py-6 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-xl text-sm">Tidak ada siswa ditemukan.</div>}
                                                        </div>
                                                    </div>
                                                    <button onClick={handleStudentLogin} disabled={!selectedStudentId} className={`w-full py-4 text-white font-display font-black text-base rounded-xl transition-all flex items-center justify-center gap-2 ${selectedStudentId ? 'bg-primary hover:bg-primary/90 hover:-translate-y-0.5 shadow-lg shadow-primary/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                                                        Mulai Belajar <ArrowRight size={18} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* HALAMAN 3: LOGIN UMUM / PENGURUS */}
                                {loginMode === 'umum' && (
                                    <div className="animate-in slide-in-from-right-4 max-w-sm mx-auto">
                                        <button onClick={() => { setLoginMode('pilihan'); reset(); }} className="text-sm font-bold text-slate-400 hover:text-slate-700 mb-8 flex items-center gap-1.5 transition-colors">
                                            <ChevronRight size={16} className="rotate-180" /> Kembali
                                        </button>

                                        <form onSubmit={handleGeneralLogin} className="space-y-5">
                                            <div>
                                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Email</label>
                                                <div className="relative">
                                                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-sm font-bold text-slate-800 placeholder-slate-300" placeholder="admin@domain.com" />
                                                </div>
                                                {errors.email && <p className="text-red-500 text-xs font-bold mt-2">{errors.email}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Password</label>
                                                <div className="relative">
                                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                    <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} required className="w-full pl-12 pr-14 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-secondary focus:bg-white outline-none transition-all text-sm font-bold text-slate-800 placeholder-slate-300" placeholder="••••••••" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                                    </button>
                                                </div>
                                            </div>

                                            <button type="submit" disabled={processing} className="w-full py-4 mt-2 text-white font-display font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/90 hover:-translate-y-0.5 shadow-lg shadow-secondary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                                                {processing ? (
                                                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Memproses...</span>
                                                ) : (
                                                    <span className="flex items-center gap-2">Masuk Sekarang <ArrowRight size={18} strokeWidth={3} /></span>
                                                )}
                                            </button>
                                        </form>

                                        <p className="text-center text-xs text-slate-400 font-medium mt-6">
                                            Lupa password? Hubungi administrator sistem Anda.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* ============================================================
                SECTION: MITRA SEKOLAH
            ============================================================ */}
            <section id="sekolah" className="py-20 bg-white border-t-2 border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 border-2 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest shadow-sm mb-5">
                            <GraduationCap size={14} className="text-primary" /> Ekosistem Pendidikan
                        </div>
                        <h2 className="font-display text-4xl font-black text-slate-900 mb-3">Mitra <span className="text-primary">Sekolah Binaan</span></h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Sekolah Luar Biasa (SLB) yang telah bergabung dalam ekosistem vokasi BREWTECH dari seluruh Indonesia.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {schools.map((school, i) => (
                            <div key={school.id} className="bg-[#F8FAFC] border-2 border-slate-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-primary hover:shadow-md transition-all group">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <Building2 className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm leading-tight">{school.name}</p>
                                    {school.address && <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">{school.address}</p>}
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">SLB Mitra #{i + 1}</span>
                            </div>
                        ))}
                        {schools.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-2xl">Belum ada sekolah terdaftar.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================================================
                SECTION: MITRA KAFE
            ============================================================ */}
            <section className="py-20 bg-[#F8FAFC] border-t-2 border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest shadow-sm mb-5">
                            <Store size={14} className="text-secondary" /> Hilirisasi Industri
                        </div>
                        <h2 className="font-display text-4xl font-black text-slate-900 mb-3">Mitra <span className="text-secondary">Industri Kafe</span></h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Kafe-kafe mitra yang menyerap lulusan terbaik BREWTECH sebagai tenaga barista profesional.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {cafes.map((cafe, i) => (
                            <div key={cafe.id} className="bg-white border-2 border-slate-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-secondary hover:shadow-md transition-all group">
                                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary transition-colors">
                                    <Coffee className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 text-sm leading-tight">{cafe.name}</p>
                                    {cafe.city && <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">{cafe.city}</p>}
                                </div>
                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Mitra Kafe #{i + 1}</span>
                            </div>
                        ))}
                        {cafes.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-2xl">Belum ada kafe mitra terdaftar.</div>
                        )}
                    </div>
                </div>
            </section>

            {/* ============================================================
                SECTION: GALERI DOKUMENTASI
            ============================================================ */}
            <section id="galeri" className="py-20 bg-slate-900 border-t-2 border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest shadow-sm mb-5">
                            <ImageIcon size={14} className="text-secondary" /> Dokumentasi Kegiatan
                        </div>
                        <h2 className="font-display text-4xl font-black text-white mb-3">Galeri <span className="text-primary">Aktivitas</span></h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Dokumentasi kegiatan pelatihan, penilaian, dan serapan kerja di seluruh ekosistem BREWTECH.</p>
                    </div>

                    {/* Grid galeri — Bento Layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[300px] gap-6">
                        {landingAssets?.gallery_documentation?.map((item: any, i: number) => {
                            // Bento span logic based on index
                            const spans = [
                                'md:col-span-2 md:row-span-2', // Large
                                'md:col-span-1 md:row-span-1', // Small
                                'md:col-span-1 md:row-span-2', // Tall
                                'md:col-span-1 md:row-span-1', // Small
                                'md:col-span-2 md:row-span-1', // Wide
                            ];
                            const currentSpan = spans[i % spans.length];

                            return (
                                <div
                                    key={item.id}
                                    className={`${currentSpan} rounded-[2.5rem] overflow-hidden border-2 border-white/5 flex flex-col items-center justify-center cursor-pointer hover:scale-[1.02] transition-all duration-500 group relative shadow-2xl reveal shadow-black/40`}
                                >
                                    <img src={item.image_path} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                                        <p className="text-white font-black text-lg md:text-xl uppercase tracking-tight italic leading-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.title || 'Dokumentasi'}</p>
                                        <p className="text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.description || 'BREWTECH Activity'}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {(!landingAssets?.gallery_documentation || landingAssets.gallery_documentation.length === 0) && [
                            { label: 'Pelatihan Barista', emoji: '☕', color: 'from-cyan-500/20 to-blue-500/10', span: 'md:col-span-2 md:row-span-2' },
                            { label: 'Penilaian SPK', emoji: '📊', color: 'from-pink-500/20 to-purple-500/10', span: 'md:col-span-1 md:row-span-1' },
                            { label: 'Wisuda Vokasi', emoji: '🎓', color: 'from-emerald-500/20 to-teal-500/10', span: 'md:col-span-1 md:row-span-2' },
                            { label: 'Praktek Lapangan', emoji: '🏪', color: 'from-orange-500/20 to-red-500/10', span: 'md:col-span-2 md:row-span-1' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`${item.span} rounded-[2.5rem] bg-gradient-to-br ${item.color} border-2 border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden reveal`}
                            >
                                <span className="text-6xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">{item.emoji}</span>
                                <p className="text-white font-black text-xs uppercase tracking-[0.2em] text-center px-4 opacity-40 group-hover:opacity-80 transition-opacity italic">{item.label}</p>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <span className="text-white text-xs font-black border-2 border-white/20 px-6 py-3 rounded-full uppercase tracking-widest bg-white/10">Bentuk Konten Baru</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {landingAssets?.gallery_documentation?.length === 0 && (
                        <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest mt-16 opacity-50 italic">
                             Geser ke bawah untuk eksplorasi lebih lanjut atau perbarui galeri melalui Superadmin CMS
                        </p>
                    )}
                </div>
            </section>

            {/* ============================================================
                SECTION: DOWNLOAD APLIKASI MOBILE
            ============================================================ */}
            <section id="download" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden border-t border-slate-700">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Left: Text & Buttons */}
                        <div className="flex-1 text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                                Segera Hadir — Mobile App
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                                Brewtech di<br />
                                <span className="text-primary uppercase italic tracking-tighter">Genggaman Anda</span>
                            </h2>
                            <p className="text-slate-400 text-lg max-w-lg mb-10 leading-relaxed font-medium">
                                Tidak perlu unduh di Play Store. Cukup instal langsung melalui browser ponsel Anda dalam hitungan detik.
                            </p>

                            {/* Installation Guide Tabs */}
                            <div className="bg-white/5 border border-white/10 rounded-[32px] p-2 mb-10 inline-flex items-center gap-1">
                                <button 
                                    onClick={() => setInstallDevice('android')}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        installDevice === 'android' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    ANDROID
                                </button>
                                <button 
                                    onClick={() => setInstallDevice('ios')}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        installDevice === 'ios' ? 'bg-slate-700 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    iOS (iPhone)
                                </button>
                            </div>

                            {/* Steps Container */}
                            <div className="space-y-6 mb-12">
                                {installDevice === 'android' ? (
                                    <>
                                        {/* Android Steps */}
                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shrink-0">
                                                <MoreVertical size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 italic opacity-60">Langkah 01</p>
                                                <p className="text-slate-300 text-sm font-bold leading-tight">Buka Browser Google Chrome</p>
                                                <p className="text-slate-400 text-xs mt-1">Akses halaman ini dan ketuk ikon titik tiga (⋮) di pojok kanan atas browser.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shrink-0">
                                                <Smartphone size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 italic opacity-60">Langkah 02</p>
                                                <p className="text-slate-300 text-sm font-bold leading-tight">Pilih menu "Instal Aplikasi"</p>
                                                <p className="text-slate-400 text-xs mt-1">Tunggu beberapa saat hingga muncul pop-up konfirmasi, lalu ketuk 'Instal'.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shrink-0">
                                                <PlusSquare size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 italic opacity-60">Langkah 03</p>
                                                <p className="text-slate-300 text-sm font-bold leading-tight">Akses dari Layar Utama</p>
                                                <p className="text-slate-400 text-xs mt-1">Ikon Brewtech akan muncul di daftar aplikasi Anda. Selamat belajar!</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* iOS Steps */}
                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-lg shrink-0">
                                                <Share size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 italic opacity-60">Langkah 01</p>
                                                <p className="text-slate-300 text-sm font-bold leading-tight">Gunakan Browser Safari</p>
                                                <p className="text-slate-400 text-xs mt-1">Ketuk tombol 'Share' (ikon kotak dengan panah ke atas) di bagian bawah layar.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-lg shrink-0">
                                                <PlusSquare size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 italic opacity-60">Langkah 02</p>
                                                <p className="text-slate-300 text-sm font-bold leading-tight">Tambah ke Layar Utama</p>
                                                <p className="text-slate-400 text-xs mt-1">Gulir ke bawah hingga menemukan opsi 'Add to Home Screen' atau 'Tambah ke Layar Utama'.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-lg shrink-0">
                                                <Smartphone size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 italic opacity-60">Langkah 03</p>
                                                <p className="text-slate-300 text-sm font-bold leading-tight">Berikan Nama & Simpan</p>
                                                <p className="text-slate-400 text-xs mt-1">Ketuk 'Add' di pojok kanan atas. Aplikasi Brewtech kini siap di beranda iPhone Anda.</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Manual Installation Section */}
                            <div className="pt-8 border-t border-white/10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 italic">Opsi Instalasi Manual (Developer Only):</p>
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    {landingAssets?.apk_file?.[0] && (
                                        <a 
                                            href={(landingAssets?.apk_file?.[0] as any).full_image_url || landingAssets.apk_file[0].image_path} 
                                            download 
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-primary/50 transition-all shadow-xl"
                                        >
                                            <Download size={14} className="text-primary" /> Unduh APK
                                        </a>
                                    )}
                                    {landingAssets?.ipa_file?.[0] && (
                                        <a 
                                            href={(landingAssets?.ipa_file?.[0] as any).full_image_url || landingAssets.ipa_file[0].image_path} 
                                            download 
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-cyan-500/50 transition-all shadow-xl"
                                        >
                                            <Download size={14} className="text-cyan-400" /> Unduh IPA
                                        </a>
                                    )}
                                    {(!landingAssets?.apk_file && !landingAssets?.ipa_file) && (
                                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest italic">Belum ada file master yang tersedia.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Right: Phone Mockup */}
                        <div className="flex-shrink-0 relative flex justify-center">
                            {/* Glow behind phone */}
                            <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-110 opacity-50 pointer-events-none" />
                            <div className="relative w-56 md:w-64">
                                {/* Phone frame */}
                                <div className="bg-slate-800 border-4 border-slate-600 rounded-[3rem] shadow-2xl shadow-black/50 overflow-hidden aspect-[9/19.5]">
                                    {/* Status bar */}
                                    <div className="bg-slate-900 px-5 pt-4 pb-2 flex justify-between items-center">
                                        <span className="text-white text-[8px] font-bold">9:41</span>
                                        <div className="w-12 h-2.5 bg-slate-700 rounded-full" />
                                        <div className="flex gap-1">
                                            <div className="w-3 h-2 bg-white/40 rounded-sm" />
                                            <div className="w-2 h-2 bg-white/40 rounded-full" />
                                        </div>
                                    </div>

                                    {/* App screen content */}
                                    <div className="bg-white p-4 h-full">
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
                                                <Coffee size={12} className="text-white" />
                                            </div>
                                            <span className="text-slate-800 text-[10px] font-bold">Brewtech</span>
                                        </div>
                                        {/* Mini stat cards */}
                                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                                            {[
                                                { label: 'Modul', val: '10', color: 'bg-primary/10 text-primary' },
                                                { label: 'Siswa', val: '115', color: 'bg-secondary/10 text-secondary' },
                                            ].map(s => (
                                                <div key={s.label} className={`${s.color} rounded-xl p-2.5`}>
                                                    <p className="text-base font-bold">{s.val}</p>
                                                    <p className="text-[7px] font-semibold opacity-70">{s.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* Progress bars placeholder */}
                                        <div className="space-y-2">
                                            {['Espresso', 'Latte Art', 'Cold Brew'].map((m, i) => (
                                                <div key={m}>
                                                    <div className="flex justify-between mb-0.5">
                                                        <span className="text-[7px] font-semibold text-slate-600">{m}</span>
                                                        <span className="text-[7px] font-bold text-primary">{70 - i * 15}%</span>
                                                    </div>
                                                    <div className="h-1 bg-slate-100 rounded-full">
                                                        <div className="h-1 bg-primary rounded-full" style={{ width: `${70 - i * 15}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Home indicator */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-500 rounded-full" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">

                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-bold text-sm">&copy; 2026 Mandala Pure Love. Hak Cipta Dilindungi.</p>
                </div>
            </footer>
        </div>
    );
}