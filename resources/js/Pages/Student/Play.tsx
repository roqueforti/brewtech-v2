import React, { useState, useEffect } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, router, Link } from '@inertiajs/react';
import { ChevronRight, ChevronLeft, CheckCircle, HelpCircle, Trophy, BookOpen, Volume2 } from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

// TTS Helper Function
const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Defaut to Indonesian
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
};

export default function Play({ auth, module }: any) {
    const { t } = useLanguage();
    const [step, setStep] = useState(0); // 0: Intro, 1: Pre-test, 2: Materi, 3: Post-test, 4: Selesai
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Flatten materials into slides
    const materials = module.materials || [];
    const slides = [
        ...materials.filter((m:any) => m.type === 'alat').map((m:any) => ({...m, label: t('alat')})),
        ...materials.filter((m:any) => m.type === 'bahan').map((m:any) => ({...m, label: t('bahan')})),
        ...materials.filter((m:any) => m.type === 'langkah').map((m:any) => ({...m, label: t('praktik')}))
    ];

    // Auto-play material audio
    useEffect(() => {
        if (step === 2 && slides[currentSlide]) {
            speak(slides[currentSlide].content_text);
        }
    }, [currentSlide, step]);

    const preTests = module.questions?.filter((q:any) => q.type === 'pre_test') || [];
    const postTests = module.questions?.filter((q:any) => q.type === 'post_test') || [];

    const handleNextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            setStep(3); // Go to post-test
        }
    };

    const submitTest = (type: 'pre_test' | 'post_test', score: number) => {
        router.post(route('student.modules.answer', module.id), {
            type, score
        }, {
            onSuccess: () => {
                if(type === 'pre_test') setStep(2); // Go to materials
                else setStep(4); // Go to finish
            }
        });
    };

    const finishModule = () => {
        router.post(route('student.modules.finish_practice', module.id));
    };

    // Simple Test Component
    const TestView = ({ questions, type }: { questions: any[], type: 'pre_test' | 'post_test' }) => {
        const { t } = useLanguage();
        const [qIndex, setQIndex] = useState(0);
        const [score, setScore] = useState(0);
        const [selectedOption, setSelectedOption] = useState<any>(null);

        // Auto-play question audio
        useEffect(() => {
            if (questions[qIndex]) {
                speak(questions[qIndex].question_text);
            }
        }, [qIndex]);

        if (questions.length === 0) {
            return (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-2xl font-bold mb-8 text-slate-700">{t('tidak_ada_pertanyaan')}</h2>
                    <button 
                        onClick={() => submitTest(type, 100)} 
                        className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                        {t('lanjut_tahap_berikutnya')}
                    </button>
                </div>
            );
        }

        const q = questions[qIndex];
        
        const handleConfirm = () => {
            if (!selectedOption) return;
            
            const newScore = selectedOption.is_correct ? score + (100 / questions.length) : score;
            setScore(newScore);
            setSelectedOption(null);

            if (qIndex < questions.length - 1) {
                setQIndex(qIndex + 1);
            } else {
                submitTest(type, newScore);
            }
        };

        return (
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex justify-center">
                    <div className="bg-primary/5 text-primary text-xs font-bold px-4 py-2 rounded-full border border-primary/10 tracking-widest uppercase">
                        {t('pertanyaan')} {qIndex + 1} {t('dari')} {questions.length}
                    </div>
                </div>
                
                {q.media_url && (
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        <img src={q.media_url} alt="soal" className="w-full h-64 object-cover rounded-xl" />
                    </div>
                )}
                
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight text-center">
                        {q.question_text}
                    </h2>
                    <button 
                        onClick={() => speak(q.question_text)}
                        className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all border border-primary/20"
                    >
                        <Volume2 size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-8">
                    {q.options.map((opt:any) => (
                        <button 
                            key={opt.id}
                            onClick={() => {
                                setSelectedOption(opt);
                                speak(opt.option_text);
                            }}
                            className={`p-6 rounded-2xl text-xl font-bold transition-all text-left flex items-center gap-4 group border-2 ${
                                selectedOption?.id === opt.id 
                                    ? 'bg-primary/5 border-primary text-primary shadow-md' 
                                    : 'bg-white border-slate-100 text-slate-700 hover:border-primary/30 shadow-sm'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                                selectedOption?.id === opt.id ? 'bg-primary text-white border-primary' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-primary'
                            }`}>
                                <span className="text-sm font-black">{selectedOption?.id === opt.id ? <CheckCircle size={18} /> : '?'}</span>
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                                <div className="flex-1">
                                    {opt.media_url && <img src={opt.media_url} alt="opsi" className="h-24 rounded-lg mb-2" />}
                                    <span>{opt.option_text}</span>
                                </div>
                                <div 
                                    onClick={(e) => { e.stopPropagation(); speak(opt.option_text); }}
                                    className="p-2 text-slate-300 hover:text-primary transition-colors"
                                >
                                    <Volume2 size={20} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedOption}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all ${
                            selectedOption 
                                ? 'bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {t('lanjutkan_pertanyaan')}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <StudentLayout user={{...auth.user, role: 'student'}}>
            <Head title={`${t('belajar')}: ${module.title}`} />
            
            <div className="max-w-5xl mx-auto py-8 flex flex-col justify-center min-h-[70vh]">
                
                {/* Step 0: Intro */}
                {step === 0 && (
                    <div className="text-center space-y-8">
                        <div className="w-24 h-24 bg-primary/5 text-primary rounded-3xl mx-auto flex items-center justify-center border border-primary/10 shadow-sm">
                            <BookOpen size={48} />
                        </div>
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase">{t('materi_pembelajaran')}</span>
                            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">{module.title}</h1>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">{module.description}</p>
                        </div>
                        <button 
                            onClick={() => setStep(1)}
                            className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto group"
                        >
                            {t('mulai_belajar')} <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Step 1: Pre Test */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-orange-500 mb-4">
                                <HelpCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">{t('kuis_awal')}</h3>
                            <p className="text-slate-500 font-medium text-sm">{t('mari_lihat')}</p>
                        </div>
                        <TestView questions={preTests} type="pre_test" />
                    </div>
                )}

                {/* Step 2: Materi Slides */}
                {step === 2 && slides.length > 0 && (
                    <div className="space-y-6">
                        {/* Progress Indicator */}
                        <div className="flex gap-2 mb-4 bg-slate-100 p-1.5 rounded-full border border-slate-200/50">
                            {slides.map((_, idx) => (
                                <div key={idx} className={`h-2.5 rounded-full flex-1 transition-all duration-500 ${idx <= currentSlide ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-transparent'}`} />
                            ))}
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm relative overflow-hidden ring-1 ring-slate-100">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider border border-primary/10">
                                    {t('materi')} {currentSlide + 1} / {slides.length}
                                </span>
                            </div>
                            
                            <div className="space-y-8 mt-4">
                                {slides[currentSlide].media_url && (
                                    <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                        <img src={slides[currentSlide].media_url} alt="media" className="w-full max-w-2xl mx-auto h-64 md:h-80 object-cover rounded-xl" />
                                    </div>
                                )}
                                <div className="space-y-4 text-center">
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{slides[currentSlide].label}</span>
                                    <div className="flex flex-col items-center gap-4">
                                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                                            {slides[currentSlide].content_text}
                                        </h2>
                                        <button 
                                            onClick={() => speak(slides[currentSlide].content_text)}
                                            className="p-3 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all border border-primary/20"
                                        >
                                            <Volume2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <button 
                                onClick={() => currentSlide > 0 && setCurrentSlide(currentSlide - 1)}
                                className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 rounded-2xl border transition-all ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                            >
                                <ChevronLeft size={20} /> {t('kembali')}
                            </button>
                            <button 
                                onClick={handleNextSlide}
                                className="flex-[2] flex items-center justify-center gap-2 bg-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all tracking-wide"
                            >
                                {currentSlide === slides.length - 1 ? t('selesai_kuis') : t('lanjutkan')} <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Fallback if no materials */}
                {step === 2 && slides.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold mb-8 text-slate-700">{t('materi_belum_tersedia')}</h2>
                        <button onClick={() => setStep(3)} className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg shadow-primary/20 transition-all">{t('lanjut_kuis_akhir')}</button>
                    </div>
                )}

                {/* Step 3: Post Test */}
                {step === 3 && (
                    <div className="space-y-4">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 text-primary mb-4">
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-1">{t('kuis_akhir')}</h3>
                            <p className="text-slate-500 font-medium text-sm">{t('tunjukkan_hasil')}</p>
                        </div>
                        <TestView questions={postTests} type="post_test" />
                    </div>
                )}

                {/* Step 4: Finish */}
                {step === 4 && (
                    <div className="text-center space-y-8 animate-in zoom-in duration-500">
                        <div className="w-32 h-32 bg-yellow-50 text-yellow-500 rounded-[2.5rem] mx-auto flex items-center justify-center border border-yellow-100 shadow-sm relative">
                            <Trophy size={56} />
                            <div className="absolute -top-2 -right-2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                <CheckCircle size={20} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{t('yei_berhasil')}</h1>
                            <p className="text-lg text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">{t('selamat_menguasai')} <span className="text-slate-900 font-bold block mt-1">{module.title}</span></p>
                        </div>
                        <Link 
                            href={route('student.dashboard')}
                            className="bg-green-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-green-600/20 hover:scale-105 active:scale-95 transition-all mx-auto block"
                        >
                            {t('kembali_ke_beranda')}
                        </Link>
                    </div>
                )}

            </div>
        </StudentLayout>
    );
}
