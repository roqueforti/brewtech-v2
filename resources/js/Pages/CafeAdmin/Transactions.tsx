import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Download, 
    Plus,
    Wallet,
    TrendingUp,
    TrendingDown,
    Calendar,
    FileText,
    UploadCloud,
    X,
    Hash,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Filter,
    SlidersHorizontal,
    Trash2,
    AlertTriangle,
    ArrowUpDown
} from 'lucide-react';
import Papa from 'papaparse';

const ROWS_OPTIONS = [10, 25, 50, 100, 'All'] as const;
type RowsOption = typeof ROWS_OPTIONS[number];

const MONTHS = [
    { value: '', label: 'Semua Bulan' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

// ── MODAL KONFIRMASI GENERIC ──────────────────────────────────────────────────
function ConfirmModal({ 
    open, title, message, confirmLabel = 'Hapus', 
    onConfirm, onCancel, loading = false,
}: {
    open: boolean; title: string; message?: string; confirmLabel?: string;
    onConfirm: () => void; onCancel: () => void; loading?: boolean;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !loading && onCancel()} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
                <div className="px-6 py-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-rose-100 text-rose-500 border border-rose-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
                        {message && <p className="text-sm font-semibold text-slate-500 mt-1 leading-relaxed">{message}</p>}
                    </div>
                </div>
                <div className="px-6 pb-5 flex gap-3 justify-end">
                    <button onClick={onCancel} disabled={loading}
                        className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all text-sm disabled:opacity-50">
                        Batal
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all text-sm disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-rose-500/20">
                        <Trash2 size={15} strokeWidth={2.5} />
                        {loading ? 'Menghapus...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Transactions({ auth, transactions = [] }: any) {
    // MODAL IMPOR
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [previewError, setPreviewError] = useState<string | null>(null);

    // MODAL DELETE SINGLE
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // MODAL DELETE ALL
    const [showDeleteAll, setShowDeleteAll] = useState(false);
    const [isDeletingAll, setIsDeletingAll] = useState(false);
    const [deleteAllConfirmText, setDeleteAllConfirmText] = useState('');

    // FILTER & PAGINATION
    const [rowsPerPage, setRowsPerPage] = useState<RowsOption>(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // FORM TRANSAKSI MANUAL
    const { data, setData, post, processing, reset } = useForm({
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        tipe: 'debit',
        nominal: ''
    });

    // FORM IMPOR FILE
    const importForm = useForm({ file: null as File | null });

    const formatRp = (number: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    const formatTanggal = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    };

    // DAFTAR TAHUN DARI DATA
    const availableYears = useMemo(() => {
        const years = new Set<string>();
        transactions.forEach((trx: any) => {
            const year = String(trx.tanggal).substring(0, 4);
            if (year) years.add(year);
        });
        return ['', ...Array.from(years).sort((a, b) => Number(b) - Number(a))];
    }, [transactions]);

    // PROSES SEMUA DATA (running saldo global)
    let globalRunSaldo = 0, globalTotalDebit = 0, globalTotalKredit = 0;
    const allProcessedData = transactions.map((trx: any) => {
        const debit = trx.tipe === 'debit' ? Number(trx.nominal) : 0;
        const kredit = trx.tipe === 'kredit' ? Number(trx.nominal) : 0;
        globalRunSaldo = globalRunSaldo + debit - kredit;
        globalTotalDebit += debit;
        globalTotalKredit += kredit;
        return { ...trx, debit, kredit, saldo: globalRunSaldo };
    });

    // FILTER & SORT
    const filteredData = useMemo(() => {
        let sorted = [...allProcessedData];
        
        // Explicit sort by Date (Year -> Month -> Day) as requested
        sorted.sort((a, b) => {
            const dateA = new Date(a.tanggal).getTime();
            const dateB = new Date(b.tanggal).getTime();
            if (dateA !== dateB) {
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
            // Tiebreaker: urutkan berdasarkan ID (terbaru di atas untuk hari yang sama)
            return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        });

        return sorted.filter((trx: any) => {
            const tanggal = String(trx.tanggal);
            const matchYear = filterYear ? tanggal.substring(0, 4) === filterYear : true;
            const matchMonth = filterMonth ? tanggal.substring(5, 7) === filterMonth : true;
            return matchYear && matchMonth;
        });
    }, [allProcessedData, filterMonth, filterYear, sortOrder]);

    const filteredTotalDebit = filteredData.reduce((s: number, t: any) => s + t.debit, 0);
    const filteredTotalKredit = filteredData.reduce((s: number, t: any) => s + t.kredit, 0);
    const filteredLastSaldo = filteredData.length > 0 ? filteredData[filteredData.length - 1].saldo : 0;

    // PAGINATION
    const totalRows = filteredData.length;
    const isAll = rowsPerPage === 'All';
    const pageSize = isAll ? totalRows : Number(rowsPerPage);
    const totalPages = isAll || pageSize === 0 ? 1 : Math.ceil(totalRows / pageSize);
    const safePage = Math.min(currentPage, totalPages);

    const paginatedData = useMemo(() => {
        if (isAll) return filteredData;
        const start = (safePage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, safePage, pageSize, isAll]);

    const handleFilterMonth = (val: string) => { setFilterMonth(val); setCurrentPage(1); };
    const handleFilterYear = (val: string) => { setFilterYear(val); setCurrentPage(1); };
    const handleRowsPerPage = (val: RowsOption) => { setRowsPerPage(val); setCurrentPage(1); };

    const activeFilterLabel = useMemo(() => {
        const parts: string[] = [];
        if (filterMonth) parts.push(MONTHS.find(m => m.value === filterMonth)?.label ?? '');
        if (filterYear) parts.push(filterYear);
        return parts.length > 0 ? parts.join(' ') : null;
    }, [filterMonth, filterYear]);

    // ── DELETE SINGLE ─────────────────────────────────────────────────────────
    const handleDeleteSingle = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        router.delete(route('cafe.transactions.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => { setDeleteTarget(null); setIsDeleting(false); },
            onError: () => setIsDeleting(false),
        });
    };

    // ── DELETE ALL ────────────────────────────────────────────────────────────
    const handleDeleteAll = () => {
        setIsDeletingAll(true);
        router.delete(route('cafe.transactions.destroyAll'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteAll(false);
                setDeleteAllConfirmText('');
                setIsDeletingAll(false);
            },
            onError: () => setIsDeletingAll(false),
        });
    };

    // ── FORM SUBMIT ───────────────────────────────────────────────────────────
    const submitTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin mencatat transaksi ini?')) return;
        post(route('cafe.transactions.store'), { onSuccess: () => reset('keterangan', 'nominal') });
    };

    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin mengimpor file transaksi ini?')) return;
        importForm.post(route('cafe.transactions.import'), { onSuccess: () => closeImportModal() });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        importForm.setData('file', file);
        setPreviewError(null);
        setPreviewData([]);
        if (!file) return;
        if (file.type === "text/csv" || file.name.endsWith('.csv')) {
            Papa.parse(file, {
                header: true, skipEmptyLines: true, preview: 3,
                complete: (results) => {
                    const headers = results.meta.fields || [];
                    const required = ['tanggal', 'keterangan', 'tipe', 'nominal'];
                    const valid = required.every(r => headers.some(h => h.toLowerCase().trim() === r));
                    if (!valid) {
                        setPreviewError(`Format kolom salah. Kolom yang terdeteksi: [${headers.join(', ')}]. \nKolom wajib: [tanggal, keterangan, tipe, nominal]`);
                    } else {
                        setPreviewData(results.data as any[]);
                    }
                },
                error: () => setPreviewError("Gagal membaca file CSV. Pastikan formatnya benar."),
            });
        } else {
            setPreviewError("Live preview hanya tersedia untuk format CSV. Excel akan divalidasi oleh sistem saat diupload.");
        }
    };

    const closeImportModal = () => {
        setIsImportModalOpen(false);
        importForm.reset();
        setPreviewData([]);
        setPreviewError(null);
    };

    const isFormatError = previewError !== null && !previewError.includes('hanya tersedia untuk format CSV');

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Buku Kas Kafe" />

            <div className="space-y-6">

                {/* 1. HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#51CBE0]/10 text-[#51CBE0] border border-[#51CBE0]/20 rounded-xl flex items-center justify-center shrink-0">
                            <Wallet size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Buku Kas Kafe</h2>
                            <p className="text-sm font-semibold text-slate-500">Catat aliran dana dan pantau saldo operasional.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        <button onClick={() => setIsImportModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
                            <UploadCloud size={18} strokeWidth={2.5} /> Import File
                        </button>
                        <button onClick={() => alert('Fitur Export Excel sedang disiapkan')}
                            className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100/50 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
                            <Download size={18} strokeWidth={2.5} /> Export Excel
                        </button>
                        {allProcessedData.length > 0 && (
                            <button onClick={() => { setShowDeleteAll(true); setDeleteAllConfirmText(''); }}
                                className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">
                                <Trash2 size={18} strokeWidth={2.5} /> Hapus Semua
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. FORM INPUT TRANSAKSI MANUAL */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-600 p-1 rounded-md border border-blue-200"><Plus size={16} strokeWidth={3} /></div>
                        Catat Transaksi Baru
                    </h3>
                    <form onSubmit={submitTransaction} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-48 flex-none">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Tanggal</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#51CBE0]/20 focus:border-[#51CBE0] outline-none transition-all text-sm" required />
                            </div>
                        </div>
                        <div className="w-full flex-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Keterangan</label>
                            <div className="relative">
                                <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)}
                                    placeholder="Contoh: Belanja Susu & SKM"
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#51CBE0]/20 focus:border-[#51CBE0] outline-none transition-all text-sm" required />
                            </div>
                        </div>
                        <div className="w-full flex gap-3 md:w-auto flex-none">
                            <div className="w-36 flex-none">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Jenis</label>
                                <select value={data.tipe} onChange={e => setData('tipe', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#51CBE0]/20 focus:border-[#51CBE0] outline-none transition-all text-sm cursor-pointer">
                                    <option value="debit">Masuk (Debit)</option>
                                    <option value="kredit">Keluar (Kredit)</option>
                                </select>
                            </div>
                            <div className="w-48 flex-none">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nominal (Rp)</label>
                                <input type="number" value={data.nominal} onChange={e => setData('nominal', e.target.value)}
                                    placeholder="0" min="0"
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#51CBE0]/20 focus:border-[#51CBE0] outline-none transition-all text-sm" required />
                            </div>
                        </div>
                        <button type="submit" disabled={processing}
                            className="w-full md:w-auto bg-[#51CBE0] text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm flex-none h-[42px] shadow-lg shadow-[#51CBE0]/20 hover:bg-[#45b8cc] active:scale-95">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </form>
                </div>

                {/* 3. SUMMARY WIDGETS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center">
                            <Hash size={20} className="text-indigo-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Transaksi</p>
                            <p className="text-lg font-bold text-slate-800">
                                {activeFilterLabel
                                    ? <>{filteredData.length} <span className="text-[11px] font-bold text-slate-400">/ {allProcessedData.length}</span></>
                                    : <>{allProcessedData.length}</>
                                }
                                {' '}<span className="text-[11px] font-bold text-slate-400">Catatan</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center">
                            <TrendingUp size={20} className="text-emerald-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Total Masuk{activeFilterLabel ? ` (${activeFilterLabel})` : ''}
                            </p>
                            <p className="text-lg font-bold text-slate-800">{formatRp(activeFilterLabel ? filteredTotalDebit : globalTotalDebit)}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-rose-50 text-rose-50 border border-rose-100 rounded-full flex items-center justify-center">
                            <TrendingDown size={20} className="text-rose-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Total Keluar{activeFilterLabel ? ` (${activeFilterLabel})` : ''}
                            </p>
                            <p className="text-lg font-bold text-slate-800">{formatRp(activeFilterLabel ? filteredTotalKredit : globalTotalKredit)}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-lg shadow-primary/10">
                        <div className="w-10 h-10 bg-white/10 text-[#51CBE0] border border-white/20 rounded-full flex items-center justify-center">
                            <Wallet size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Sisa Saldo Kas</p>
                            <p className="text-lg font-bold text-white">{formatRp(globalRunSaldo)}</p>
                        </div>
                    </div>
                </div>

                {/* 4. TABEL + FILTER BAR */}
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">

                    {/* FILTER BAR */}
                    <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 text-slate-500">
                                <SlidersHorizontal size={15} strokeWidth={2.5} />
                                <span className="text-xs font-bold uppercase tracking-wider">Filter</span>
                            </div>
                            <select value={filterMonth} onChange={e => handleFilterMonth(e.target.value)}
                                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#51CBE0]/20 focus:border-[#51CBE0] outline-none cursor-pointer transition-all">
                                {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            <select value={filterYear} onChange={e => handleFilterYear(e.target.value)}
                                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#51CBE0]/20 focus:border-[#51CBE0] outline-none cursor-pointer transition-all">
                                {availableYears.map(y => <option key={y} value={y}>{y === '' ? 'Semua Tahun' : y}</option>)}
                            </select>
                            {activeFilterLabel && (
                                <span className="flex items-center gap-1 bg-[#51CBE0]/10 text-[#31a8be] text-xs font-bold px-2.5 py-1 rounded-full">
                                    <Filter size={11} />
                                    {activeFilterLabel}
                                    <button onClick={() => { setFilterMonth(''); setFilterYear(''); setCurrentPage(1); }}
                                        className="ml-0.5 hover:text-rose-500 transition-colors">
                                        <X size={11} strokeWidth={3} />
                                    </button>
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tampilkan</span>
                            <div className="flex items-center gap-1">
                                {ROWS_OPTIONS.map(opt => (
                                    <button key={opt} onClick={() => handleRowsPerPage(opt)}
                                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${rowsPerPage === opt ? 'bg-[#51CBE0] text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'}`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data</span>
                        </div>
                    </div>

                    {/* INFO ROW */}
                    {filteredData.length > 0 && (
                        <div className="px-5 py-2 bg-slate-50/40 border-b border-slate-100">
                            <p className="text-[11px] text-slate-400 font-medium">
                                Menampilkan {isAll ? filteredData.length : Math.min((safePage - 1) * pageSize + 1, totalRows)}–{isAll ? totalRows : Math.min(safePage * pageSize, totalRows)} dari <strong>{totalRows}</strong> transaksi
                                {activeFilterLabel && <> yang difilter</>}
                            </p>
                        </div>
                    )}

                    {/* TABEL */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                    <th className="py-4 px-4 w-10 border-r border-slate-100 text-center">#</th>
                                    <th 
                                        className="py-4 px-6 w-36 border-r border-slate-100 cursor-pointer hover:bg-slate-200/50 transition-colors group select-none"
                                        onClick={() => { setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); setCurrentPage(1); }}
                                    >
                                        <div className="flex items-center gap-2">
                                            Tanggal
                                            <ArrowUpDown size={14} className={`transition-all ${sortOrder === 'desc' ? 'text-slate-700' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 border-r border-slate-100">Keterangan</th>
                                    <th className="py-4 px-6 w-40 text-right text-emerald-600 border-r border-slate-100">Debit</th>
                                    <th className="py-4 px-6 w-40 text-right text-rose-500 border-r border-slate-100">Kredit</th>
                                    <th className="py-4 px-6 w-40 text-right text-blue-600 border-r border-slate-100">Saldo</th>
                                    <th className="py-4 px-4 w-14 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paginatedData.length > 0 ? paginatedData.map((trx: any, index: number) => {
                                    const rowNumber = isAll ? index + 1 : (safePage - 1) * pageSize + index + 1;
                                    return (
                                        <tr key={trx.id ?? index} className="hover:bg-rose-50/20 group transition-colors text-sm">
                                            <td className="py-3 px-4 border-r border-slate-100 text-center text-slate-400 font-medium text-xs">{rowNumber}</td>
                                            <td className="py-3 px-6 border-r border-slate-100 font-medium text-slate-500">{formatTanggal(trx.tanggal)}</td>
                                            <td className="py-3 px-6 border-r border-slate-100 font-bold text-slate-700 whitespace-normal break-words max-w-sm">{trx.keterangan}</td>
                                            <td className="py-3 px-6 border-r border-slate-100 font-medium text-emerald-600 text-right">
                                                {trx.debit > 0 ? formatRp(trx.debit) : '-'}
                                            </td>
                                            <td className="py-3 px-6 border-r border-slate-100 font-medium text-rose-500 text-right">
                                                {trx.kredit > 0 ? formatRp(trx.kredit) : '-'}
                                            </td>
                                            <td className="py-3 px-6 border-r border-slate-100 font-bold text-slate-900 text-right bg-slate-50/50">
                                                {formatRp(trx.saldo)}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => setDeleteTarget(trx)}
                                                    title="Hapus transaksi ini"
                                                    className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={14} strokeWidth={2.5} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-sm">
                                            {activeFilterLabel
                                                ? `Tidak ada transaksi untuk periode ${activeFilterLabel}.`
                                                : 'Belum ada catatan kas. Mulai tambahkan transaksi di atas.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {/* FOOTER TOTAL */}
                            {filteredData.length > 0 && (
                                <tfoot>
                                    <tr className="bg-slate-50 border-t border-slate-200 font-bold text-sm">
                                        <td colSpan={3} className="py-4 px-6 border-r border-slate-100 text-right text-slate-600 tracking-wider">
                                            TOTAL {activeFilterLabel ? `(${activeFilterLabel})` : 'KESELURUHAN'}
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-100 text-emerald-600 text-right">
                                            {formatRp(activeFilterLabel ? filteredTotalDebit : globalTotalDebit)}
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-100 text-rose-500 text-right">
                                            {formatRp(activeFilterLabel ? filteredTotalKredit : globalTotalKredit)}
                                        </td>
                                        <td className="py-4 px-6 border-r border-slate-100 text-slate-900 text-right bg-slate-100">
                                            {formatRp(activeFilterLabel ? filteredLastSaldo : globalRunSaldo)}
                                        </td>
                                        <td className="py-4 px-4 bg-slate-100" />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {!isAll && totalPages > 1 && (
                        <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40">
                            <p className="text-xs text-slate-400 font-medium">
                                Halaman <strong className="text-slate-600">{safePage}</strong> dari <strong className="text-slate-600">{totalPages}</strong>
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                    <ChevronLeft size={15} strokeWidth={2.5} />
                                </button>
                                {(() => {
                                    const pages: (number | '...')[] = [];
                                    if (totalPages <= 7) {
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        pages.push(1);
                                        if (safePage > 3) pages.push('...');
                                        for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i);
                                        if (safePage < totalPages - 2) pages.push('...');
                                        pages.push(totalPages);
                                    }
                                    return pages.map((p, i) => p === '...' ? (
                                        <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold">…</span>
                                    ) : (
                                        <button key={p} onClick={() => setCurrentPage(Number(p))}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${safePage === p ? 'bg-[#51CBE0] text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                                            {p}
                                        </button>
                                    ));
                                })()}
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                    <ChevronRight size={15} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODAL: DELETE SINGLE ─────────────────────────────────────────────── */}
            <ConfirmModal
                open={!!deleteTarget}
                title="Hapus Transaksi?"
                message={deleteTarget ? `"${deleteTarget.keterangan}" pada ${deleteTarget.tanggal} akan dihapus permanen dan tidak bisa dikembalikan.` : ''}
                confirmLabel="Hapus Transaksi"
                onConfirm={handleDeleteSingle}
                onCancel={() => setDeleteTarget(null)}
                loading={isDeleting}
            />

            {/* ── MODAL: DELETE ALL ────────────────────────────────────────────────── */}
            {showDeleteAll && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isDeletingAll && setShowDeleteAll(false)} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
                            <div className="w-10 h-10 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                <AlertTriangle size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-base">Hapus Semua Transaksi?</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Aksi ini akan menghapus <strong className="text-rose-600">{allProcessedData.length} transaksi</strong> secara permanen. Saldo kas akan menjadi <strong>Rp 0</strong>. Tindakan ini <strong>tidak bisa dibatalkan</strong>.
                                </p>
                                <div className="mt-4">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                                        Ketik <span className="text-rose-500 font-bold">HAPUS SEMUA</span> untuk konfirmasi
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteAllConfirmText}
                                        onChange={e => setDeleteAllConfirmText(e.target.value)}
                                        placeholder="HAPUS SEMUA"
                                        autoFocus
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition-all text-sm tracking-wider"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3 justify-end">
                            <button onClick={() => setShowDeleteAll(false)} disabled={isDeletingAll}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all text-sm disabled:opacity-50">
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={deleteAllConfirmText !== 'HAPUS SEMUA' || isDeletingAll}
                                className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                                <Trash2 size={15} strokeWidth={2.5} />
                                {isDeletingAll ? 'Menghapus...' : 'Hapus Semua Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL: IMPORT FILE ───────────────────────────────────────────────── */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !importForm.processing && closeImportModal()} />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                <UploadCloud size={18} className="text-[#51CBE0]" /> Import Data Buku Kas
                            </h3>
                            <button onClick={closeImportModal} disabled={importForm.processing}
                                className="text-slate-400 hover:text-slate-700 bg-white p-1.5 rounded-lg border border-transparent active:scale-95 transition-all">
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                        <form onSubmit={submitImport} className="p-6 overflow-y-auto flex-1">
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-5 text-xs text-blue-800 leading-relaxed">
                                <strong>Panduan Format Kolom CSV/Excel:</strong>
                                <ul className="list-disc pl-4 mt-1 font-medium space-y-0.5">
                                    <li>Baris pertama harus berisi judul kolom: <strong>tanggal, keterangan, tipe, nominal</strong></li>
                                    <li>Format <strong>tanggal</strong>: MM/DD/YYYY (contoh: 03/15/2026)</li>
                                    <li>Format <strong>tipe</strong>: huruf kecil "debit" atau "kredit"</li>
                                    <li>Format <strong>nominal</strong>: Angka tanpa titik/koma (contoh: 50000)</li>
                                </ul>
                            </div>
                            <div className="mb-6">
                                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                    importForm.data.file
                                        ? (isFormatError ? 'border-red-400 bg-red-50' : 'border-[#51CBE0] bg-[#51CBE0]/5')
                                        : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                                }`}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className={`w-8 h-8 mb-3 ${importForm.data.file ? (isFormatError ? 'text-red-500' : 'text-[#51CBE0]') : 'text-slate-400'}`} />
                                        <p className="mb-1 text-sm font-medium text-slate-600">
                                            {importForm.data.file
                                                ? <span className={`font-bold ${isFormatError ? 'text-red-600' : 'text-[#51CBE0]'}`}>{importForm.data.file.name}</span>
                                                : <>Klik untuk memilih file (.csv / .xlsx)</>
                                            }
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                                </label>
                                {importForm.errors.file && <p className="text-red-500 text-xs mt-2 font-medium">{importForm.errors.file}</p>}
                            </div>
                            {previewData.length > 0 && !previewError && (
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-2 font-bold text-xs uppercase tracking-wider">
                                        <CheckCircle2 size={14} /> Format Valid - Pratinjau (3 Baris Pertama):
                                    </div>
                                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                                        <table className="w-full text-left text-xs whitespace-nowrap">
                                            <thead className="bg-slate-100 font-bold text-slate-600">
                                                <tr>{['tanggal','keterangan','tipe','nominal'].map(h => <th key={h} className="px-3 py-2 border-b border-slate-200">{h}</th>)}</tr>
                                            </thead>
                                            <tbody>
                                                {previewData.map((row: any, i: number) => (
                                                    <tr key={i} className="border-b border-slate-100 last:border-0">
                                                        <td className="px-3 py-2 text-slate-500">{row.tanggal}</td>
                                                        <td className="px-3 py-2 text-slate-700 font-medium truncate max-w-[120px]">{row.keterangan}</td>
                                                        <td className="px-3 py-2 text-slate-500">{row.tipe}</td>
                                                        <td className="px-3 py-2 text-slate-700 font-bold">{row.nominal}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            {previewError && (
                                <div className={`mb-6 p-3 rounded-lg flex items-start gap-2 text-xs font-medium ${
                                    previewError.includes('hanya tersedia untuk format CSV')
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    <span className="whitespace-pre-line leading-relaxed">{previewError}</span>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button type="button" onClick={closeImportModal} disabled={importForm.processing}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">
                                    Batal
                                </button>
                                <button type="submit" disabled={!importForm.data.file || importForm.processing || isFormatError}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#51CBE0] hover:bg-[#45b8cc] transition-colors disabled:opacity-50 text-sm">
                                    {importForm.processing ? 'Mengunggah...' : 'Mulai Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}