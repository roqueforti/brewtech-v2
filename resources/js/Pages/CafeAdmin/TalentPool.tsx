import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Users, Award, ExternalLink, CheckCircle, Search } from 'lucide-react';

export default function TalentPool({ auth, talents }: any) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTalents = useMemo(() => {
        if (!searchQuery) return talents;
        const q = searchQuery.toLowerCase();
        return talents.filter((t: any) => t.name.toLowerCase().includes(q));
    }, [talents, searchQuery]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Bursa Kerja SLB" />

            <div className="py-8 max-w-7xl mx-auto space-y-8">
                {/* Header Profile */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-10 md:p-14 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden border border-emerald-500/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex-1">
                        <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
                            Bursa Talenta Inklusif
                        </h2>
                        <p className="text-emerald-50 font-medium max-w-2xl text-lg leading-relaxed opacity-90">
                            Temukan barista terbaik lulusan SLB yang telah melalui pelatihan 
                            modul terstandarisasi dan siap berkontribusi di industri kafe.
                        </p>
                    </div>
                    <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 relative z-10 shrink-0 shadow-2xl">
                        <Users size={56} className="text-white" />
                    </div>
                </div>

                {/* Talent List Grid */}
                <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Award className="text-orange-400" size={14} /> Berdasarkan Skor Tertinggi
                        </h3>
                        <div className="w-full md:w-auto bg-white border border-slate-100 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm text-slate-400 font-bold shadow-sm focus-within:border-emerald-500/30 transition-all">
                            <Search size={16} className="text-slate-300" />
                            <input 
                                type="text" 
                                placeholder="Cari talenta..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none p-0 focus:ring-0 text-slate-600 text-xs w-full md:w-48 placeholder:text-slate-300 placeholder:font-medium" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTalents.length === 0 ? (
                            <div className="col-span-full py-24 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-1">
                                    {searchQuery ? 'Talenta tidak ditemukan' : 'Belum ada talenta'}
                                </h3>
                                <p className="text-xs font-medium opacity-60">
                                    {searchQuery ? `Tidak ada siswa yang cocok dengan "${searchQuery}".` : 'Belum ada siswa yang menyelesaikan pelatihan modul.'}
                                </p>
                            </div>
                        ) : (
                            filteredTalents.map((talent: any, index: number) => (
                                <div key={talent.id} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:translate-y-[-4px] transition-all group flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-50 transition-colors"></div>
                                    
                                    {/* Ranking Badge if Top 3 */}
                                    {index < 3 && (
                                        <div className="absolute -right-2 -top-2 w-16 h-16 bg-orange-400 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20 z-10 p-2">
                                            #{index + 1}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-5 mb-8 relative z-0">
                                        <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-bold text-lg uppercase shadow-sm border border-slate-100 shrink-0 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                                            {talent.name.substring(0, 2)}
                                        </div>
                                        <div className="pr-4 flex-1 overflow-hidden">
                                            <h4 className="text-lg font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors mb-0.5">
                                                {talent.name}
                                            </h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{talent.school} • {talent.disability_type}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 flex-grow mb-8 group-hover:bg-white transition-colors relative z-10">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Skor Kelayakan (SPK)</span>
                                            <span className="text-xl font-bold text-slate-900 tracking-tight">{talent.spk_score}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200/50 rounded-full h-1.5 mb-5 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${talent.spk_score > 70 ? 'bg-emerald-500' : 'bg-orange-400'}`} 
                                                style={{width: `${talent.spk_score}%`}}
                                            ></div>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 leading-relaxed italic">
                                            <CheckCircle size={14} className={talent.ready_for_pkl ? "text-emerald-500" : "text-slate-300"} />
                                            {talent.recommendation}
                                        </div>
                                    </div>

                                    <button className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-emerald-500/20 active:scale-[0.98]">
                                        Unduh Profil Lengkap <ExternalLink size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
