# -*- coding: utf-8 -*-
"""
Generate a world-class 16:9 Pitch Deck for BREWTECH with high-res UI mockups.
Outputs:
1. BREWTECH_Pitch_Deck.pdf (16:9 Widescreen Presentation PDF)
2. BREWTECH_Pitch_Deck.html (Standalone Interactive Fullscreen Slide Deck)
3. BREWTECH_Pitch_Deck.md (Slide-by-slide Markdown for portfolio)
"""

import os
import base64
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

SCREENSHOTS_DIR = r"d:\PAL\brewtech\doc_screenshots"
PDF_OUT = r"d:\PAL\brewtech\BREWTECH_Pitch_Deck.pdf"
HTML_OUT = r"d:\PAL\brewtech\BREWTECH_Pitch_Deck.html"
MD_OUT = r"d:\PAL\brewtech\BREWTECH_Pitch_Deck.md"

def get_base64_img(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{data}"
    return ""

def create_pitch_deck():
    # Load screenshots
    img_hero = get_base64_img("01_landing_hero.png")
    img_talents = get_base64_img("02_landing_talents.png")
    img_gallery = get_base64_img("03_landing_gallery.png")
    img_student_dash = get_base64_img("21_student_dashboard.png")
    img_quiz = get_base64_img("08b_module_preview_quiz.png")
    img_reports = get_base64_img("14_school_reports.png")
    img_spk_settings = get_base64_img("15_school_spk.png")
    img_pos = get_base64_img("17_cafe_pos.png")
    img_cafe_dash = get_base64_img("16_cafe_dashboard.png")
    img_products = get_base64_img("18_cafe_products.png")
    img_parent = get_base64_img("22_parent_dashboard.png")
    img_instructor_dash = get_base64_img("19_instructor_dashboard.png")
    img_instructor_eval = get_base64_img("20_instructor_classes.png")
    img_superadmin = get_base64_img("05_superadmin_dashboard.png")
    img_logs = get_base64_img("10_superadmin_logs.png")

    html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>BREWTECH Pitch Deck - Inclusive Vocation & Commercial Coffee Ecosystem</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap');

    @page {{
        size: 297mm 167.0625mm; /* Exact 16:9 Landscape A4 Proportion */
        margin: 0;
    }}

    * {{
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }}

    body {{
        margin: 0;
        padding: 0;
        font-family: 'Montserrat', -apple-system, sans-serif;
        background: #090d16;
        color: #f8fafc;
        -webkit-font-smoothing: antialiased;
    }}

    .slide {{
        width: 297mm;
        height: 167.0625mm;
        padding: 14mm 18mm;
        position: relative;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: radial-gradient(circle at 85% 15%, rgba(14, 165, 233, 0.12) 0%, rgba(9, 13, 22, 1) 70%);
    }}

    /* Top Header Pill */
    .slide-badge {{
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 14px;
        background: rgba(14, 165, 233, 0.12);
        border: 1px solid rgba(14, 165, 233, 0.35);
        color: #38bdf8;
        font-size: 7pt;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        border-radius: 20px;
    }}

    .slide-title {{
        font-size: 20pt;
        font-weight: 900;
        color: #ffffff;
        margin: 6px 0 2px 0;
        letter-spacing: -0.5px;
        line-height: 1.15;
    }}

    .slide-title span.hl-cyan {{ color: #0ea5e9; }}
    .slide-title span.hl-pink {{ color: #ec4899; }}
    .slide-title span.hl-purple {{ color: #a855f7; }}

    .slide-desc {{
        font-size: 8.5pt;
        color: #94a3b8;
        max-width: 780px;
        line-height: 1.4;
        margin: 0 0 10px 0;
    }}

    /* Device Mockups */
    .laptop-mockup {{
        background: #1e293b;
        border-radius: 12px;
        padding: 8px 8px 6px 8px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1);
        position: relative;
    }}

    .laptop-header {{
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 6px;
        padding: 0 4px;
    }}

    .dot {{ width: 7px; height: 7px; border-radius: 50%; }}
    .dot-red {{ background: #ef4444; }}
    .dot-yellow {{ background: #f59e0b; }}
    .dot-green {{ background: #10b981; }}
    .url-bar {{
        background: rgba(0, 0, 0, 0.3);
        border-radius: 6px;
        padding: 2px 10px;
        font-size: 6pt;
        color: #94a3b8;
        margin-left: 8px;
        flex: 1;
        font-family: monospace;
    }}

    .laptop-screen {{
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }}

    .laptop-screen img {{
        width: 100%;
        display: block;
    }}

    /* Tablet Mockup */
    .tablet-mockup {{
        background: #0f172a;
        border-radius: 20px;
        padding: 8px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1.5px rgba(255, 255, 255, 0.15);
    }}

    .tablet-screen {{
        border-radius: 14px;
        overflow: hidden;
    }}

    .tablet-screen img {{
        width: 100%;
        display: block;
    }}

    /* Grid Layouts */
    .grid-2 {{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        align-items: center;
        flex: 1;
    }}

    .grid-3 {{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 12px;
        flex: 1;
    }}

    .grid-4 {{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        flex: 1;
    }}

    /* Cards */
    .card {{
        background: rgba(15, 23, 42, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 12px 16px;
        backdrop-filter: blur(10px);
    }}

    .card-cyan {{ border-left: 3px solid #0ea5e9; }}
    .card-pink {{ border-left: 3px solid #ec4899; }}
    .card-purple {{ border-left: 3px solid #a855f7; }}
    .card-green {{ border-left: 3px solid #10b981; }}

    .card-title {{
        font-size: 9.5pt;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 4px;
    }}

    .card-desc {{
        font-size: 7.5pt;
        color: #94a3b8;
        line-height: 1.45;
    }}

    /* Stat Big Number */
    .stat-number {{
        font-size: 26pt;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -1px;
    }}

    .stat-label {{
        font-size: 7pt;
        font-weight: 700;
        text-transform: uppercase;
        color: #94a3b8;
        letter-spacing: 1px;
        margin-top: 4px;
    }}

    /* Slide Footer */
    .slide-footer {{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 6.5pt;
        color: #64748b;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
    }}
</style>
</head>
<body>

    <!-- ============================================================= -->
    <!-- SLIDE 1: COVER (THE HOOK) -->
    <!-- ============================================================= -->
    <section class="slide" style="background: radial-gradient(circle at 75% 25%, rgba(236, 72, 153, 0.15) 0%, rgba(14, 165, 233, 0.12) 40%, rgba(9, 13, 22, 1) 75%);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="slide-badge">⚡ PITCH DECK &bull; SEED STAGE</div>
            <div style="font-size: 7pt; color: #64748b; font-weight: 700; letter-spacing: 1px;">HTTPS://BREWTECH-V2.VERCEL.APP</div>
        </div>

        <div class="grid-2" style="margin-top: 6px;">
            <div style="padding-right: 14px;">
                <h1 style="font-size: 38pt; font-weight: 900; line-height: 1.05; margin: 0 0 10px 0; letter-spacing: -1.5px;">
                    BREW<span class="hl-cyan">TECH</span>
                </h1>
                <div style="font-size: 14pt; font-weight: 800; color: #38bdf8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
                    INCLUSIVE VOCATION PLATFORM
                </div>
                <p style="font-size: 9.5pt; color: #cbd5e1; line-height: 1.5; margin-bottom: 20px;">
                    Platform SaaS terpadu yang memberdayakan talenta penyandang disabilitas dari ruang kelas vokasi SLB, diuji dengan sains keputusan (SPK MCDM), hingga terserap mandiri di mesin kasir POS kafe komersial.
                </p>
                <div style="display: flex; gap: 12px;">
                    <div class="card card-cyan" style="flex: 1; padding: 10px 14px;">
                        <div class="stat-number hl-cyan">65</div>
                        <div class="stat-label">Siswa Terdaftar</div>
                    </div>
                    <div class="card card-pink" style="flex: 1; padding: 10px 14px;">
                        <div class="stat-number hl-pink">11</div>
                        <div class="stat-label">SLB Binaan</div>
                    </div>
                    <div class="card card-purple" style="flex: 1; padding: 10px 14px;">
                        <div class="stat-number hl-purple">11</div>
                        <div class="stat-label">Mitra Kafe</div>
                    </div>
                </div>
            </div>

            <!-- Laptop Mockup -->
            <div class="laptop-mockup">
                <div class="laptop-header">
                    <div class="dot dot-red"></div>
                    <div class="dot dot-yellow"></div>
                    <div class="dot dot-green"></div>
                    <div class="url-bar">https://brewtech-v2.vercel.app &bull; Live Production</div>
                </div>
                <div class="laptop-screen">
                    <img src="{img_hero}" alt="Hero Mockup">
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 01 &bull; EXECUTIVE SUMMARY</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 2: THE PROBLEM (THE VOCATIONAL GAP) -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">🚨 THE BURNING PROBLEM</div>
            <div class="slide-title">Jurang Pemisah Antara <span class="hl-pink">Pendidikan SLB</span> dan <span class="hl-cyan">Dunia Kerja Nyata</span></div>
            <div class="slide-desc">Masyarakat masih terjebak pada paradigma belas kasihan (charity model), sementara industri F&B kekurangan tenaga kerja yang teliti dan berkarakter kuat.</div>
        </div>

        <div class="grid-4" style="margin: 10px 0;">
            <div class="card card-pink">
                <div style="font-size: 22pt; margin-bottom: 6px;">🥀</div>
                <div class="card-title">Stigma Charity Trap</div>
                <div class="card-desc">Lulusan disabilitas sering hanya dianggap penerima donasi sosial, bukan pekerja terampil yang menghasilkan nilai komersial nyata.</div>
            </div>

            <div class="card card-cyan">
                <div style="font-size: 22pt; margin-bottom: 6px;">📉</div>
                <div class="card-title">Ketiadaan Standar Industri</div>
                <div class="card-desc">SLB mengajarkan keterampilan barista namun tanpa kurikulum standar industri (SOP mesin espresso, rasio kalibrasi seduh, dan sanitasi meja bar).</div>
            </div>

            <div class="card card-purple">
                <div style="font-size: 22pt; margin-bottom: 6px;">🤷‍♂️</div>
                <div class="card-title">Keraguan Mitra Industri</div>
                <div class="card-desc">Pemilik kafe ingin menjadi inklusif tapi takut operasional terganggu karena tidak memiliki data objektif terkait kesiapan kerja siswa.</div>
            </div>

            <div class="card card-green">
                <div style="font-size: 22pt; margin-bottom: 6px;">💔</div>
                <div class="card-title">Kecemasan Terbesar Orang Tua</div>
                <div class="card-desc">Orang tua terus dihantui rasa cemas tentang masa depan dan kemandirian sang buah hati ketika mereka kelak sudah tiada.</div>
            </div>
        </div>

        <div class="card" style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); display: flex; align-items: center; justify-content: space-between; padding: 10px 18px;">
            <div style="font-size: 8pt; color: #fca5a5; font-weight: 600;">
                <strong style="color: #ffffff;">Fakta Lapangan:</strong> Lebih dari 85% lulusan SLB di Indonesia tidak terserap ke sektor formal akibat tidak adanya jembatan teknologi dan data objektif.
            </div>
            <span style="font-size: 11pt; font-weight: 900; color: #ef4444;">85%+ UNEMPLOYED</span>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 02 &bull; PROBLEM STATEMENT</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 3: THE SOLUTION (THE 4-PILLAR ECOSYSTEM) -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">💡 THE COMPREHENSIVE SOLUTION</div>
            <div class="slide-title">Ekosistem 4 Pilar Terpadu: <span class="hl-cyan">Dari Kelas ke Meja Bar</span></div>
            <div class="slide-desc">BREWTECH bukan sekadar aplikasi belajar, melainkan ekosistem SaaS holistik yang menjahit seluruh rantai nilai vokasi inklusif nasional.</div>
        </div>

        <div class="grid-4" style="margin: 10px 0;">
            <div class="card card-cyan" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 8pt; font-weight: 800; color: #38bdf8;">PILAR 01</span>
                    <div class="card-title" style="margin-top: 4px;">Gamified LMS Vokasi</div>
                    <div class="card-desc">Materi visual mikro, video langkah brewing, dan kuis ramah disabilitas yang menghadiahi badges dan bintang prestasi.</div>
                </div>
                <div style="font-size: 6.5pt; font-weight: 700; color: #38bdf8; margin-top: 10px;">UNTUK SISWA &bull; NEURODIVERGENT</div>
            </div>

            <div class="card card-pink" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 8pt; font-weight: 800; color: #f472b6;">PILAR 02</span>
                    <div class="card-title" style="margin-top: 4px;">Engine SPK MCDM</div>
                    <div class="card-desc">Sistem Pendukung Keputusan ilmiah 3 algoritma (SAW, WP, TOPSIS) berbasis 6 kriteria kejuruan barista objektif.</div>
                </div>
                <div style="font-size: 6.5pt; font-weight: 700; color: #f472b6; margin-top: 10px;">UNTUK SEKOLAH &bull; MULTI-ALGORITMA</div>
            </div>

            <div class="card card-purple" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 8pt; font-weight: 800; color: #c084fc;">PILAR 03</span>
                    <div class="card-title" style="margin-top: 4px;">Kasir POS Kafe Mitra</div>
                    <div class="card-desc">Aplikasi Point-of-Sale layar sentuh untuk kasir kafe, mengaitkan tiap pesanan minuman langsung dengan jam terbang barista siswa.</div>
                </div>
                <div style="font-size: 6.5pt; font-weight: 700; color: #c084fc; margin-top: 10px;">UNTUK KAFE &bull; JAM TERBANG NYATA</div>
            </div>

            <div class="card card-green" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 8pt; font-weight: 800; color: #4ade80;">PILAR 04</span>
                    <div class="card-title" style="margin-top: 4px;">Portal Transparansi Ortu</div>
                    <div class="card-desc">Wali murid dapat memantau ketuntasan modul anak, evaluasi karakter harian dari guru pendamping, dan kesiapan kerja.</div>
                </div>
                <div style="font-size: 6.5pt; font-weight: 700; color: #4ade80; margin-top: 10px;">UNTUK ORANG TUA &bull; KETENANGAN JIWA</div>
            </div>
        </div>

        <div class="card" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 18px;">
            <div style="font-size: 8pt; color: #cbd5e1;">
                <strong>Keunggulan Desain:</strong> Semua aktor masuk melalui <em>Satu Pintu Portal Terpadu</em> dengan hak akses terproteksi dan terenkripsi.
            </div>
            <span class="slide-badge" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.4); color: #34d399;">WCAG 2.1 AA ACCESSIBLE</span>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 03 &bull; SOLUTION ARCHITECTURE</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 4: MOCKUP 1 - STUDENT GAMIFIED LMS -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">🎮 PRODUCT MOCKUP 01 &bull; LMS SISWA</div>
            <div class="slide-title">Gamifikasi Belajar: <span class="hl-cyan">Menumbuhkan Percaya Diri</span></div>
            <div class="slide-desc">Desain antarmuka visual yang disesuaikan khusus untuk siswa neurodivergen (Autisme, Rungu, Sensorik, dan Intelektual).</div>
        </div>

        <div class="grid-2">
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div class="card card-cyan">
                    <div class="card-title">Micro-Learning & Alur Visual</div>
                    <div class="card-desc">Kurikulum dipecah menjadi unit-unit kecil yang mudah dipahami: Pengenalan Mesin Espresso, Kalibrasi Grinder, Rasio Seduh, dan Sanitasi Bar.</div>
                </div>

                <div class="card card-purple">
                    <div class="card-title">Kuis Interaktif & Penguatan Positif</div>
                    <div class="card-desc">Evaluasi pemahaman tanpa stres: siswa memperoleh umpan balik langsung dengan indikator bintang, perolehan lencana, dan apresiasi positif.</div>
                </div>

                <div class="card card-pink">
                    <div class="card-title">Universal Accessibility Toolbar</div>
                    <div class="card-desc">Mendukung Text-to-Speech (pembaca suara), filter buta warna (Protanopia/Deuteranopia), font khusus OpenDyslexic, dan pembesar kursor.</div>
                </div>
            </div>

            <!-- Double Mockups: Laptop + Mobile -->
            <div class="laptop-mockup">
                <div class="laptop-header">
                    <div class="dot dot-red"></div>
                    <div class="dot dot-yellow"></div>
                    <div class="dot dot-green"></div>
                    <div class="url-bar">/student/dashboard &bull; Gamified Portal</div>
                </div>
                <div class="laptop-screen">
                    <img src="{img_student_dash}" alt="Student Dashboard">
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 04 &bull; STUDENT GAMIFIED EXPERIENCE</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 5: MOCKUP 2 - ADVANCED SPK MCDM DECISION ENGINE -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">⚖️ PRODUCT MOCKUP 02 &bull; DECISION ENGINE</div>
            <div class="slide-title">Engine SPK MCDM: <span class="hl-purple">Sains Objektif Pengganti Subjektivitas</span></div>
            <div class="slide-desc">Sistem Pendukung Keputusan Multi-Kriteria untuk mengeliminasi bias personal dalam menentukan kelayakan magang siswa ke kafe mitra.</div>
        </div>

        <div class="grid-2">
            <!-- Laptop Mockup SPK Reports -->
            <div class="laptop-mockup">
                <div class="laptop-header">
                    <div class="dot dot-red"></div>
                    <div class="dot dot-yellow"></div>
                    <div class="dot dot-green"></div>
                    <div class="url-bar">/school/reports?method=topsis &bull; Scientific Engine</div>
                </div>
                <div class="laptop-screen">
                    <img src="{img_reports}" alt="SPK Reports">
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div class="card card-purple">
                    <div class="card-title">3 Algoritma Ilmiah Siap Pakai</div>
                    <div class="card-desc">Admin sekolah dapat berpindah metode secara instan: <strong>SAW</strong> (Linear Additive), <strong>WP</strong> (Multiplicative Power), atau <strong>TOPSIS</strong> (Ideal Solution Closeness).</div>
                </div>

                <div class="card card-cyan">
                    <div class="card-title">Standar 6 Kriteria Kejuruan (C1 - C6)</div>
                    <div class="card-desc">C1 Teknis Seduh (30%), C2 Kedisiplinan (15%), C3 Higienitas Bar (20%), C4 Kerja Sama Tim (15%), C5 Komunikasi Tamu (10%), C6 Inisiatif (10%).</div>
                </div>

                <div class="card card-pink">
                    <div class="card-title">Drawer Transparansi Matriks Ilmiah</div>
                    <div class="card-desc">Tombol <em>"MATRIKS ILMIAH"</em> menampilkan Matriks X asal, Normalisasi R, Matriks Terbobot Y, Solusi Ideal A+/A-, dan Vektor S/V untuk akuntabilitas akademik.</div>
                </div>

                <div class="card card-green">
                    <div class="card-title">Ekspor Rapor Formal (Excel & DomPDF)</div>
                    <div class="card-desc">Menerbitkan dokumen berkas resmi hasil komputasi SPK bersertifikasi lengkap dengan kop sekolah untuk kebutuhan akreditasi dinas.</div>
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 05 &bull; SPK DECISION SUPPORT SYSTEM</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 6: MOCKUP 3 - COMMERCIAL CAFE POS CASHIER -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">☕ PRODUCT MOCKUP 03 &bull; COMMERCIAL POS</div>
            <div class="slide-title">Hilirisasi Nyata: <span class="hl-pink">Kasir POS Layar Sentuh Kafe Mitra</span></div>
            <div class="slide-desc">Menghubungkan pelatihan sekolah langsung ke transaksi komersial industri — setiap pesanan merekam kontribusi nyata barista siswa.</div>
        </div>

        <div class="grid-2">
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <div class="card card-pink">
                    <div class="card-title">Antarmuka Layar Sentuh Kasir Cepat</div>
                    <div class="card-desc">Didesain intuitif untuk operasional kasir kafe: kategori minuman (Coffee, Non-Coffee, Pastry), perhitungan diskon, split-payment, dan cetak struk thermal.</div>
                </div>

                <div class="card card-cyan">
                    <div class="card-title">Penetapan Barista Siswa per Transaksi</div>
                    <div class="card-desc">Sebelum pesanan diproses, kasir memilih siswa magang yang bertugas meracik minuman tersebut, mengonversinya menjadi jam terbang resmi.</div>
                </div>

                <div class="card card-purple">
                    <div class="card-title">Inventori & Harga Pokok Penjualan (HPP)</div>
                    <div class="card-desc">Manajemen stok bahan baku minuman dan pencatatan COGS otomatis pada setiap cangkir kopi yang terjual.</div>
                </div>
            </div>

            <!-- Tablet Mockup for POS -->
            <div class="tablet-mockup">
                <div class="tablet-screen">
                    <img src="{img_pos}" alt="POS Cashier">
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 06 &bull; INTEGRATED COMMERCIAL POS</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 7: MOCKUP 4 - MULTI-ROLE ECOSYSTEM & ACCESSIBILITY -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">🌐 PRODUCT MOCKUP 04 &bull; MULTI-ROLE</div>
            <div class="slide-title">Tata Kelola Nasional: <span class="hl-green">Superadmin, Guru & Orang Tua</span></div>
            <div class="slide-desc">Transparansi menyeluruh untuk seluruh pemangku kepentingan dalam satu ekosistem digital nasional.</div>
        </div>

        <div class="grid-3" style="margin: 8px 0;">
            <div class="card" style="padding: 10px;">
                <div style="font-size: 7.5pt; font-weight: 800; color: #a855f7; margin-bottom: 4px;">ORANG TUA / WALI MURID</div>
                <div class="card-title">Dashboard Ketenangan Jiwa</div>
                <div class="card-desc" style="margin-bottom: 8px;">Orang tua melihat catatan apresiasi guru, progres modul kopi anak, dan skor kesiapan kerja.</div>
                <div style="border-radius: 8px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <img src="{img_parent}" alt="Parent" style="width: 100%; display: block;">
                </div>
            </div>

            <div class="card" style="padding: 10px;">
                <div style="font-size: 7.5pt; font-weight: 800; color: #0ea5e9; margin-bottom: 4px;">GURU PENDAMPING SLB</div>
                <div class="card-title">Rubrik Karakter Harian</div>
                <div class="card-desc" style="margin-bottom: 8px;">Observasi harian terhadap 5 pilar soft skills: disiplin, higienitas bar, tim, komunikasi, dan inisiatif.</div>
                <div style="border-radius: 8px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <img src="{img_instructor_eval}" alt="Instructor" style="width: 100%; display: block;">
                </div>
            </div>

            <div class="card" style="padding: 10px;">
                <div style="font-size: 7.5pt; font-weight: 800; color: #ec4899; margin-bottom: 4px;">SUPERADMIN NASIONAL</div>
                <div class="card-title">Pusat Agregat & Audit Trail</div>
                <div class="card-desc" style="margin-bottom: 8px;">Master kurikulum modul, CMS banner landing page, dan perekaman jejak log aktivitas (audit trail).</div>
                <div style="border-radius: 8px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <img src="{img_logs}" alt="Audit Logs" style="width: 100%; display: block;">
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 07 &bull; MULTI-ROLE GOVERNANCE</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 8: BUSINESS MODEL & UNIT ECONOMICS -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">💰 BUSINESS MODEL & MONETIZATION</div>
            <div class="slide-title">Skema Pendapatan: <span class="hl-cyan">B2B SaaS & Transaksional</span></div>
            <div class="slide-desc">Model monetisasi berkelanjutan yang menyelaraskan misi sosial dengan profitabilitas bisnis perangkat lunak.</div>
        </div>

        <div class="grid-3" style="margin: 10px 0;">
            <div class="card card-cyan" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 8pt; font-weight: 800; color: #38bdf8;">STREAM 01</span>
                    <div class="card-title" style="font-size: 12pt; margin: 6px 0;">SLB School Subscription</div>
                    <div style="font-size: 18pt; font-weight: 900; color: #ffffff; margin-bottom: 8px;">Rp 1.5 - 3.5 Jt <span style="font-size: 8pt; color: #94a3b8; font-weight: normal;">/ Sekolah / Bulan</span></div>
                    <div class="card-desc">Akses tak terbatas ke LMS Vokasi, Master Builder Modul, Engine SPK Multi-Algoritma, Portal Guru & Akun Siswa Tanpa Batas.</div>
                </div>
                <div style="font-size: 6.5pt; color: #38bdf8; font-weight: 700; margin-top: 12px;">DIBIAYAI VIA DANA BOS VOKASI / PEMDA</div>
            </div>

            <div class="card card-pink" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 8pt; font-weight: 800; color: #f472b6;">STREAM 02</span>
                    <div class="card-title" style="font-size: 12pt; margin: 6px 0;">Cafe POS & Talent Matching</div>
                    <div style="font-size: 18pt; font-weight: 900; color: #ffffff; margin-bottom: 8px;">Rp 250 - 500 Rb <span style="font-size: 8pt; color: #94a3b8; font-weight: normal;">/ Outlet / Bulan</span></div>
                    <div class="card-desc">Sistem Kasir POS Terpadu, Sertifikat Pajak Inklusi Kemenkeu, Pelacakan Jam Terbang Barista, dan Akses Bursa Talenta Siap Magang.</div>
                </div>
                <div style="font-size: 6.5pt; color: #f472b6; font-weight: 700; margin-top: 12px;">DIPASANG DI RATUSAN OUTLET KAFE</div>
            </div>

            <div class="card card-purple" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <span style="font-size: 8pt; font-weight: 800; color: #c084fc;">STREAM 03</span>
                    <div class="card-title" style="font-size: 12pt; margin: 6px 0;">Corporate CSR & ESG Grants</div>
                    <div style="font-size: 18pt; font-weight: 900; color: #ffffff; margin-bottom: 8px;">Kemitraan Hibah <span style="font-size: 8pt; color: #94a3b8; font-weight: normal;">/ Program Tahunan</span></div>
                    <div class="card-desc">Program kemitraan strategis dengan perusahaan perbankan, BUMN, dan FMCG untuk penyediaan beasiswa laboratorium vokasi barista.</div>
                </div>
                <div style="font-size: 6.5pt; color: #c084fc; font-weight: 700; margin-top: 12px;">DAMPAK SOSIAL TERVERIFIKASI ESG</div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 08 &bull; REVENUE ARCHITECTURE</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 9: MARKET SIZE (TAM, SAM, SOM) -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">📊 MARKET OPPORTUNITY</div>
            <div class="slide-title">Potensi Pasar: <span class="hl-cyan">Skalabilitas Nasional & Regional</span></div>
            <div class="slide-desc">Peluang besar di persimpangan antara transformasi digital pendidikan khusus dan ekspansi industri kopi komersial.</div>
        </div>

        <div class="grid-3" style="margin: 10px 0;">
            <div class="card" style="text-align: center; padding: 20px 14px;">
                <div style="font-size: 8pt; font-weight: 800; color: #64748b; letter-spacing: 1px;">TOTAL ADDRESSABLE MARKET (TAM)</div>
                <div class="stat-number hl-cyan" style="font-size: 32pt; margin: 8px 0;">$180M</div>
                <div style="font-weight: 800; font-size: 10pt; color: #ffffff;">2,350+ SLB & 40,000+ Kafe di Indonesia</div>
                <p class="card-desc" style="margin-top: 6px;">Total ekosistem pendidikan khusus dan industri F&B kedai kopi komersial nasional.</p>
            </div>

            <div class="card" style="text-align: center; padding: 20px 14px; border: 1px solid rgba(14, 165, 233, 0.4); background: rgba(14, 165, 233, 0.08);">
                <div style="font-size: 8pt; font-weight: 800; color: #38bdf8; letter-spacing: 1px;">SERVICEABLE ADDRESSABLE (SAM)</div>
                <div class="stat-number hl-cyan" style="font-size: 32pt; margin: 8px 0;">$48M</div>
                <div style="font-weight: 800; font-size: 10pt; color: #ffffff;">750 SLB Vokasi & 12,000 Kafe Kota Besar</div>
                <p class="card-desc" style="margin-top: 6px;">SLB yang telah memiliki program kejuruan mandiri dan kafe mitra di Jabodetabek, Jatim, Jateng, Jabar, & Bali.</p>
            </div>

            <div class="card" style="text-align: center; padding: 20px 14px;">
                <div style="font-size: 8pt; font-weight: 800; color: #ec4899; letter-spacing: 1px;">SERVICEABLE OBTAINABLE (SOM - 3 YRS)</div>
                <div class="stat-number hl-pink" style="font-size: 32pt; margin: 8px 0;">$8.2M</div>
                <div style="font-weight: 800; font-size: 10pt; color: #ffffff;">150 Sekolah SLB & 600 Kafe Mitra</div>
                <p class="card-desc" style="margin-top: 6px;">Target penetrasi 3 tahun pertama dengan retensi tinggi dan kemitraan dinas pendidikan provinsi.</p>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 09 &bull; MARKET SIZING</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 10: TRACTION & PROVEN VALIDATION -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">🚀 TRACTION & VALIDATION</div>
            <div class="slide-title">Bukti Nyata: <span class="hl-cyan">Sistem Aktif Berjalan di Produksi</span></div>
            <div class="slide-desc">Bukan sekadar konsep prototipe — BREWTECH telah beroperasi langsung di cloud publik dengan data dan aktor nyata.</div>
        </div>

        <div class="grid-2" style="margin: 8px 0;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div class="card card-cyan" style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div class="card-title">65 Siswa Binaan Aktif</div>
                        <div class="card-desc">Telah terdaftar dengan data portofolio vokasi dan rekam jejak evaluasi lengkap.</div>
                    </div>
                    <span class="stat-number hl-cyan" style="font-size: 24pt;">65</span>
                </div>

                <div class="card card-pink" style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div class="card-title">11 SLB Percontohan Nasional</div>
                        <div class="card-desc">SLB YPAC Kota Malang dan jejaring sekolah binaan lintas regional.</div>
                    </div>
                    <span class="stat-number hl-pink" style="font-size: 24pt;">11</span>
                </div>

                <div class="card card-purple" style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div class="card-title">11 Mitra Industri Kafe</div>
                        <div class="card-desc">Kafe Among Rasa Malang dan kafe mitra komersial di 10 regional kota besar.</div>
                    </div>
                    <span class="stat-number hl-purple" style="font-size: 24pt;">11</span>
                </div>

                <div class="card card-green" style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div class="card-title">100% Serverless Cloud Live</div>
                        <div class="card-desc">Vercel Edge Computing + Supabase PostgreSQL di AWS eu-west-2.</div>
                    </div>
                    <span style="font-size: 9pt; font-weight: 900; color: #10b981;">99.9% SLA</span>
                </div>
            </div>

            <div class="laptop-mockup">
                <div class="laptop-header">
                    <div class="dot dot-red"></div>
                    <div class="dot dot-yellow"></div>
                    <div class="dot dot-green"></div>
                    <div class="url-bar">https://brewtech-v2.vercel.app &bull; Talent Pool</div>
                </div>
                <div class="laptop-screen">
                    <img src="{img_talents}" alt="Traction Talents">
                </div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 10 &bull; LIVE TRACTION PROOF</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 11: COMPETITIVE MOAT (WHY WE WIN) -->
    <!-- ============================================================= -->
    <section class="slide">
        <div>
            <div class="slide-badge">🛡️ COMPETITIVE MOAT</div>
            <div class="slide-title">Mengapa BREWTECH <span class="hl-cyan">Tidak Tertandingi</span></div>
            <div class="slide-desc">Kombinasi unik antara hilirisasi industri komersial riil dan ketelitian sains matematika keputusan.</div>
        </div>

        <div class="grid-4" style="margin: 10px 0;">
            <div class="card card-cyan">
                <div style="font-size: 20pt; margin-bottom: 4px;">🔗</div>
                <div class="card-title">End-to-End Hilirisasi</div>
                <div class="card-desc">LMS konvensional berhenti di rapor nilai. BREWTECH menghubungkannya langsung ke mesin kasir POS kafe nyata.</div>
            </div>

            <div class="card card-pink">
                <div style="font-size: 20pt; margin-bottom: 4px;">📐</div>
                <div class="card-title">MCDM Scientific Engine</div>
                <div class="card-desc">Bukan sekadar rata-rata nilai, melainkan model matematis formal (SAW, WP, TOPSIS) yang dapat dipertanggungjawabkan ke industri.</div>
            </div>

            <div class="card card-purple">
                <div style="font-size: 20pt; margin-bottom: 4px;">♿</div>
                <div class="card-title">Neurodivergent UX</div>
                <div class="card-desc">Dibangun dari nol dengan standar aksesibilitas inklusif (Text-to-Speech, font disleksia, filter warna) agar ramah semua ragam disabilitas.</div>
            </div>

            <div class="card card-green">
                <div style="font-size: 20pt; margin-bottom: 4px;">🤝</div>
                <div class="card-title">Ekosistem 4 Aktor</div>
                <div class="card-desc">Satu-satunya platform yang mempertemukan Siswa, Guru SLB, Pemilik Kafe, dan Orang Tua dalam satu pintu terintegrasi.</div>
            </div>
        </div>

        <div class="slide-footer">
            <span>BREWTECH &bull; INCLUSIVE VOCATION SAAS</span>
            <span>SLIDE 11 &bull; COMPETITIVE ADVANTAGE</span>
        </div>
    </section>

    <!-- ============================================================= -->
    <!-- SLIDE 12: THE ASK & CLOSING CALL TO ACTION -->
    <!-- ============================================================= -->
    <section class="slide" style="background: radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(9, 13, 22, 1) 75%); text-align: center; justify-content: center;">
        <div style="max-width: 800px; margin: 0 auto;">
            <div class="slide-badge" style="margin-bottom: 14px;">🌟 JOIN OUR JOURNEY</div>
            <h2 style="font-size: 34pt; font-weight: 900; line-height: 1.1; margin: 0 0 14px 0; color: #ffffff;">
                Mari Bersama Merajut Martabat,<br><span class="hl-cyan">Dari Secangkir Kopi Menuju Karier Mandiri</span>
            </h2>
            <p style="font-size: 11pt; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                Kami membuka peluang kemitraan strategis, pendanaan ekspansi, dan kolaborasi industri kafe untuk menjangkau 500 sekolah SLB di seluruh nusantara.
            </p>

            <div style="display: inline-flex; gap: 16px; margin-bottom: 24px;">
                <div class="card" style="padding: 12px 24px; text-align: left;">
                    <div style="font-size: 7pt; color: #94a3b8; font-weight: 800; text-transform: uppercase;">LIVE DEMO PORTAL</div>
                    <div style="font-size: 11pt; font-weight: 800; color: #38bdf8;">brewtech-v2.vercel.app</div>
                </div>

                <div class="card" style="padding: 12px 24px; text-align: left;">
                    <div style="font-size: 7pt; color: #94a3b8; font-weight: 800; text-transform: uppercase;">OFFICIAL GITHUB</div>
                    <div style="font-size: 11pt; font-weight: 800; color: #ffffff;">github.com/roqueforti/brewtech-v2</div>
                </div>
            </div>

            <div style="font-size: 8pt; color: #64748b; font-weight: 600;">
                BREWTECH &bull; INCLUSIVE VOCATIONAL EDUCATION & COMMERCIAL ECOSYSTEM &bull; 2026
            </div>
        </div>
    </section>

</body>
</html>
"""

    with open(HTML_OUT, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"[1] HTML Pitch Deck generated: {HTML_OUT}")

    # Generate PDF with exact 16:9 widescreen presentation proportion
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--window-size=1920,1080')

    driver = webdriver.Chrome(options=options)
    try:
        print("[2] Opening HTML in headless Chrome...")
        driver.get(f"file:///{HTML_OUT.replace(os.sep, '/')}")
        time.sleep(3)
        try:
            driver.execute_script("return document.fonts.ready")
        except Exception:
            pass
        time.sleep(1)

        print("[3] Printing 16:9 Widescreen Pitch Deck to PDF via CDP...")
        pdf_data = driver.execute_cdp_cmd('Page.printToPDF', {
            'printBackground': True,
            'preferCSSPageSize': True,
            'marginTop': 0, 'marginBottom': 0, 'marginLeft': 0, 'marginRight': 0,
        })

        with open(PDF_OUT, "wb") as f:
            f.write(base64.b64decode(pdf_data['data']))

        print(f"[4] SUCCESS! Pitch Deck PDF generated: {PDF_OUT}")
    finally:
        driver.quit()

def create_markdown_deck():
    md = """# BREWTECH PITCH DECK (16:9 Widescreen Presentation)
> **Empowering Inclusive Vocational Education & Commercial Coffee Ecosystem**
> *Live System URL: [https://brewtech-v2.vercel.app](https://brewtech-v2.vercel.app)*

---

## Slide 1: Cover (The Executive Hook)
- **Title:** BREWTECH — Inclusive Vocation Platform
- **Tagline:** Memberdayakan talenta penyandang disabilitas dari ruang kelas vokasi SLB, diuji dengan sains keputusan (SPK MCDM), hingga terserap mandiri di mesin kasir POS kafe komersial.
- **Traction Snapshot:** 65 Siswa Binaan • 11 SLB Percontohan • 11 Mitra Industri Kafe
- **Mockup:** Laptop Frame menampilkan Landing Page Hero & Realtime National Counter.

---

## Slide 2: The Burning Problem
- **Charity Trap:** Lulusan disabilitas hanya dianggap penerima donasi sosial, bukan pekerja terampil yang menghasilkan nilai komersial nyata.
- **Ketiadaan Standar Industri:** SLB mengajarkan keterampilan barista namun tanpa kurikulum standar industri (SOP mesin espresso, rasio kalibrasi, sanitasi bar).
- **Keraguan Mitra Kafe:** Pemilik kafe ingin inklusif tapi takut operasional terganggu karena tidak memiliki data objektif terkait kesiapan kerja siswa.
- **Kecemasan Orang Tua:** Orang tua dihantui rasa cemas tentang masa depan sang anak saat mereka kelak sudah tiada.
- **Fakta:** >85% lulusan SLB di Indonesia menganggur setelah sekolah.

---

## Slide 3: The 4-Pillar Integrated Solution
```mermaid
flowchart LR
    A["🎓 Gamified LMS<br/>(Siswa Neurodivergen)"] --> B["⚖️ SPK MCDM Engine<br/>(SAW, WP, TOPSIS)"]
    B --> C["☕ Kasir POS Kafe<br/>(Jam Terbang Riil)"]
    C --> D["👨‍👩‍👧 Portal Orang Tua<br/>(Ketenangan Jiwa)"]
```
1. **Gamified LMS:** Micro-learning visual, video brewing, dan kuis ramah disabilitas berhadiah badges & bintang.
2. **Engine SPK MCDM:** Sistem pendukung keputusan ilmiah 3 algoritma berbasis 6 kriteria kejuruan (C1-C6).
3. **Kasir POS Kafe Mitra:** Aplikasi POS layar sentuh yang merekam nama siswa barista per cangkir pesanan.
4. **Portal Orang Tua:** Pemantauan langsung riwayat modul, evaluasi karakter guru, dan portofolio anak.

---

## Slide 4: Product Deep-Dive 1 — Student Gamified LMS
- **Desain Khusus:** Micro-learning visual untuk siswa Autisme, Rungu, Sensorik, dan Intelektual.
- **Accessibility Toolbar:** Text-to-Speech (TTS), filter buta warna (Protanopia/Deuteranopia), font OpenDyslexic, kontras tinggi.
- **Kuis & Simulasi:** Latihan interaktif takaran espresso dan rasio pour-over tanpa kecemasan kognitif.
- **Mockup:** Laptop & Mobile screen menampilkan Dashboard Siswa & Pratinjau Kuis Modul.

---

## Slide 5: Product Deep-Dive 2 — Scientific MCDM Decision Engine
- **3 Algoritma Ilmiah:** Simple Additive Weighting (SAW), Weighted Product (WP), dan TOPSIS (Ideal Solution Closeness).
- **6 Kriteria Kejuruan:** C1 Teknis Seduh (30%), C2 Disiplin (15%), C3 Higienitas Bar (20%), C4 Tim (15%), C5 Komunikasi (10%), C6 Inisiatif (10%).
- **Transparansi Matriks:** Tombol *"MATRIKS ILMIAH"* menampilkan Matriks X asal, Normalisasi R, Matriks Terbobot Y, Solusi Ideal A+/A-, dan Vektor S/V.
- **Mockup:** Widescreen laptop mockup menampilkan Laporan SPK dan Tab Switcher Algoritma.

---

## Slide 6: Product Deep-Dive 3 — Commercial Cafe POS Cashier
- **Layar Sentuh Kasir:** Pemrosesan pesanan cepat (Espresso, Latte, Matchabiyu), kalkulasi diskon, split-bill, dan cetak struk thermal.
- **Assignment Siswa:** Kasir menetapkan barista siswa magang yang meracik pesanan &rarr; rekam jam terbang nyata.
- **HPP & Stok:** Manajemen stok bahan baku dan perhitungan harga pokok penjualan otomatis.
- **Mockup:** Tablet / iPad POS mockup menampilkan antarmuka kasir layar sentuh.

---

## Slide 7: Product Deep-Dive 4 — Multi-Role Ecosystem & Governance
- **Orang Tua:** Catatan apresiasi guru, histori modul kopi, dan rasa bangga atas kemandirian anak.
- **Instruktur:** Form observasi harian rubrik 5 pilar soft skills di laboratorium vokasi.
- **Superadmin:** Master kurikulum nasional, CMS banner landing page, dan audit activity logs.

---

## Slide 8: Business Model & Monetization
1. **SLB School Subscription:** Rp 1.5 - 3.5 Jt / sekolah / bulan (LMS Vokasi, SPK Engine, Portal Guru & Siswa tak terbatas).
2. **Cafe POS & Talent Matching:** Rp 250 - 500 Rb / outlet / bulan (Kasir POS, sertifikat pajak inklusi, akses bursa talenta).
3. **Corporate CSR & ESG Grants:** Program beasiswa laboratorium barista dari korporasi perbankan/BUMN dengan metrik ESG terukur.

---

## Slide 9: Market Opportunity (TAM, SAM, SOM)
- **TAM ($180M):** 2,350+ SLB & 40,000+ kedai kopi di seluruh Indonesia.
- **SAM ($48M):** 750 SLB Vokasi mandiri & 12,000 kafe di kota-kota besar (Jabodetabek, Jatim, Jateng, Jabar, Bali).
- **SOM ($8.2M - 3 Years):** Penetrasi 150 SLB & 600 kafe mitra dalam 3 tahun pertama.

---

## Slide 10: Current Traction & Live Validation
- **65 Siswa Binaan Aktif** dengan portofolio kejuruan terverifikasi.
- **11 SLB Percontohan Nasional** (SLB YPAC Kota Malang, dll).
- **11 Kafe Mitra Industri** di 10 regional kota besar (Among Rasa, dll).
- **100% Serverless Cloud Live** di Vercel + Supabase PostgreSQL (AWS eu-west-2).

---

## Slide 11: Competitive Moat (Why Brewtech Wins)
1. **End-to-End Hilirisasi:** Tidak berhenti di nilai sekolah, tapi terhubung langsung ke mesin kasir POS kafe nyata.
2. **Proprietary MCDM Engine:** Menggunakan matematika keputusan teruji (SAW, WP, TOPSIS), bukan rumus arbitrer.
3. **Neurodivergent Accessibility:** Dibangun dari nol ramah pembaca layar, ramah disleksia, dan ramah buta warna.
4. **4-Actor Unity:** Satu-satunya ekosistem yang menyatukan Siswa, Guru, Industri Kafe, dan Orang Tua.

---

## Slide 12: The Vision & Closing Call to Action
> *"Mari bersama merajut martabat, dari secangkir kopi menuju karier mandiri."*
- **Live Demo:** [https://brewtech-v2.vercel.app](https://brewtech-v2.vercel.app)
- **GitHub:** [github.com/roqueforti/brewtech-v2](https://github.com/roqueforti/brewtech-v2)
"""
    with open(MD_OUT, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"[OK] Pitch Deck Markdown saved: {MD_OUT}")

if __name__ == "__main__":
    create_pitch_deck()
    create_markdown_deck()
