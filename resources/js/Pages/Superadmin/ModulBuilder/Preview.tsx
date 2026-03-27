import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeft, PlayCircle, Beaker, CheckSquare, 
    List, Award, ArrowRight, CheckCircle2 
} from 'lucide-react';

export default function Preview({ auth, module }: any) {
    // ALUR: intro -> pre_test -> pre_test_result -> alat_bahan -> praktikum -> post_test -> post_test_result
    const [step, setStep] = useState('intro'); 
    
    // State untuk Kuis
    const [preTestAnswers, setPreTestAnswers] = useState<Record<number, string>>({});
    const [postTestAnswers, setPostTestAnswers] = useState<Record<number, string>>({});
    const [preTestScore, setPreTestScore] = useState(0);
    const [postTestScore, setPostTestScore] = useState(0);

    // Pemecahan Data
    const alat = module.materials.filter((m: any) => m.type === 'alat');
    const bahan = module.materials.filter((m: any) => m.type === 'bahan');
    const langkah = module.materials.filter((m: any) => m.type === 'langkah');
    const preTests = module.questions.filter((q: any) => q.type === 'pre_test');
    const postTests = module.questions.filter((q: any) => q.type === 'post_test');

    // --- FUNGSI PERHITUNGAN KUIS ---
    const calculateScore = (answers: Record<number, string>, questions: any[]) => {
        if (questions.length === 0) return 0;
        let correctCount = 0;
        questions.forEach((q, idx) => {
            const selectedOptionText = answers[idx];
            const correctOption = q.options.find((opt: any) => opt.is_correct);
            // Mencocokkan teks jawaban karena state menyimpan teks, atau ubah logika jika menyimpan ID
            if (correctOption && selectedOptionText === correctOption.option_text) {
                correctCount++;
            }
        });
        return Math.round((correctCount / questions.length) * 100);
    };

    const submitPreTest = () => {
        setPreTestScore(calculateScore(preTestAnswers, preTests));
        setStep('pre_test_result');
    };

    const submitPostTest = () => {
        setPostTestScore(calculateScore(postTestAnswers, postTests));
        setStep('post_test_result');
    };

    // --- KOMPONEN RENDER KUIS ---
    const renderQuiz = (questions: any[], answers: any, setAnswers: any, themeColor: string) => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            {questions.map((q: any, qIdx: number) => (
                <div key={qIdx} className={`bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-[${themeColor}] shadow-[8px_8px_0px_0px_${themeColor}]`}>
                    <h3 className="font-black text-xl text-slate-800 mb-4 leading-relaxed">
                        <span className={`text-[${themeColor}] mr-2`}>{qIdx + 1}.</span> 
                        {q.question_text}
                    </h3>
                    
                    {q.media_url && (
                        <img src={q.media_url} alt="Soal" className="w-full max-h-64 object-cover rounded-2xl mb-6 border-2 border-slate-200" />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt: any, oIdx: number) => {
                            const isSelected = answers[qIdx] === opt.option_text;
                            return (
                                <button 
                                    key={oIdx}
                                    onClick={() => setAnswers({ ...answers, [qIdx]: opt.option_text })}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                                        isSelected 
                                            ? `border-[${themeColor}] bg-[${themeColor}]/5 shadow-sm translate-y-[-2px]` 
                                            : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? `border-[${themeColor}] bg-[${themeColor}]` : 'border-slate-300'}`}>
                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <div className="flex-1">
                                        {opt.media_url && <img src={opt.media_url} alt="Opsi" className="w-16 h-16 object-cover rounded-xl mb-2" />}
                                        {opt.option_text && <span className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>{opt.option_text}</span>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={`Player: ${module.title}`} />
            
            <div className="py-8 max-w-4xl mx-auto space-y-6">
                
                {/* HEADER NAVIGASI ADMIN */}
                <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <Link href={route('superadmin.modules.index')} className="w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors">
                            <ArrowLeft size={20} strokeWidth={3} />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black text-[#51CBE0] uppercase tracking-widest">Simulator Siswa</p>
                            <h2 className="text-xl font-black text-slate-900 leading-tight truncate max-w-xs md:max-w-md">{module.title}</h2>
                        </div>
                    </div>
                    {/* Indikator Progress Sederhana */}
                    <div className="hidden md:flex gap-1">
                        {['intro', 'pre_test', 'alat_bahan', 'praktikum', 'post_test'].map((s, i) => (
                            <div key={i} className={`h-2 w-8 rounded-full ${step === s ? 'bg-[#51CBE0]' : 'bg-slate-100'}`}></div>
                        ))}
                    </div>
                </div>

                {/* KONTEN UTAMA PLAYER */}
                <div className="min-h-[70vh] flex flex-col">
                    
                    {/* 1. INFORMASI AWAL (START) */}
                    {step === 'intro' && (
                        <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-10 md:p-16 text-center flex flex-col items-center justify-center flex-1 animate-in fade-in zoom-in-95">
                            <div className="w-28 h-28 bg-[#51CBE0]/10 text-[#51CBE0] rounded-full flex items-center justify-center mb-8 border-4 border-[#51CBE0]/20">
                                <List size={56} strokeWidth={2.5} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">{module.title}</h1>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mb-10">
                                {module.description || 'Modul ini akan memandu Anda memahami materi dan mempraktikkannya secara langsung.'}
                            </p>
                            
                            <button 
                                onClick={() => setStep(preTests.length > 0 ? 'pre_test' : 'alat_bahan')} 
                                className="bg-[#FF007F] text-white px-12 py-5 rounded-full font-black text-xl shadow-[0_8px_0_0_#cc0066] hover:translate-y-1 hover:shadow-[0_4px_0_0_#cc0066] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3 tracking-wide"
                            >
                                <PlayCircle size={28} strokeWidth={3} /> MULAI BELAJAR
                            </button>
                        </div>
                    )}

                    {/* 2. PRE-TEST */}
                    {step === 'pre_test' && (
                        <div className="space-y-6">
                            <div className="bg-[#FF007F] text-white p-8 rounded-[2.5rem] shadow-sm">
                                <h2 className="text-3xl font-black flex items-center gap-3"><CheckSquare size={32} /> Pre-Test</h2>
                                <p className="font-medium mt-2 opacity-90">Mari uji pengetahuan awal Anda sebelum masuk ke materi praktikum.</p>
                            </div>
                            
                            {renderQuiz(preTests, preTestAnswers, setPreTestAnswers, '#FF007F')}

                            <div className="pt-6 flex justify-end">
                                <button onClick={submitPreTest} className="bg-[#FF007F] text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_6px_0_0_#cc0066] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
                                    Kumpulkan Jawaban <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 3. HASIL PRE-TEST */}
                    {step === 'pre_test_result' && (
                        <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-10 md:p-16 text-center flex flex-col items-center justify-center flex-1 animate-in zoom-in-95">
                            <div className="w-32 h-32 bg-[#FF007F] text-white rounded-[2.5rem] rotate-12 flex items-center justify-center mb-10 shadow-[8px_8px_0px_0px_#cc0066]">
                                <span className="text-5xl font-black -rotate-12">{preTestScore}</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Hasil Pre-Test Anda</h2>
                            <p className="text-slate-500 font-bold mb-10">Ini adalah titik awal Anda. Mari tingkatkan melalui praktikum!</p>
                            
                            <button onClick={() => setStep('alat_bahan')} className="bg-[#51CBE0] text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_6px_0_0_#3898a8] hover:translate-y-1 hover:shadow-[0_3px_0_0_#3898a8] transition-all flex items-center gap-2">
                                Lanjut ke Materi <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* 4. ALAT & BAHAN */}
                    {step === 'alat_bahan' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-[#51CBE0] text-white p-8 rounded-[2.5rem] shadow-sm">
                                <h2 className="text-3xl font-black flex items-center gap-3"><Beaker size={32} /> Persiapan</h2>
                                <p className="font-medium mt-2 opacity-90">Siapkan alat dan bahan berikut sebelum memulai langkah kerja.</p>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-200 shadow-[8px_8px_0px_0px_#e2e8f0]">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[...alat, ...bahan].map((item: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-200 text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                                            {item.media_url ? (
                                                <img src={item.media_url} alt={item.content_text} className="w-20 h-20 object-cover rounded-2xl mb-4 border-2 border-white shadow-sm" />
                                            ) : (
                                                <div className="w-20 h-20 bg-white rounded-2xl mb-4 border-2 border-slate-200 flex items-center justify-center"><Beaker size={32} className="text-slate-300"/></div>
                                            )}
                                            <p className="font-black text-slate-700 text-sm leading-tight">{item.content_text}</p>
                                        </div>
                                    ))}
                                    {alat.length === 0 && bahan.length === 0 && <p className="col-span-full text-center text-slate-400 font-bold py-10">Tidak ada alat & bahan khusus yang diperlukan.</p>}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button onClick={() => setStep('praktikum')} className="bg-[#51CBE0] text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_6px_0_0_#3898a8] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
                                    Mulai Praktikum <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 5. LANGKAH PRAKTIKUM */}
                    {step === 'praktikum' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="bg-[#51CBE0] text-white p-8 rounded-[2.5rem] shadow-sm">
                                <h2 className="text-3xl font-black flex items-center gap-3"><PlayCircle size={32} /> Langkah Kerja</h2>
                                <p className="font-medium mt-2 opacity-90">Ikuti instruksi berikut secara berurutan dengan hati-hati.</p>
                            </div>

                            <div className="space-y-6">
                                {langkah.map((item: any, idx: number) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-[#51CBE0] shadow-[6px_6px_0px_0px_#51CBE0]">
                                        <div className="w-16 h-16 bg-[#51CBE0] text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shrink-0">{idx + 1}</div>
                                        <div className="flex-1">
                                            <p className="text-xl font-black text-slate-800 leading-relaxed mb-6">{item.content_text}</p>
                                            {item.media_url && (
                                                <div className="rounded-3xl overflow-hidden border-2 border-slate-200">
                                                    <img src={item.media_url} alt={`Langkah ${idx+1}`} className="w-full h-auto object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button onClick={() => setStep(postTests.length > 0 ? 'post_test' : 'intro')} className="bg-[#FF007F] text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_6px_0_0_#cc0066] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
                                    Selesai Praktik <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 6. POST-TEST */}
                    {step === 'post_test' && (
                        <div className="space-y-6">
                            <div className="bg-[#FF007F] text-white p-8 rounded-[2.5rem] shadow-sm">
                                <h2 className="text-3xl font-black flex items-center gap-3"><Award size={32} /> Post-Test</h2>
                                <p className="font-medium mt-2 opacity-90">Buktikan pemahaman Anda setelah menyelesaikan praktikum.</p>
                            </div>
                            
                            {renderQuiz(postTests, postTestAnswers, setPostTestAnswers, '#FF007F')}

                            <div className="pt-6 flex justify-end">
                                <button onClick={submitPostTest} className="bg-[#FF007F] text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_6px_0_0_#cc0066] active:translate-y-2 active:shadow-none transition-all flex items-center gap-2">
                                    Selesaikan Kuis <CheckCircle2 size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 7. HASIL POST-TEST (AKHIR) */}
                    {step === 'post_test_result' && (
                        <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-10 md:p-16 text-center flex flex-col items-center justify-center flex-1 animate-in zoom-in-95">
                            <div className="w-32 h-32 bg-[#51CBE0] text-white rounded-[2.5rem] -rotate-12 flex items-center justify-center mb-10 shadow-[8px_8px_0px_0px_#3898a8]">
                                <span className="text-5xl font-black rotate-12">{postTestScore}</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4">Luar Biasa!</h2>
                            <p className="text-lg text-slate-500 font-bold mb-8">
                                Anda telah menyelesaikan modul <span className="text-[#FF007F]">{module.title}</span>.
                            </p>
                            
                            <div className="flex gap-4">
                                <button onClick={() => setStep('intro')} className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-8 py-4 rounded-full font-black transition-colors">
                                    Ulangi Simulasi
                                </button>
                                <Link href={route('superadmin.modules.index')} className="bg-slate-900 text-white px-8 py-4 rounded-full font-black shadow-[0_6px_0_0_#000] active:translate-y-2 active:shadow-none transition-all">
                                    Kembali ke Editor
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}