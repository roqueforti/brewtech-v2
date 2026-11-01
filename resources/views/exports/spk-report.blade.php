<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Hasil SPK - {{ $schoolInfo->name }}</title>
    <style>
        @page { margin: 25px 30px; size: landscape; }
        body { font-family: 'Helvetica', sans-serif; font-size: 10px; color: #1e293b; line-height: 1.4; margin: 0; padding: 0; }
        .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; position: relative; }
        .brand { font-size: 18px; font-weight: bold; color: #0284c7; letter-spacing: 2px; }
        .title { font-size: 13px; font-weight: bold; color: #db2777; text-transform: uppercase; margin-top: 3px; }
        .school-name { font-size: 12px; font-weight: bold; color: #0f172a; margin-top: 2px; }
        .meta { color: #64748b; font-size: 9px; margin-top: 4px; }
        
        .method-banner { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 6px 12px; margin-bottom: 12px; display: table; width: 100%; box-sizing: border-box; }
        .method-title { font-weight: bold; color: #166534; font-size: 10px; text-transform: uppercase; }
        .method-desc { color: #15803d; font-size: 9px; }

        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; }
        .info-card table { width: 100%; }
        .info-card td { padding: 2px 0; font-size: 10px; }
        .info-card .lbl { color: #64748b; font-weight: bold; width: 150px; }

        .table-data { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .table-data th { background: #0284c7; color: white; padding: 6px 5px; font-size: 9px; text-transform: uppercase; text-align: left; }
        .table-data td { border-bottom: 1px solid #e2e8f0; padding: 5px; font-size: 9px; }
        .table-data tr:nth-child(even) td { background: #f8fafc; }
        
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8px; font-weight: bold; }
        .badge-ready { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-review { background: #fee2e2; color: #991b1b; }
        
        .footer { margin-top: 24px; font-size: 8px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">BREWTECH &bull; INCLUSIVE VOCATION PLATFORM</div>
        <div class="title">Laporan Penilaian SPK (Multi-Criteria Decision Making) Penempatan PKL</div>
        <div class="school-name">{{ $schoolInfo->name }}</div>
        <div class="meta">{{ $schoolInfo->address }} | Tanggal Unduh: {{ date('d F Y, H:i') }} WIB</div>
    </div>

    @if(!empty($analysis))
    <div class="method-banner">
        <div class="method-title">Model Algoritma Aktif: {{ $analysis['method_name'] ?? 'MCDM Engine' }}</div>
        <div class="method-desc">{{ $analysis['method_desc'] ?? 'Penilaian berbasis kriteria multivariat terintegrasi.' }}</div>
    </div>
    @endif

    <div class="info-card">
        <table>
            <tr>
                <td class="lbl">Satuan Pendidikan:</td>
                <td><strong>{{ $schoolInfo->name }}</strong></td>
                <td class="lbl">Total Alternatif Dinilai:</td>
                <td><strong>{{ count($spkResults) }} Siswa</strong></td>
            </tr>
            <tr>
                <td class="lbl">Kriteria Evaluasi:</td>
                <td>C1 (Teknis), C2 (Disiplin), C3 (Kebersihan), C4 (Kerjasama), C5 (Komunikasi), C6 (Inisiatif)</td>
                <td class="lbl">Standar Kelayakan:</td>
                <td>Siap Kerja (&ge;80) | Pendampingan (65-79) | Pelatihan (&lt;65)</td>
            </tr>
        </table>
    </div>

    <table class="table-data">
        <thead>
            <tr>
                <th style="width: 25px; text-align: center;">Rank</th>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Disabilitas</th>
                <th style="width: 40px; text-align: right;">C1 (Teknis)</th>
                <th style="width: 40px; text-align: right;">C2 (Disiplin)</th>
                <th style="width: 40px; text-align: right;">C3 (Higienis)</th>
                <th style="width: 40px; text-align: right;">C4 (Tim)</th>
                <th style="width: 40px; text-align: right;">C5 (Relasi)</th>
                <th style="width: 40px; text-align: right;">C6 (Inisiatif)</th>
                <th style="width: 45px; text-align: right;">Skor Akhir</th>
                <th style="width: 140px;">Kategori Rekomendasi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($spkResults as $index => $res)
            @php
                $isArr = is_array($res);
                $st = $isArr ? ($res['student'] ?? null) : ($res->student ?? null);
                $stName = is_object($st) ? $st->name : ($st['name'] ?? '-');
                $stClass = is_object($st) ? ($st->class->name ?? '-') : ($st['class']['name'] ?? '-');
                $stDis = is_object($st) ? ($st->disability_type ?? 'Umum') : ($st['disability_type'] ?? 'Umum');

                $scores = $isArr ? ($res['scores'] ?? []) : ($res->scores ?? []);
                $c1 = $scores['c1_hardskill'] ?? ($isArr ? ($res['hard_skill_score'] ?? 0) : ($res->hard_skill_score ?? 0));
                $c2 = $scores['c2_discipline'] ?? 0;
                $c3 = $scores['c3_cleanliness'] ?? 0;
                $c4 = $scores['c4_teamwork'] ?? 0;
                $c5 = $scores['c5_communication'] ?? 0;
                $c6 = $scores['c6_initiative'] ?? 0;

                $final = $isArr ? ($res['final_score'] ?? 0) : ($res->final_score ?? 0);
                $kategori = $isArr ? ($res['kategori_spk'] ?? '-') : ($res->kategori_spk ?? '-');
                $rank = $isArr ? ($res['rank'] ?? ($index + 1)) : ($res->rank ?? ($index + 1));
            @endphp
            <tr>
                <td style="text-align: center; font-weight: bold;">{{ $rank }}</td>
                <td><strong>{{ $stName }}</strong></td>
                <td>{{ $stClass }}</td>
                <td>{{ $stDis }}</td>
                <td style="text-align: right;">{{ number_format($c1, 1) }}</td>
                <td style="text-align: right;">{{ number_format($c2, 1) }}</td>
                <td style="text-align: right;">{{ number_format($c3, 1) }}</td>
                <td style="text-align: right;">{{ number_format($c4, 1) }}</td>
                <td style="text-align: right;">{{ number_format($c5, 1) }}</td>
                <td style="text-align: right;">{{ number_format($c6, 1) }}</td>
                <td style="text-align: right;"><strong>{{ number_format($final, 1) }}</strong></td>
                <td>
                    @if(str_contains(strtolower($kategori), 'siap') || str_contains(strtolower($kategori), 'magang'))
                        <span class="badge badge-ready">{{ $kategori }}</span>
                    @elseif(str_contains(strtolower($kategori), 'pendampingan'))
                        <span class="badge badge-pending">{{ $kategori }}</span>
                    @else
                        <span class="badge badge-review">{{ $kategori }}</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="12" style="text-align: center; padding: 20px; color: #94a3b8;">Belum ada data evaluasi siswa terhitung.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dokumen Laporan Ilmiah SPK ini diterbitkan secara otomatis oleh Sistem BREWTECH &bull; Platform Pendidikan Vokasi Inklusif Nasional
    </div>
</body>
</html>
