import React, { useState, useEffect } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, router, Link } from '@inertiajs/react';
import { 
    ChevronRight, ChevronLeft, CheckCircle, HelpCircle, 
    Trophy, BookOpen, Volume2, Sparkles, Star, Award, 
    Coffee, Heart, Flame, Zap 
} from 'lucide-react';
import { useLanguage } from '@/LanguageContext';

// TTS Helper Function with pleasant dinosaur persona
const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.92;
    utterance.pitch = 1.05; // Slightly cheerful pitch
    window.speechSynthesis.speak(utterance);
};

export default function Play({ auth, module }: any) {
    const { t } = useLanguage();
    const [step, setStep] = useState(0); // 0: Intro, 1: Pre-test, 2: Materi, 3: Post-test, 4: Selesai
    const [currentSlide, setCurrentSlide] = useState(0);
    const [companionMood, setCompanionMood] = useState<'happy' | 'thinking' | 'cheering'>('happy');
    
    // Flatten materials into slides
    const materials = module.materials || [];
    const slides = [
        ...materials.filter((m: any) => m.type === 'alat').map((m: any) => ({ ...m, label: t('alat') || 'Peralatan Purba', dinoTip: 'Kenali alat seduh ini dengan teliti ya!' })),
        ...materials.filter((m: any) => m.type === 'bahan').map((m: any) => ({ ...m, label: t('bahan') || 'Bahan Kopi Alami', dinoTip: 'Bahan berkualitas menghasilkan aroma terbaik!' })),
        ...materials.filter((m: any) => m.type === 'langkah').map((m: any) => ({ ...m, label: t('praktik') || 'Langkah Meracik', dinoTip: 'Ikuti langkah pelan-pelan dan selalu berhati-hati.' }))
    ];

    // Auto-play material audio when on Step 2
    useEffect(() => {
        if (step === 2 && slides[currentSlide]) {
            setCompanionMood('thinking');
            speak(slides[currentSlide].content_text);
        }
    }, [currentSlide, step]);

    // Cheerful companion prompt based on current step
    const getDinoSpeech = () => {
        switch (step) {
            case 0:
                return "Aummm! Halo Sahabat Dino! Siap menjelajahi dan menaklukkan modul ini bersama Rexy? Yuk kita mulai!";
            case 1:
                return "Kuis Jejak Kaki Awal! Tenang saja, pilih jawaban terbaikmu untuk melatih ingatan ya!";
            case 2:
                return `Slide ${currentSlide + 1} dari ${slides.length}: Perhatikan panduan seduh purba ini baik-baik!`;
            case 3:
                return "Tantangan Kuis Fosil Terakhir! Buktikan pemahamanmu untuk memenangkan lencana baru!";
            case 4:
                return "Luar Biasa! Auummm! Kamu berhasil menyelesaikan misi dan mendapatkan XP Dino!";
            default:
                return "Semangat belajar meracik kopi bersama BrewDino!";
        }
    };

    const preTests = module.questions?.filter((q: any) => q.type === 'pre_test') || [];
    const postTests = module.questions?.filter((q: any) => q.type === 'post_test') || [];

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
                if (type === 'pre_test') {
                    setStep(2);
                } else {
                    setStep(4);
                    setCompanionMood('cheering');
                    speak("Yei! Hebat sekali! Kamu berhasil menyelesaikan petualangan ini dengan gemilang!");
                }
            }
        });
    };

    // Dino Mascot Banner Component
    const DinoCompanionBanner = ({ message }: { message: string }) => (
        <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10 border-2 border-emerald-300/60 rounded-3xl p-4 md:p-5 flex items-center gap-4 shadow-sm backdrop-blur-sm mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-md shadow-emerald-600/20 shrink-0 transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                {companionMood === 'cheering' ? '🦖🎉' : companionMood === 'thinking' ? '🦖💡' : '🦖☕'}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={12} className="text-amber-500" /> Rexy si Dino Barista
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold hidden sm:inline">Pemandu Petualangan</span>
                </div>
                <p className="text-slate-800 font-bold text-sm md:text-base leading-snug">
                    "{message}"
                </p>
            </div>
            <button
                onClick={() => speak(message)}
                title="Dengarkan Suara Dino"
                className="w-11 h-11 rounded-2xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center shrink-0 transition-all"
            >
                <Volume2 size={20} />
            </button>
        </div>
    );

    // Test Component with Dinosaur Footprints & Cheerful Style
    const TestView = ({ questions, type }: { questions: any[], type: 'pre_test' | 'post_test' }) => {
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
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-emerald-100 shadow-sm p-8 space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-inner border border-emerald-200">
                        🦕🌴
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-slate-800">Tidak Ada Kuis di Bab Ini</h2>
                        <p className="text-slate-500 font-medium">Dino Rexy mengizinkanmu langsung melangkah ke tahap petualangan berikutnya!</p>
                    </div>
                    <button 
                        onClick={() => submitTest(type, 100)} 
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                    >
                        <span>Lanjut ke Petualangan Berikutnya</span>
                        <ChevronRight size={22} />
                    </button>
                </div>
            );
        }

        const q = questions[qIndex];
        const optionFootprints = ['🐾 A', '🐾 B', '🐾 C', '🐾 D'];
        
        const handleConfirm = () => {
            if (!selectedOption) return;
            
            const isCorrect = selectedOption.is_correct;
            const newScore = isCorrect ? score + (100 / questions.length) : score;
            setScore(newScore);
            setSelectedOption(null);

            if (qIndex < questions.length - 1) {
                setQIndex(qIndex + 1);
            } else {
                submitTest(type, newScore);
            }
        };

        return (
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Dino Stage Indicator */}
                <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border-2 border-emerald-100 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-800 tracking-wide uppercase">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-base">🥚</span>
                        <span>Misi Kuis {qIndex + 1} dari {questions.length}</span>
                    </div>
                    <div className="flex gap-1.5">
                        {questions.map((_, i) => (
                            <span 
                                key={i} 
                                className={`w-3.5 h-3.5 rounded-full transition-all ${
                                    i < qIndex 
                                        ? 'bg-emerald-500 shadow-sm' 
                                        : i === qIndex 
                                            ? 'bg-amber-400 ring-4 ring-amber-100 scale-110' 
                                            : 'bg-slate-200'
                                }`} 
                            />
                        ))}
                    </div>
                </div>
                
                {/* Media Image if available */}
                {q.media_url && (
                    <div className="bg-white p-3 rounded-3xl border-2 border-emerald-100 shadow-sm overflow-hidden">
                        <img 
                            src={q.media_url} 
                            alt="soal visual" 
                            className="w-full h-64 md:h-80 object-cover rounded-2xl hover:scale-102 transition-transform duration-300" 
                        />
                    </div>
                )}
                
                {/* Question Box */}
                <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 md:p-8 shadow-sm flex flex-col items-center gap-4 text-center relative">
                    <div className="absolute -top-4 bg-emerald-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1.5">
                        <Star size={12} className="fill-amber-300 text-amber-300" /> Pertanyaan Dino
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight pt-2">
                        {q.question_text}
                    </h2>

                    <button 
                        onClick={() => speak(q.question_text)}
                        title="Dengarkan Soal"
                        className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition-all border border-emerald-200 flex items-center gap-2 font-bold text-sm shadow-sm hover:scale-105 active:scale-95"
                    >
                        <Volume2 size={20} />
                        <span>Dengarkan Soal</span>
                    </button>
                </div>

                {/* Footprint Option Choices */}
                <div className="grid grid-cols-1 gap-3.5">
                    {q.options.map((opt: any, optIdx: number) => {
                        const isSelected = selectedOption?.id === opt.id;
                        const footprintBadge = optionFootprints[optIdx % optionFootprints.length];

                        return (
                            <button 
                                key={opt.id}
                                onClick={() => {
                                    setSelectedOption(opt);
                                    speak(opt.option_text);
                                }}
                                className={`p-5 md:p-6 rounded-2xl text-left flex items-center gap-4 group border-2 transition-all transform duration-150 ${
                                    isSelected 
                                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.01] -translate-y-0.5' 
                                        : 'bg-white border-slate-200/80 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-sm'
                                }`}
                            >
                                {/* Dino Footprint Letter Badge */}
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 font-black text-sm tracking-wide transition-all shadow-sm ${
                                    isSelected 
                                        ? 'bg-emerald-600 text-white border-emerald-700 scale-105' 
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-800 group-hover:bg-emerald-100'
                                }`}>
                                    {isSelected ? <CheckCircle size={22} className="stroke-[3]" /> : footprintBadge}
                                </div>

                                <div className="flex-1 flex items-center justify-between gap-3">
                                    <div className="flex-1">
                                        {opt.media_url && (
                                            <img src={opt.media_url} alt="opsi visual" className="h-24 rounded-xl mb-2 object-cover border border-slate-100" />
                                        )}
                                        <span className={`text-lg md:text-xl font-bold leading-snug ${isSelected ? 'text-emerald-950 font-black' : 'text-slate-800'}`}>
                                            {opt.option_text}
                                        </span>
                                    </div>
                                    <div 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            speak(opt.option_text); 
                                        }}
                                        title="Dengarkan Pilihan Ini"
                                        className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100/60 rounded-xl transition-all"
                                    >
                                        <Volume2 size={20} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Confirm / Continue Button */}
                <div className="pt-4">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedOption}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-wider text-base shadow-xl transition-all flex items-center justify-center gap-3 ${
                            selectedOption 
                                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]' 
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        <span>Kunci Jawaban Jejak Dino</span>
                        <ChevronRight size={22} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <StudentLayout user={{ ...auth.user, role: 'student' }}>
            <Head title={`Petualangan Dino: ${module.title}`} />
            
            <div className="max-w-4xl mx-auto py-6 px-3 flex flex-col justify-center min-h-[75vh]">
                
                {/* Companion Mascot Banner */}
                <DinoCompanionBanner message={getDinoSpeech()} />

                {/* STEP 0: INTRO - DINOSAUR ADVENTURE BRIEFING */}
                {step === 0 && (
                    <div className="text-center space-y-8 bg-white/90 backdrop-blur-md border-2 border-emerald-100 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

                        {/* Animated Dino Mascot */}
                        <div className="relative inline-block">
                            <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-tr from-emerald-400 via-teal-500 to-amber-400 rounded-3xl mx-auto flex items-center justify-center text-6xl shadow-xl shadow-emerald-500/20 border-4 border-white transform hover:rotate-6 hover:scale-105 transition-all duration-300">
                                🦖☕
                            </div>
                            <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-full border-2 border-white shadow flex items-center gap-1">
                                <Sparkles size={12} /> LEVEL VOKASI
                            </span>
                        </div>

                        <div className="space-y-4 max-w-2xl mx-auto relative z-10">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                                <span>🌿 Modul Pembelajaran Purba</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                {module.title}
                            </h1>
                            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                                {module.description || 'Pelajari langkah-langkah praktis dan kuasai standar seduhan barista bersama teman dinosaurusmu!'}
                            </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left relative z-10">
                            <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5">
                                <span className="text-2xl">🥚</span>
                                <div>
                                    <div className="text-xs font-black text-emerald-900">Kuis Awal</div>
                                    <div className="text-[10px] text-emerald-700">Tebak jejak santai</div>
                                </div>
                            </div>
                            <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-2xl flex items-center gap-2.5">
                                <span className="text-2xl">☕</span>
                                <div>
                                    <div className="text-xs font-black text-amber-900">Materi Visual</div>
                                    <div className="text-[10px] text-amber-700">Disertai Audio Suara</div>
                                </div>
                            </div>
                            <div className="bg-teal-50/80 border border-teal-200 p-3 rounded-2xl flex items-center gap-2.5 col-span-2 sm:col-span-1">
                                <span className="text-2xl">🎖️</span>
                                <div>
                                    <div className="text-xs font-black text-teal-900">Hadiah XP</div>
                                    <div className="text-[10px] text-teal-700">+100 XP & Biji Kopi</div>
                                </div>
                            </div>
                        </div>

                        {/* Launch Button */}
                        <div className="pt-2 relative z-10">
                            <button 
                                onClick={() => setStep(1)}
                                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 group"
                            >
                                <span>Mulai Petualangan Dino</span>
                                <ChevronRight size={26} className="group-hover:translate-x-1.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 1: PRE-TEST */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 border border-orange-200 shadow-sm text-2xl">
                                🥚🔍
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800">Kuis Jejak Kaki Awal (Pre-test)</h3>
                            <p className="text-slate-500 font-medium text-sm max-w-md mx-auto">
                                Mari cek seberapa banyak pengetahuan purbamu tentang topik ini sebelum kita mulai belajar!
                            </p>
                        </div>
                        <TestView questions={preTests} type="pre_test" />
                    </div>
                )}

                {/* STEP 2: MATERI SLIDES */}
                {step === 2 && slides.length > 0 && (
                    <div className="space-y-6">
                        {/* Jurassic Stepper Bar */}
                        <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border-2 border-emerald-100 shadow-sm">
                            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider shrink-0 flex items-center gap-1.5 pl-2">
                                🌿 Progres Materi
                            </span>
                            <div className="flex-1 flex gap-2">
                                {slides.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`h-3 rounded-full flex-1 transition-all duration-300 ${
                                            idx <= currentSlide 
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm' 
                                                : 'bg-slate-100'
                                        }`} 
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-xl shrink-0">
                                {currentSlide + 1} / {slides.length}
                            </span>
                        </div>

                        {/* Slide Main Card */}
                        <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 md:p-10 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                                <span className="bg-emerald-100 text-emerald-900 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-amber-500" />
                                    {slides[currentSlide].label}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                    Langkah {currentSlide + 1} dari {slides.length}
                                </span>
                            </div>
                            
                            <div className="space-y-6">
                                {slides[currentSlide].media_url && (
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 shadow-inner">
                                        <img 
                                            src={slides[currentSlide].media_url} 
                                            alt="media materi" 
                                            className="w-full max-w-2xl mx-auto h-64 md:h-80 object-cover rounded-xl shadow-sm" 
                                        />
                                    </div>
                                )}

                                <div className="space-y-4 text-center">
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                                        {slides[currentSlide].content_text}
                                    </h2>

                                    <div className="flex justify-center pt-2">
                                        <button 
                                            onClick={() => speak(slides[currentSlide].content_text)}
                                            className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition-all border border-emerald-200 flex items-center gap-2 font-bold text-sm shadow-sm hover:scale-105 active:scale-95"
                                        >
                                            <Volume2 size={20} />
                                            <span>Dengarkan Penjelasan Dino</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Dino Pro-Tip Box */}
                                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-left">
                                    <div className="text-2xl shrink-0">🦕💡</div>
                                    <p className="text-xs md:text-sm text-amber-900 font-bold leading-relaxed">
                                        <span className="font-black text-amber-950">Catatan Rexy: </span>
                                        {slides[currentSlide].dinoTip}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation controls */}
                        <div className="flex gap-4 items-center">
                            <button 
                                onClick={() => currentSlide > 0 && setCurrentSlide(currentSlide - 1)}
                                disabled={currentSlide === 0}
                                className={`flex-1 flex items-center justify-center gap-2 font-black py-4 rounded-2xl border-2 transition-all ${
                                    currentSlide === 0 
                                        ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50' 
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                                }`}
                            >
                                <ChevronLeft size={22} />
                                <span>Kembali</span>
                            </button>

                            <button 
                                onClick={handleNextSlide}
                                className="flex-[2] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-base tracking-wide"
                            >
                                <span>{currentSlide === slides.length - 1 ? 'Mulai Kuis Akhir Fosil 🦴' : 'Langkah Selanjutnya 🐾'}</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Fallback if no materials */}
                {step === 2 && slides.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border-2 border-emerald-100 shadow-sm p-8 space-y-6">
                        <div className="text-5xl">🌴🦕</div>
                        <h2 className="text-2xl font-black text-slate-800">Materi Sedang Disiapkan Guru</h2>
                        <button 
                            onClick={() => setStep(3)} 
                            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-600/20 transition-all inline-flex items-center gap-2"
                        >
                            <span>Lanjut ke Kuis Akhir</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* STEP 3: POST-TEST */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm text-2xl">
                                🦴🏆
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-800">Tantangan Kuis Fosil (Post-test)</h3>
                            <p className="text-slate-500 font-medium text-sm max-w-md mx-auto">
                                Tunjukkan keahlian baristamu! Selesaikan kuis ini untuk membuka lencana dan hadiah Dino!
                            </p>
                        </div>
                        <TestView questions={postTests} type="post_test" />
                    </div>
                )}

                {/* STEP 4: FINISH & CELEBRATION */}
                {step === 4 && (
                    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 bg-white/95 border-2 border-emerald-200 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-emerald-400 via-amber-400 to-teal-400"></div>

                        {/* Trophy Mascot */}
                        <div className="relative inline-block">
                            <div className="w-32 h-32 md:w-36 md:h-36 bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 rounded-3xl mx-auto flex items-center justify-center text-7xl shadow-2xl shadow-amber-500/30 border-4 border-white animate-bounce">
                                🦖👑
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2.5 rounded-full border-4 border-white shadow-lg">
                                <CheckCircle size={26} strokeWidth={3} />
                            </div>
                        </div>

                        <div className="space-y-3 max-w-md mx-auto">
                            <span className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest inline-flex items-center gap-1.5">
                                <Sparkles size={14} className="text-amber-600" /> Misi Diselesaikan dengan Sempurna!
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                Yei! Hebat Sekali!
                            </h1>
                            <p className="text-base text-slate-600 font-medium leading-relaxed">
                                Selamat, Sahabat Dino! Kamu telah menguasai materi:
                                <span className="text-emerald-800 font-black block text-lg mt-1">{module.title}</span>
                            </p>
                        </div>

                        {/* Reward Badges Box */}
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                            <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-left shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
                                    ⚡
                                </div>
                                <div>
                                    <div className="text-lg font-black text-emerald-950">+100 XP</div>
                                    <div className="text-xs text-emerald-700 font-bold">Kecakapan Dino Naik!</div>
                                </div>
                            </div>

                            <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-left shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-sm">
                                    ☕
                                </div>
                                <div>
                                    <div className="text-lg font-black text-amber-950">+15 Biji</div>
                                    <div className="text-xs text-amber-700 font-bold">Biji Dino Purba</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Link to Dashboard */}
                        <div className="pt-4">
                            <Link 
                                href={route('student.dashboard')}
                                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 mx-auto"
                            >
                                <span>Kembali ke Lembah Dino 🌴</span>
                                <ChevronRight size={24} />
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </StudentLayout>
    );
}
