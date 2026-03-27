<!DOCTYPE html>
<html>
<head>
    <title>Sertifikat Brewtech</title>
    <style>
        @page { margin: 0; }
        body { font-family: 'Helvetica', sans-serif; margin: 0; padding: 0; background-color: #ffffff; }
        .certificate {
            width: 100%;
            height: 100%;
            padding: 50px;
            box-sizing: border-box;
            border: 25px solid #51CBE0;
            position: relative;
            text-align: center;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 10px; left: 10px; right: 10px; bottom: 10px;
            border: 5px solid #FF69B4;
            pointer-events: none;
        }
        .header { margin-top: 40px; }
        .logo { font-size: 40px; font-weight: bold; color: #51CBE0; margin-bottom: 10px; letter-spacing: 5px; }
        .title { font-size: 55px; font-weight: bold; color: #FF69B4; margin-bottom: 15px; text-transform: uppercase; }
        .subtitle { font-size: 22px; color: #64748b; margin-bottom: 40px; font-style: italic; }
        .name { font-size: 45px; font-weight: bold; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #51CBE0; display: inline-block; padding: 0 30px; }
        .content { font-size: 20px; color: #475569; max-width: 850px; margin: 30px auto 50px; line-height: 1.6; }
        .footer { margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 30px; display: table; width: 100%; }
        .signature { display: table-cell; width: 50%; text-align: center; vertical-align: bottom; }
        .sig-name { font-weight: bold; font-size: 18px; color: #1e293b; margin-top: 40px; }
        .sig-title { color: #FF69B4; font-size: 14px; font-weight: bold; text-transform: uppercase; margin-top: 5px; }
        .deco-circle {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: #51CBE0;
            opacity: 0.05;
            z-index: -1;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="deco-circle" style="top: -150px; left: -150px;"></div>
        <div class="deco-circle" style="bottom: -150px; right: -150px; background: #FF69B4;"></div>

        <div class="header">
            <div class="logo">BREWTECH</div>
            <div class="title">Sertifikat Kelulusan</div>
            <div class="subtitle">Dengan bangga mempersembahkan kepada:</div>
        </div>

        <div class="name">{{ $child->name }}</div>

        <div class="content">
            Atas dedikasi, semangat, dan keberhasilannya dalam menyelesaikan seluruh rangkaian kurikulum pelatihan barista di platform <strong>Brewtech</strong>. 
            Penghargaan ini mengakui kompetensi kognitif dan praktik yang telah dicapai dengan standar yang sangat baik.
        </div>

        <div class="footer">
            <div class="signature">
                <div class="sig-name">Brewtech Academy</div>
                <div class="sig-title">Platform Barista Inklusif</div>
            </div>
            <div class="signature">
                <div class="sig-name">{{ date('d F Y') }}</div>
                <div class="sig-title">Tanggal Penerbitan</div>
            </div>
        </div>
    </div>
</body>
</html>
