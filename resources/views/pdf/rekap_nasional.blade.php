<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #51CBE0;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1e293b;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            color: #64748b;
            margin: 5px 0 0;
        }
        .content {
            margin: 0 auto;
            max-width: 800px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table, th, td {
            border: 1px solid #e2e8f0;
        }
        th {
            background-color: #f8fafc;
            color: #475569;
            text-align: left;
            padding: 12px;
            font-weight: bold;
        }
        td {
            padding: 12px;
            color: #334155;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>Tanggal Cetak: {{ $date }}</p>
    </div>

    <div class="content">
        <h3>Ringkasan Eksekutif Nasional</h3>
        <p>Berikut adalah rekapitulasi data capaian jangkauan nasional aplikasi BrewTech (Sistem Informasi dan Inkubasi Karier SLB). Data ini diambil secara *real-time* dari seluruh jaringan mitra di Indonesia.</p>

        <table>
            <thead>
                <tr>
                    <th>Indikator</th>
                    <th>Total Terdaftar</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Total Sekolah Luar Biasa (Mitra SLB)</td>
                    <td><strong>{{ $total_school }} Sekolah</strong></td>
                </tr>
                <tr>
                    <td>Total Outlet Kafe Industri</td>
                    <td><strong>{{ $total_cafe }} Kafe</strong></td>
                </tr>
                <tr>
                    <td>Total Siswa Difabel Aktif</td>
                    <td><strong>{{ $total_student }} Siswa</strong></td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 40px;">
            <p>Laporan ini dihasilkan secara otomatis oleh sistem BrewTech pada {{ $date }}.</p>
            <p>Direktorat terkait dapat menggunakan data ini sebagai landasan pengambilan keputusan dan evaluasi perkembangan program adopsi kurikulum.</p>
        </div>
    </div>

    <div class="footer">
        BrewTech System V2 - Generated on {{ now()->format('Y-m-d H:i:s') }}
    </div>
</body>
</html>
