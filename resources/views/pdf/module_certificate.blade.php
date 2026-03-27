<!DOCTYPE html>
<html>
<head>
    <title>Sertifikat Modul Brewtech</title>
    <style>
        @page { margin: 0; }
        body { font-family: 'Helvetica', sans-serif; margin: 0; padding: 0; background-color: #ffffff; }
        .wrapper {
            padding: 40px;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
        }
        .certificate {
            width: 100%;
            height: 100%;
            border: 15px solid #51CBE0;
            box-sizing: border-box;
            position: relative;
            text-align: center;
            background-color: white;
            padding: 50px;
        }
        .inner-border {
            position: absolute;
            top: 10px; left: 10px; right: 10px; bottom: 10px;
            border: 4px solid #FF69B4;
            pointer-events: none;
        }
        .header { margin-top: 20px; }
        .logo { font-size: 36px; font-weight: bold; color: #51CBE0; letter-spacing: 6px; margin-bottom: 5px; }
        .title { font-size: 48px; font-weight: bold; color: #FF69B4; text-transform: uppercase; margin-bottom: 5px; }
        .subtitle { font-size: 18px; color: #64748b; font-style: italic; margin-bottom: 30px; }
        
        .name-container { border-bottom: 2px solid #51CBE0; display: inline-block; padding: 0 40px; margin-bottom: 5px; }
        .name { font-size: 42px; font-weight: bold; color: #1e293b; margin: 0; }
        
        .module-label { font-size: 12px; color: #FF69B4; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; margin-top: 20px; }
        .module-name { font-size: 30px; font-weight: bold; color: #51CBE0; margin-top: 5px; margin-bottom: 30px; }
        
        .content { font-size: 18px; color: #475569; max-width: 750px; margin: 0 auto 40px; line-height: 1.6; }
        
        .stats-grid { display: table; width: 60%; margin: 0 auto 40px; border: 1px dashed #51CBE0; background: #fafdfe; border-radius: 15px; padding: 10px; }
        .stat-cell { display: table-cell; width: 50%; padding: 10px; }
        .stat-label { font-size: 10px; color: #64748b; font-weight: bold; text-transform: uppercase; }
        .stat-value { font-size: 22px; font-weight: bold; color: #FF69B4; }

        .footer { display: table; width: 100%; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 30px; }
        .signature { display: table-cell; width: 50%; vertical-align: bottom; }
        .sig-name { font-weight: bold; font-size: 18px; color: #0f172a; margin-bottom: 0px; }
        .sig-title { color: #FF69B4; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-top: 5px; }
        
        .deco-top-left { position: absolute; top: -10px; left: -10px; width: 100px; height: 100px; background: radial-gradient(circle, #ffe4e6 0%, transparent 70%); z-index: -1; opacity: 0.5; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="certificate">
            <div class="inner-border"></div>
            
            <div class="header">
                <div class="logo">BREWTECH</div>
                <div class="title">Sertifikat Kelulusan</div>
                <div class="subtitle">Diberikan sebagai penghargaan atas pencapaian kepada:</div>
            </div>

            <div class="name-container">
                <h1 class="name">{{ $child->name }}</h1>
            </div>

            <div class="module-label">Telah Berhasil Menyelesaikan Modul</div>
            <div class="module-name">{{ $module->title }}</div>

            <div class="content">
                Sertifikat ini mengakui kepiawaian dan penguasaan teknik yang ditunjukkan selama proses pembelajaran dan evaluasi praktik pada modul ini dengan hasil yang sangat memuaskan.
            </div>

            <div class="stats-grid">
                <div class="stat-cell">
                    <div class="stat-label">Skor Post-test</div>
                    <div class="stat-value">{{ $progress->post_test_score }}</div>
                </div>
                @if(isset($avgSoftSkill))
                <div class="stat-cell">
                    <div class="stat-label">Skor Praktik</div>
                    <div class="stat-value">{{ round($avgSoftSkill, 1) }}</div>
                </div>
                @endif
            </div>

            <div class="footer">
                <div class="signature">
                    <p class="sig-name">Brewtech Academy</p>
                    <p class="sig-title">Platform Barista Inklusif</p>
                </div>
                <div class="signature">
                    <p class="sig-name">{{ date('d F Y') }}</p>
                    <p class="sig-title">Tanggal Penerbitan</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
