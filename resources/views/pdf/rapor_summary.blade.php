<!DOCTYPE html>
<html>
<head>
    <title>Rapor Belajar Brewtech</title>
    <style>
        @page { margin: 30px; }
        body { font-family: 'Helvetica', sans-serif; margin: 0; padding: 0; color: #1e293b; line-height: 1.5; }
        .container {
            width: 90%;
            margin: 0 auto;
            border: 2px solid #51CBE0;
            padding: 40px;
            min-height: 900px;
            position: relative;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #FF69B4;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo { font-size: 32px; font-weight: bold; color: #51CBE0; letter-spacing: 4px; }
        .title { font-size: 24px; font-weight: bold; color: #FF69B4; text-transform: uppercase; margin-top: 10px; }
        
        .student-info { margin-bottom: 30px; font-size: 14px; }
        .student-info table { width: 100%; border-collapse: collapse; }
        .student-info td { padding: 5px 0; }
        .student-info .label { width: 150px; font-weight: bold; color: #64748b; }

        .section-title {
            background-color: #f8fafc;
            border-left: 5px solid #51CBE0;
            padding: 8px 15px;
            font-weight: bold;
            color: #0f172a;
            margin: 25px 0 15px 0;
            text-transform: uppercase;
            font-size: 14px;
        }

        .performance-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .performance-table th { background-color: #51CBE0; color: white; text-align: left; padding: 10px; font-size: 12px; }
        .performance-table td { border-bottom: 1px solid #e2e8f0; padding: 10px; font-size: 12px; }
        .status-badge { 
            padding: 3px 8px; 
            border-radius: 10px; 
            font-size: 10px; 
            font-weight: bold; 
            background: #f1f5f9; 
            color: #64748b;
        }
        .status-complete { background: #dcfce7; color: #166534; }

        .summary-box {
            display: table;
            width: 100%;
            margin-top: 20px;
            padding: 20px;
            background: #fffafa;
            border: 1px solid #ffe4e6;
            border-radius: 15px;
        }
        .summary-item { display: table-cell; text-align: center; width: 33%; }
        .summary-value { font-size: 24px; font-weight: bold; color: #FF69B4; }
        .summary-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }

        .footer { margin-top: 50px; display: table; width: 100%; }
        .signature { display: table-cell; width: 50%; text-align: center; font-size: 14px; }
        .sig-space { height: 80px; }
        .sig-name { font-weight: bold; border-bottom: 1px solid #1e293b; display: inline-block; padding: 0 20px; }
        
        .watermark {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(81, 203, 224, 0.05);
            z-index: -1;
            font-weight: bold;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="watermark">BREWTECH ACADEMY</div>
        
        <div class="header">
            <div class="logo">BREWTECH</div>
            <div class="title">Rapor Hasil Belajar</div>
        </div>

        <div class="student-info">
            <table>
                <tr>
                    <td class="label">Nama Siswa</td>
                    <td>: {{ $child->name }}</td>
                </tr>
                <tr>
                    <td class="label">Sekolah</td>
                    <td>: {{ $child->school->name ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Tipe Disabilitas</td>
                    <td>: {{ $child->disability_type ?? '-' }}</td>
                </tr>
                <tr>
                    <td class="label">Tanggal Cetak</td>
                    <td>: {{ date('d F Y') }}</td>
                </tr>
            </table>
        </div>

        <div class="section-title">Ringkasan Capaian</div>
        <div class="summary-box">
            <div class="summary-item">
                <div class="summary-value">{{ $progress->where('status', 'completed')->count() }}/{{ $modules->count() }}</div>
                <div class="summary-label">Modul Selesai</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">{{ round($progress->avg('post_test_score'), 1) ?? 0 }}</div>
                <div class="summary-label">Rata-rata Kognitif</div>
            </div>
            <div class="summary-item">
                <div class="summary-value">{{ round($evaluations->avg('score'), 1) ?? 0 }}</div>
                <div class="summary-label">Rata-rata Praktik</div>
            </div>
        </div>

        <div class="section-title">Detail Modul & Evaluasi</div>
        <table class="performance-table">
            <thead>
                <tr>
                    <th>Nama Modul</th>
                    <th>Pre-test</th>
                    <th>Post-test</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($modules as $module)
                    @php
                        $p = $progress->where('module_id', $module->id)->first();
                    @endphp
                    <tr>
                        <td>{{ $module->title }}</td>
                        <td>{{ $p->pre_test_score ?? '-' }}</td>
                        <td>{{ $p->post_test_score ?? '-' }}</td>
                        <td>
                            <span class="status-badge {{ ($p && $p->status == 'completed') ? 'status-complete' : '' }}">
                                {{ ($p && $p->status == 'completed') ? 'Selesai' : 'Belum' }}
                            </span>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <div class="signature">
                <p>Mengetahui,</p>
                <div class="sig-space"></div>
                <p class="sig-name">Brewtech Academy Team</p>
                <p style="font-size: 10px; color: #64748b;">Sistem Pelatihan Inklusif</p>
            </div>
            <div class="signature">
                <p>Jakarta, {{ date('d F Y') }}</p>
                <div class="sig-space"></div>
                <p class="sig-name">Instructor Representative</p>
                <p style="font-size: 10px; color: #64748b;">Brewtech Partner</p>
            </div>
        </div>
    </div>
</body>
</html>
