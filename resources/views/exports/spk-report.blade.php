<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Hasil SPK - {{ $schoolInfo->name }}</title>
    <style>
        @page { margin: 25px 30px; }
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #1e293b; line-height: 1.4; margin: 0; padding: 0; }
        .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
        .brand { font-size: 20px; font-weight: bold; color: #0284c7; letter-spacing: 2px; }
        .title { font-size: 15px; font-weight: bold; color: #ec4899; text-transform: uppercase; margin-top: 4px; }
        .school-name { font-size: 13px; font-weight: bold; color: #0f172a; margin-top: 2px; }
        .meta { color: #64748b; font-size: 10px; margin-top: 4px; }
        .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 16px; }
        .info-card table { width: 100%; }
        .info-card td { padding: 3px 0; font-size: 11px; }
        .info-card .lbl { color: #64748b; font-weight: bold; width: 160px; }
        .table-data { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table-data th { background: #0284c7; color: white; padding: 8px 6px; font-size: 10px; text-transform: uppercase; text-align: left; }
        .table-data td { border-bottom: 1px solid #e2e8f0; padding: 7px 6px; font-size: 10px; }
        .table-data tr:nth-child(even) td { background: #f8fafc; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
        .badge-ready { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-review { background: #fee2e2; color: #991b1b; }
        .footer { margin-top: 30px; font-size: 9px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">BREWTECH &bull; INCLUSIVE VOCATION PLATFORM</div>
        <div class="title">Laporan Penilaian SPK (Sistem Pendukung Keputusan) PKL</div>
        <div class="school-name">{{ $schoolInfo->name }}</div>
        <div class="meta">{{ $schoolInfo->address }} | Tanggal Cetak: {{ date('d F Y') }}</div>
    </div>

    <div class="info-card">
        <table>
            <tr>
                <td class="lbl">Satuan Pendidikan:</td>
                <td><strong>{{ $schoolInfo->name }}</strong></td>
                <td class="lbl">Bobot Hard Skill:</td>
                <td><strong>{{ $schoolInfo->spk_hard_skill_weight ?? 70 }}%</strong></td>
            </tr>
            <tr>
                <td class="lbl">Total Siswa Terdaftar:</td>
                <td><strong>{{ count($spkResults) }} Siswa</strong></td>
                <td class="lbl">Bobot Soft Skill:</td>
                <td><strong>{{ $schoolInfo->spk_soft_skill_weight ?? 30 }}%</strong></td>
            </tr>
        </table>
    </div>

    <table class="table-data">
        <thead>
            <tr>
                <th style="width: 25px; text-align: center;">No</th>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Disabilitas</th>
                <th style="width: 50px; text-align: right;">Hard</th>
                <th style="width: 50px; text-align: right;">Soft</th>
                <th style="width: 55px; text-align: right;">Skor Akhir</th>
                <th style="width: 130px;">Kategori Kelayakan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($spkResults as $index => $res)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td><strong>{{ $res->student->name }}</strong></td>
                <td>{{ $res->student->class?->name ?? '-' }}</td>
                <td>{{ $res->student->disability_type ?? 'Umum' }}</td>
                <td style="text-align: right;">{{ number_format($res->hard_skill_score, 1) }}</td>
                <td style="text-align: right;">{{ number_format($res->soft_skill_score, 1) }}</td>
                <td style="text-align: right;"><strong>{{ number_format($res->final_score, 1) }}</strong></td>
                <td>
                    @if(str_contains(strtolower($res->kategori_spk), 'siap') || str_contains(strtolower($res->kategori_spk), 'magang'))
                        <span class="badge badge-ready">{{ $res->kategori_spk }}</span>
                    @elseif(str_contains(strtolower($res->kategori_spk), 'pendampingan'))
                        <span class="badge badge-pending">{{ $res->kategori_spk }}</span>
                    @else
                        <span class="badge badge-review">{{ $res->kategori_spk }}</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #94a3b8;">Belum ada data penilaian siswa.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dokumen ini diterbitkan secara otomatis oleh Sistem BREWTECH &bull; Platform Pendidikan Vokasi Inklusif Nasional
    </div>
</body>
</html>
