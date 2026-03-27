import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Save, ArrowLeft, BookOpen, Layers, 
    Award, Plus, Trash2, CheckCircle2, 
    Upload, ListChecks, Beaker, ClipboardCheck, X, 
    FileText, Wand2, Video
} from 'lucide-react';

type ImportTarget = 'pre_tests' | 'post_tests' | 'alat' | 'bahan' | 'langkah';

export default function Show({ auth, module }: any) {
    const isEdit = !!module;
    const [activeTab, setActiveTab] = useState('basic'); 
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    // State untuk Modal Import Auto-Parse
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importText, setImportText] = useState('');
    const [importTarget, setImportTarget] = useState<ImportTarget>('pre_tests');

    // Menggunakan isDirty untuk cek perubahan, dan recentlySuccessful untuk alert
    const { data, setData, post, processing, errors, transform, isDirty, recentlySuccessful } = useForm({
        title: module?.title || '',
        description: module?.description || '',
        order: module?.order || 1,
        alat: module?.alat || [],
        bahan: module?.bahan || [],
        langkah: module?.langkah || [],
        pre_tests: module?.pre_tests || [],
        post_tests: module?.post_tests || [],
        sync_post_test: module?.sync_post_test ?? true,
        soft_skills: module?.soft_skills || [],
    });

    // Efek untuk menampilkan alert sukses sementara
    useEffect(() => {
        if (recentlySuccessful) {
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 3000);
        }
    }, [recentlySuccessful]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const actionText = isEdit ? 'menyimpan perubahan pada modul' : 'menyimpan modul baru';
        if (!confirm(`Apakah Anda yakin ingin ${actionText}?`)) return;

        if (isEdit) {
            transform((data) => ({ ...data, _method: 'put' }));
            post(route('superadmin.modules.update', module.id));
        } else {
            post(route('superadmin.modules.store'));
        }
    };

    // --- FUNGSI AUTO-PARSER SUPER CERDAS ---
    const handleImportText = () => {
        if (!importText.trim()) return;

        if (importTarget === 'pre_tests' || importTarget === 'post_tests') {
            const blocks = importText.split(/\n\s*\n/);
            const newQuestions: any[] = [];

            blocks.forEach(block => {
                const lines = block.trim().split('\n');
                let questionText = '';
                let options: any = { a: '', b: '', c: '', d: '' };

                lines.forEach(line => {
                    const match = line.match(/^\s*([A-Da-d])[\.\)]\s*(.*)/);
                    if (match) {
                        const key = match[1].toLowerCase(); 
                        options[key] = match[2].trim();
                    } else {
                        questionText += (questionText ? '\n' : '') + line.trim();
                    }
                });

                if (questionText) {
                    newQuestions.push({ question_text: questionText, media: null, options: options, options_media: {}, correct_answer: 'a' });
                }
            });
            setData(importTarget, [...data[importTarget], ...newQuestions]);
        } else {
            const lines = importText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const newItems = lines.map(line => {
                const cleanLine = line.replace(/^\d+[\.\)]\s*/, '');
                return { content: cleanLine, media: null };
            });
            setData(importTarget, [...data[importTarget], ...newItems]);
        }
        
        setImportText('');
        setIsImportModalOpen(false);
    };

    const openImportModal = (target: ImportTarget) => {
        setImportTarget(target);
        setIsImportModalOpen(true);
    };

    // Helper Functions CRUD Array
    const addItem = (field: string, emptyObj: any) => setData(field as any, [...(data as any)[field], emptyObj]);
    const removeItem = (field: string, index: number) => {
        const newData = [...(data as any)[field]];
        newData.splice(index, 1);
        setData(field as any, newData);
    };
    const updateItem = (field: string, index: number, key: string, value: any) => {
        const newData = [...(data as any)[field]];
        newData[index][key] = value;
        setData(field as any, newData);
    };
    const updateQuizOption = (field: 'pre_tests' | 'post_tests', qIndex: number, optKey: string, value: string) => {
        const newData = [...data[field]];
        if (!newData[qIndex].options) newData[qIndex].options = {};
        newData[qIndex].options[optKey] = value;
        setData(field, newData);
    };
    const updateQuizOptionMedia = (field: 'pre_tests' | 'post_tests', qIndex: number, optKey: string, file: File | null) => {
        const newData = [...data[field]];
        if (!newData[qIndex].options_media) newData[qIndex].options_media = {};
        newData[qIndex].options_media[optKey] = file;
        setData(field, newData);
    };

    // --- KOMPONEN UPLOAD + PREVIEW BESAR ---
    const FileUploadButton = ({ file, onChange, themeColor, placeholder = "Upload Media" }: any) => {
        const previewUrl = file instanceof File ? URL.createObjectURL(file) : (typeof file === 'string' ? file : null);
        const isVideo = file instanceof File 
            ? file.type.startsWith('video/') 
            : (typeof file === 'string' && file.match(/\.(mp4|webm|ogg|mov)$/i) != null);

        return (
            <div className="flex flex-col gap-3 w-full">
                {/* PREVIEW BOX BESAR */}
                {previewUrl && (
                    <div className={`relative group w-full h-48 md:h-64 rounded-2xl overflow-hidden border-2 border-[${themeColor}] bg-slate-100 flex items-center justify-center shadow-sm`}>
                        {!isVideo ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                                <Video size={48} className={`text-[${themeColor}]`} />
                                <span className="font-bold text-sm">Video Terlampir</span>
                            </div>
                        )}
                        <button type="button" onClick={() => onChange(null)} className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-xl p-2 transition-colors shadow-md flex items-center gap-2 font-bold text-xs">
                            <X size={16} strokeWidth={4} /> Hapus Media
                        </button>
                    </div>
                )}

                {/* TOMBOL UPLOAD */}
                {!previewUrl && (
                    <label className={`cursor-pointer flex items-center justify-center gap-2 bg-white border-2 border-dashed border-[${themeColor}] hover:bg-[${themeColor}]/5 px-4 py-6 rounded-2xl transition-colors w-full`}>
                        <Upload size={20} className={`text-[${themeColor}]`} strokeWidth={3} />
                        <span className={`text-sm font-black text-[${themeColor}] uppercase tracking-widest`}>
                            {placeholder}
                        </span>
                        <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} />
                    </label>
                )}
            </div>
        );
    };

    const TabButton = ({ id, icon: Icon, label }: any) => (
        <button type="button" onClick={() => setActiveTab(id)} className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-2xl font-black text-xs transition-all ${activeTab === id ? 'bg-[#51CBE0] text-white shadow-[4px_4px_0px_0px_rgba(81,203,224,0.3)] translate-y-[-2px]' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}>
            <Icon size={16} strokeWidth={activeTab === id ? 3 : 2} /> {label}
        </button>
    );

    // --- BUILDER KUIS ---
    const renderQuizBuilder = (field: 'pre_tests' | 'post_tests', themeColor: string) => (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
                <button type="button" onClick={() => addItem(field, { question_text: '', media: null, options: {a:'', b:'', c:'', d:''}, options_media: {}, correct_answer: 'a' })} className={`flex-1 py-3 bg-[${themeColor}]/10 text-[${themeColor}] rounded-2xl font-black hover:bg-[${themeColor}] hover:text-white transition-all flex items-center justify-center gap-2 border-2 border-[${themeColor}]/20`}>
                    <Plus size={18} strokeWidth={3} /> Tambah Manual
                </button>
                <button type="button" onClick={() => openImportModal(field)} className={`flex-1 py-3 bg-slate-900 text-white rounded-2xl font-black shadow-[4px_4px_0px_0px_#cbd5e1] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2`}>
                    <Wand2 size={18} strokeWidth={3} /> Auto-Copas Soal Kuis
                </button>
            </div>

            {data[field].length === 0 && <p className="text-sm font-bold text-slate-400 italic text-center py-8">Belum ada soal ditambahkan.</p>}
            
            {data[field].map((q: any, i: number) => (
                <div key={i} className={`bg-white p-6 rounded-[2.5rem] border-2 border-[${themeColor}] shadow-[6px_6px_0px_0px_${themeColor}] relative`}>
                    <button type="button" onClick={() => removeItem(field, i)} className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-colors shadow-sm"><Trash2 size={16} strokeWidth={3} /></button>
                    
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center gap-3 w-full">
                            <div className={`w-8 h-8 rounded-xl bg-[${themeColor}] text-white flex items-center justify-center font-black shrink-0`}>{i+1}</div>
                            <h4 className="font-black text-slate-800">Pertanyaan Soal</h4>
                        </div>
                        <textarea rows={2} value={q.question_text} onChange={e => updateItem(field, i, 'question_text', e.target.value)} className={`w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-[${themeColor}] outline-none resize-none`} placeholder="Tuliskan pertanyaan di sini..." />
                        
                        <div className="w-full">
                            <FileUploadButton file={q.media} onChange={(file: any) => updateItem(field, i, 'media', file)} themeColor={themeColor} placeholder="Tambahkan Media Soal Utama (Opsional)" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {['a', 'b', 'c', 'd'].map((opt) => (
                            <div key={opt} className={`flex flex-col gap-3 p-4 rounded-xl border-2 transition-all ${q.correct_answer === opt ? `border-[${themeColor}] bg-white shadow-sm` : 'border-transparent bg-white'}`}>
                                <div className="flex items-center gap-2">
                                    <input type="radio" name={`correct_${field}_${i}`} value={opt} checked={q.correct_answer === opt} onChange={() => updateItem(field, i, 'correct_answer', opt)} className={`w-5 h-5 text-[${themeColor}] focus:ring-[${themeColor}] border-slate-300 cursor-pointer shrink-0`} />
                                    <span className="font-black text-slate-400 uppercase">{opt}.</span>
                                    <input type="text" value={q.options?.[opt] || ''} onChange={e => updateQuizOption(field, i, opt, e.target.value)} className="flex-1 bg-transparent border-b-2 border-slate-200 focus:border-slate-400 px-2 py-1 text-sm font-bold outline-none w-full" placeholder={`Teks Opsi ${opt.toUpperCase()}`} />
                                </div>
                                <div className="w-full mt-2">
                                    <FileUploadButton file={q.options_media?.[opt]} onChange={(file: any) => updateQuizOptionMedia(field, i, opt, file)} themeColor={themeColor} placeholder="Gambar Pilihan Jawaban" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const isQuizTarget = importTarget === 'pre_tests' || importTarget === 'post_tests';

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={isEdit ? `Edit Modul` : 'Buat Modul Baru'} />
            
            <form onSubmit={submit} className="py-8 space-y-6 max-w-5xl mx-auto" encType="multipart/form-data">
                
                {/* ALERT SUKSES */}
                {showSuccessAlert && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
                        <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-700 px-6 py-3 rounded-full font-black flex items-center gap-2 shadow-lg">
                            <CheckCircle2 size={20} /> Modul berhasil disimpan!
                        </div>
                    </div>
                )}

                {/* HEADER STICKY */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/90 backdrop-blur-md p-4 rounded-[2rem] border-2 border-slate-200 sticky top-4 z-40 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link href={route('superadmin.modules.index')} className="w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"><ArrowLeft size={20} strokeWidth={3} /></Link>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isEdit ? 'Editor Modul' : 'Modul Builder'}</h2>
                            <p className="text-sm text-slate-500 font-bold">Rancang kurikulum dengan dukungan ragam media.</p>
                        </div>
                    </div>

                    {/* TOMBOL SIMPAN CERDAS */}
                    <button 
                        type="submit" 
                        disabled={processing || !isDirty} 
                        className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-black transition-all shrink-0 tracking-widest uppercase text-sm ${
                            isDirty 
                                ? 'bg-[#FF007F] hover:bg-[#e60073] text-white shadow-[4px_4px_0px_0px_rgba(255,0,127,0.2)] active:scale-95 hover:-translate-y-1 cursor-pointer' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {processing ? 'Menyimpan...' : (isDirty ? <><Save size={20} strokeWidth={3} /> Simpan Modul</> : <><CheckCircle2 size={20} strokeWidth={3} /> Tersimpan</>)}
                    </button>
                </div>

                <div className="bg-white border-2 border-[#51CBE0] rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_#51CBE0]">
                    
                    {/* TABS NAVIGATION */}
                    <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
                        <TabButton id="basic" icon={BookOpen} label="Informasi" />
                        <TabButton id="pre_test" icon={ListChecks} label="Pre-Test" />
                        <TabButton id="alat_bahan" icon={Beaker} label="Alat & Bahan" />
                        <TabButton id="praktikum" icon={Layers} label="Praktikum" />
                        <TabButton id="post_test" icon={ClipboardCheck} label="Post-Test" />
                        <TabButton id="softskills" icon={Award} label="Soft Skills" />
                    </div>

                    {/* TAB 1: INFORMASI */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Judul Modul</label>
                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-bold text-slate-800 text-lg outline-none" value={data.title} onChange={e => setData('title', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Deskripsi Singkat</label>
                                    <textarea rows={4} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-bold text-slate-700 resize-none outline-none" value={data.description} onChange={e => setData('description', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-wider ml-2">Urutan Belajar</label>
                                    <input type="number" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-[#51CBE0] transition-all font-black text-slate-800 text-3xl text-center outline-none" value={data.order} onChange={e => setData('order', parseInt(e.target.value))} min="1" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pre_test' && renderQuizBuilder('pre_tests', '#FF007F')}
                    
                    {activeTab === 'post_test' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <h3 className="font-black text-slate-800">Sinkronkan Post-Test dengan Pre-Test?</h3>
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" checked={data.sync_post_test} onChange={e => setData('sync_post_test', e.target.checked)} className="w-6 h-6 text-[#51CBE0] rounded-xl focus:ring-0 border-slate-300" />
                                </label>
                            </div>
                            {!data.sync_post_test && renderQuizBuilder('post_tests', '#51CBE0')}
                        </div>
                    )}

                    {/* TAB 3: ALAT & BAHAN */}
                    {activeTab === 'alat_bahan' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                            {['alat', 'bahan'].map((type: any) => (
                                <div key={type} className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-200">
                                    <div className="flex justify-between items-center mb-6 gap-4">
                                        <h3 className="font-black text-slate-800 text-lg uppercase tracking-wide">Persiapan {type}</h3>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => openImportModal(type)} className="text-[11px] bg-slate-900 text-white font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_#cbd5e1] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1"><Wand2 size={14} /> Auto-Copas</button>
                                            <button type="button" onClick={() => addItem(type, { content: '', media: null })} className="text-[11px] bg-white text-slate-600 font-black uppercase tracking-widest px-4 py-2 rounded-full border-2 border-slate-200 hover:border-[#51CBE0] hover:text-[#51CBE0] transition-colors"><Plus size={14} className="inline" /> Tambah</button>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {data[type as 'alat'|'bahan'].map((item: any, i: number) => (
                                            <div key={i} className="flex flex-col bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative">
                                                <button type="button" onClick={() => removeItem(type, i)} className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-colors shadow-sm z-10"><Trash2 size={16} strokeWidth={3} /></button>
                                                
                                                <input type="text" value={item.content} onChange={e => updateItem(type, i, 'content', e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-[#51CBE0] outline-none mb-4" placeholder={`Nama ${type}...`} />
                                                
                                                <div className="w-full">
                                                    <FileUploadButton file={item.media} onChange={(file: any) => updateItem(type, i, 'media', file)} themeColor="#51CBE0" placeholder={`Gambar/Video ${type} (Opsional)`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 4: PRAKTIKUM */}
                    {activeTab === 'praktikum' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-center mb-6 gap-4">
                                <h3 className="text-xl font-black text-slate-800">Langkah Praktikum</h3>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => openImportModal('langkah')} className="text-[11px] bg-slate-900 text-white font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_#cbd5e1] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1"><Wand2 size={14} /> Auto-Copas</button>
                                    <button type="button" onClick={() => addItem('langkah', { content: '', media: null })} className="text-[11px] bg-white border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest px-4 py-2 rounded-full hover:border-[#51CBE0] hover:text-[#51CBE0] transition-colors flex items-center gap-1"><Plus size={14} /> Tambah Manual</button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {data.langkah.map((item: any, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-slate-50 p-4 md:p-6 rounded-[2.5rem] border-2 border-slate-200 shadow-sm relative">
                                        <button type="button" onClick={() => removeItem('langkah', i)} className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-colors shadow-sm z-10"><Trash2 size={16} strokeWidth={3} /></button>

                                        <div className="w-12 h-12 rounded-2xl bg-[#51CBE0] text-white flex items-center justify-center font-black text-lg shrink-0">{i+1}</div>
                                        <div className="flex-1 space-y-4 w-full">
                                            <textarea rows={3} value={item.content} onChange={e => updateItem('langkah', i, 'content', e.target.value)} className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-[#51CBE0] outline-none resize-none" placeholder="Instruksi langkah kerja..." />
                                            <div className="w-full">
                                                <FileUploadButton file={item.media} onChange={(file: any) => updateItem('langkah', i, 'media', file)} themeColor="#51CBE0" placeholder="Upload Video / GIF Langkah Ini" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB 6: SOFTSKILLS */}
                    {activeTab === 'softskills' && (
                         <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-slate-800">Kriteria Soft Skills</h3>
                                <button type="button" onClick={() => addItem('soft_skills', { criteria_name: '' })} className="text-[11px] bg-slate-100 text-slate-600 font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-[#FF007F] hover:text-white transition-colors flex items-center gap-1"><Plus size={14} /> Tambah</button>
                            </div>
                            <div className="space-y-3">
                                {data.soft_skills.map((skill: any, i: number) => (
                                    <div key={i} className="flex gap-3 items-center bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm">
                                        <Award size={24} className="text-[#FF007F]" />
                                        <input type="text" value={skill.criteria_name} onChange={e => updateItem('soft_skills', i, 'criteria_name', e.target.value)} className="flex-1 border-none bg-transparent font-bold focus:ring-0 px-2 outline-none text-slate-700" placeholder="Contoh: Siswa menjaga kebersihan meja..." />
                                        <button type="button" onClick={() => removeItem('soft_skills', i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </form>

            {/* MODAL AUTO PARSER DYNAMIC */}
            {isImportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsImportModalOpen(false)}></div>
                    <div className="relative bg-white border-2 border-slate-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_#0f172a] w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        
                        <div className="px-8 py-6 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-black text-slate-900 text-2xl flex items-center gap-2">
                                    <Wand2 className={`text-[${isQuizTarget ? '#FF007F' : '#51CBE0'}]`} /> Auto-Copas {isQuizTarget ? 'Soal Kuis' : 'List Item'}
                                </h3>
                                <p className="text-sm text-slate-500 font-bold mt-1">Paste teks Anda di bawah ini dan biarkan sistem yang menyusunnya.</p>
                            </div>
                            <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-2 rounded-xl transition-colors">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1">
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl mb-6 text-sm font-medium text-blue-800">
                                <strong>Format yang didukung:</strong><br />
                                {isQuizTarget ? (
                                    <>
                                        1. Pisahkan antar soal dengan <span className="bg-white px-1 border border-blue-200 rounded">Enter 2x</span><br />
                                        2. Opsi jawaban harus diawali dengan A., B., C., atau D.
                                    </>
                                ) : (
                                    <>
                                        Pisahkan tiap item/langkah dengan <strong>Enter (baris baru)</strong>.<br />
                                        <em>Sistem akan otomatis menghapus angka penomoran jika ada (contoh: "1. Kopi" menjadi "Kopi").</em>
                                    </>
                                )}
                            </div>

                            <textarea 
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                className="w-full h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 font-mono text-sm focus:border-slate-900 outline-none resize-none shadow-inner leading-relaxed"
                                placeholder={isQuizTarget 
                                    ? `Contoh:\n\nMinuman Choco Latte dibuat dari ...\nA. Teh dan gula\nB. Bubuk cokelat dan susu\nC. Kopi hitam dan es\nD. Sirup dan soda` 
                                    : `Contoh:\n\n1. Siapkan Gelas\n2. Masukkan Es Batu\n3. Tuang Kopi`}
                            />
                        </div>

                        <div className="p-6 border-t-2 border-slate-100 bg-white flex gap-4">
                            <button onClick={() => setIsImportModalOpen(false)} className="px-8 py-4 rounded-full font-black text-slate-500 hover:bg-slate-100 transition-colors">Batal</button>
                            <button onClick={handleImportText} className={`flex-1 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-black shadow-[4px_4px_0px_0px_${isQuizTarget ? '#FF007F' : '#51CBE0'}] hover:translate-y-1 hover:shadow-none transition-all flex justify-center items-center gap-2`}>
                                <FileText size={20} strokeWidth={3} /> Import Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}