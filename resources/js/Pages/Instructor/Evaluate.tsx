import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, ClipboardList, TrendingUp } from 'lucide-react';

export default function Evaluate({ auth, student, module, existingEvaluations }: any) {
    
    const softSkills = module.soft_skill_criteria || [];

    // Initialize form data using existing evaluations if available
    const initialEvaluations = softSkills.map((skill: any) => {
        const existing = existingEvaluations[skill.id];
        return {
            criteria_id: skill.id,
            criteria_name: skill.criteria_name,
            score: existing ? existing.score : '',
            observation_notes: existing ? existing.observation_notes : ''
        };
    });

    const { data, setData, post, processing, errors } = useForm({
        evaluations: initialEvaluations
    });

    const handleScoreChange = (index: number, val: string) => {
        const evals = [...data.evaluations];
        evals[index].score = val;
        setData('evaluations', evals);
    };

    const handleNotesChange = (index: number, val: string) => {
        const evals = [...data.evaluations];
        evals[index].observation_notes = val;
        setData('evaluations', evals);
    };

    const submit = (e: any) => {
        e.preventDefault();
        if (!confirm('Apakah Anda yakin ingin menyimpan evaluasi ini? Nilai tidak dapat diubah setelah disimpan.')) return;
        post(route('instructor.evaluate.store', [student.id, module.id]));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Evaluasi Praktik - ${student.name}`} />

            <div className="py-8 max-w-4xl mx-auto space-y-6">
                <Link href={route('instructor.students.show', student.id)} className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition-all bg-white px-5 py-2.5 border border-slate-100 rounded-xl shadow-sm text-xs w-max uppercase tracking-wider active:scale-95">
                    <ArrowLeft size={16} /> Batal
                </Link>

                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm">
                    <div className="border-b border-slate-100 pb-8 mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Evaluasi Praktik & Soft Skill</h2>
                                <p className="text-xs text-slate-500 font-semibold tracking-tight">Observasi perilaku dan keterampilan sosial siswa</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="bg-emerald-50 text-emerald-700 font-bold uppercase text-[10px] tracking-wider px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
                                Siswa: {student.name}
                            </span>
                            <span className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                Modul: {module.title}
                            </span>
                        </div>
                    </div>

                    {softSkills.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 font-bold">
                            <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
                            Modul ini belum memiliki parameter soft skill yang perlu diobservasi.
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-8">
                            <div className="space-y-6">
                                {data.evaluations.map((evalItem: any, index: number) => (
                                    <div key={evalItem.criteria_id} className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl relative group focus-within:border-emerald-500/30 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-emerald-500/5 transition-all">
                                        <div className="absolute top-6 right-6 text-emerald-500/5 group-focus-within:text-emerald-500/10 transition-colors pointer-events-none">
                                            <TrendingUp size={64} />
                                        </div>
                                        
                                        <h4 className="font-bold text-slate-700 mb-5 relative z-10 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                            {evalItem.criteria_name}
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Skor (0-100)</label>
                                                <input 
                                                    type="number" 
                                                    min="0" max="100"
                                                    required
                                                    value={evalItem.score}
                                                    onChange={e => handleScoreChange(index, e.target.value)}
                                                    className="w-full text-lg font-bold rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-200 shadow-sm"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Catatan Observasi Khusus</label>
                                                <input 
                                                    type="text" 
                                                    value={evalItem.observation_notes}
                                                    onChange={e => handleNotesChange(index, e.target.value)}
                                                    className="w-full text-sm font-semibold text-slate-600 rounded-xl border border-slate-200 px-4 py-3 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm"
                                                    placeholder="Contoh: Siswa mampu berinisiatif membersihkan alat..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-xs py-5 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <CheckCircle size={18} /> Simpan Evaluasi Praktik
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
