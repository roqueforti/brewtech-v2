# -*- coding: utf-8 -*-
"""
Generate publication-quality PDF documents using Selenium Headless Chrome CDP.
Generates:
1. BREWTECH_Case_Study_Public_Narrative.pdf
"""

import os
import base64
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

SCREENSHOTS_DIR = r"d:\PAL\brewtech\doc_screenshots"
PDF_OUT = r"d:\PAL\brewtech\BREWTECH_Case_Study_Public_Narrative.pdf"

def get_base64_image(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "rb") as f:
            data = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{data}"
    return ""

def generate_public_narrative_pdf():
    # Load all base64 images
    img_landing_hero = get_base64_image("01_landing_hero.png")
    img_talents = get_base64_image("02_landing_talents.png")
    img_gallery = get_base64_image("03_landing_gallery.png")
    img_student_dash = get_base64_image("21_student_dashboard.png")
    img_quiz = get_base64_image("08b_module_preview_quiz.png")
    img_instructor_dash = get_base64_image("19_instructor_dashboard.png")
    img_instructor_eval = get_base64_image("20_instructor_classes.png")
    img_reports = get_base64_image("14_school_reports.png")
    img_spk_settings = get_base64_image("15_school_spk.png")
    img_cafe_dash = get_base64_image("16_cafe_dashboard.png")
    img_pos = get_base64_image("17_cafe_pos.png")
    img_products = get_base64_image("18_cafe_products.png")
    img_parent_dash = get_base64_image("22_parent_dashboard.png")
    img_superadmin_dash = get_base64_image("05_superadmin_dashboard.png")
    img_logs = get_base64_image("10_superadmin_logs.png")

    html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>BREWTECH - Public Narrative Product Case Study</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap');
    @page {{
        size: A4;
        margin: 18mm 20mm;
    }}
    body {{
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 9pt;
        line-height: 1.6;
        color: #334155;
        background: #ffffff;
        margin: 0;
        padding: 0;
    }}
    .tagline-pill {{
        display: inline-block;
        padding: 4px 12px;
        background: #e0f2fe;
        color: #0284c7;
        font-size: 7.5pt;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        border-radius: 20px;
        margin-bottom: 8px;
    }}
    h1.doc-title {{
        font-size: 24pt;
        font-weight: 900;
        color: #0f172a;
        line-height: 1.15;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
    }}
    .doc-subtitle {{
        font-size: 11pt;
        color: #64748b;
        font-weight: 500;
        line-height: 1.4;
        margin-bottom: 16px;
    }}
    .quote-box {{
        background: #f8fafc;
        border-left: 4px solid #0ea5e9;
        border-radius: 0 8px 8px 0;
        padding: 12px 18px;
        margin: 14px 0;
        font-style: italic;
        color: #0f172a;
        font-weight: 600;
        page-break-inside: avoid;
    }}
    .quote-author {{
        display: block;
        font-size: 8pt;
        color: #64748b;
        font-weight: normal;
        margin-top: 4px;
        font-style: normal;
    }}
    .meta-table {{
        width: 100%;
        border-collapse: collapse;
        margin: 14px 0 20px 0;
        font-size: 8.5pt;
        page-break-inside: avoid;
    }}
    .meta-table td {{
        padding: 6px 12px;
        border: 1px solid #e2e8f0;
    }}
    .meta-table td.lbl {{
        background: #f1f5f9;
        font-weight: 700;
        color: #0f172a;
        width: 26%;
    }}
    .meta-table td.val {{
        background: #ffffff;
        color: #334155;
    }}
    .meta-table td.val a {{
        color: #0ea5e9;
        text-decoration: none;
        font-weight: bold;
    }}
    h2.section-header {{
        font-size: 14pt;
        font-weight: 800;
        color: #0f172a;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 4px;
        margin-top: 24px;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        page-break-after: avoid;
    }}
    h3.sub-header {{
        font-size: 11pt;
        font-weight: 700;
        color: #7c3aed;
        margin-top: 16px;
        margin-bottom: 6px;
        page-break-after: avoid;
    }}
    p {{
        margin: 0 0 8px 0;
        text-align: justify;
    }}
    ul {{
        margin: 0 0 10px 0;
        padding-left: 20px;
    }}
    li {{
        margin-bottom: 4px;
        text-align: justify;
    }}
    .figure-box {{
        text-align: center;
        margin: 14px 0;
        page-break-inside: avoid;
    }}
    .figure-box img {{
        max-width: 98%;
        height: auto;
        border-radius: 8px;
        border: 1px solid #cbd5e1;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    }}
    .figure-caption {{
        font-size: 7.5pt;
        color: #64748b;
        font-style: italic;
        margin-top: 4px;
    }}
    .callout {{
        background: #fdf4ff;
        border: 1px solid #f0abfc;
        border-radius: 8px;
        padding: 10px 14px;
        margin: 12px 0;
        page-break-inside: avoid;
    }}
    .callout-title {{
        font-weight: 800;
        font-size: 9pt;
        color: #a21caf;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }}
    .callout-body {{
        font-size: 8.5pt;
        color: #475569;
        line-height: 1.45;
    }}
    .footer-note {{
        margin-top: 28px;
        padding-top: 10px;
        border-top: 1px solid #e2e8f0;
        font-size: 7.5pt;
        color: #94a3b8;
        text-align: center;
        page-break-inside: avoid;
    }}
    .page-break {{
        page-break-after: always;
    }}
</style>
</head>
<body>

    <!-- ========================================== -->
    <!-- HALAMAN 1: COVER PAGE RESMI EKSEKUTIF -->
    <!-- ========================================== -->
    <div style="text-align: center; padding-top: 15px; page-break-after: always;">
        <div class="tagline-pill" style="margin-bottom: 14px;">PUBLIC NARRATIVE PRODUCT CASE STUDY &bull; INCLUSIVE TECH &bull; FULL STACK SAAS</div>
        
        <h1 class="doc-title" style="font-size: 26pt; margin-bottom: 6px;">BREWTECH</h1>
        <div style="font-size: 15pt; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">INCLUSIVE VOCATION PLATFORM</div>
        <div class="doc-subtitle" style="font-size: 11pt; max-width: 90%; margin: 0 auto 16px auto;">Menjembatani Secangkir Kopi, Talenta Istimewa, dan Martabat Vokasi Disabilitas Melalui Rekayasa Perangkat Lunak dan Matematika Keputusan</div>

        <div style="margin: 16px 0;">
            <img src="{img_landing_hero}" alt="Brewtech Landing Hero" style="max-width: 94%; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
        </div>

        <table class="meta-table" style="margin-top: 16px; font-size: 8.5pt;">
            <tr>
                <td class="lbl" style="width: 28%;">Jenis Dokumen</td>
                <td class="val"><strong>Laporan Studi Kasus Produk & Portofolio Rekayasa Sistem</strong></td>
            </tr>
            <tr>
                <td class="lbl">Peran Pengembang</td>
                <td class="val"><strong>Lead Full-Stack Engineer, Decision Systems Architect & Inclusive UX Designer</strong></td>
            </tr>
            <tr>
                <td class="lbl">Teknologi Inti</td>
                <td class="val">Laravel 10 Serverless, React 18, Inertia.js, Supabase PostgreSQL, Recharts, MCDM Engine</td>
            </tr>
            <tr>
                <td class="lbl">Skala & Dampak</td>
                <td class="val"><strong>65 Siswa Binaan, 11 SLB Percontohan, 11 Mitra Industri Kafe di 10 Kota Besar</strong></td>
            </tr>
            <tr>
                <td class="lbl">Alamat Produksi</td>
                <td class="val"><a href="https://brewtech-v2.vercel.app">https://brewtech-v2.vercel.app</a> (Live Remote Cloud Deployment)</td>
            </tr>
            <tr>
                <td class="lbl">Edisi & Tanggal</td>
                <td class="val">November 2026 &bull; Edisi Portofolio Resmi</td>
            </tr>
        </table>
    </div>

    <!-- ========================================== -->
    <!-- HALAMAN 2: EXECUTIVE SUMMARY & STORY -->
    <!-- ========================================== -->
    <div class="quote-box" style="margin-top: 10px;">
        "Kemandirian seorang individu tidak lahir dari belas kasihan masyarakat, melainkan dari panggung kesempatan yang setara untuk membuktikan nilai karya mereka."
        <span class="quote-author">— Refleksi Perancangan Sistem Brewtech</span>
    </div>

    <h2 class="section-header">I. The Story of Self: Panggilan di Balik Aroma Biji Kopi</h2>
    <p>
        Pernahkah Anda memperhatikan apa yang terjadi ketika seorang anak dengan autisme atau disabilitas sensorik menyelesaikan masa sekolahnya di Sekolah Luar Biasa (SLB)? Di ruang kelas, mereka dihargai dan dilindungi. Namun begitu melangkah melewati gerbang kelulusan, mereka kerap berhadapan dengan tembok keheningan: dunia industri yang bingung bagaimana mempekerjakan mereka, dan masyarakat yang masih memandang mereka melalui kacamata belas kasihan (<em>charity model</em>), bukan kacamata kapasitas dan kapabilitas.
    </p>
    <p>
        Kisah ini bermula dari perjumpaan saya dengan salah satu laboratorium kejuruan vokasi di Jawa Timur. Di sana, seorang siswa rungu bernama Arlando sedang menyeduh kopi manual (<em>pour-over</em> V60). Tangannya mantap menimbang air dengan rasio 1:15, matanya sangat jeli memperhatikan waktu <em>blooming</em>, dan perhatiannya terhadap kebersihan meja bar begitu presisi—jauh lebih teliti daripada kebanyakan orang biasa. Namun, sang guru pendamping bercerita dengan nada getir: <em>"Pak, anak-anak kami punya tangan emas dan ketekunan luar biasa. Tapi kami bingung, ke kafe mana mereka bisa magang? Bagaimana cara meyakinkan pemilik kafe bahwa anak ini siap kerja?"</em>
    </p>
    <p>
        Momen itulah yang mengubah cara pandang saya sebagai seorang <em>software engineer</em>. Selama ini, industri teknologi sering kali menghabiskan jutaan jam komputasi untuk mengoptimalkan klik iklan atau membuat algoritma yang memicu adiksi media sosial. <strong>Mengapa kita tidak menggunakan keahlian rekayasa sistem yang sama untuk membangun jembatan peradaban yang memartabatkan manusia?</strong>
    </p>
    <p>
        Dari kegelisahan itulah, <strong>BREWTECH</strong> lahir. Tekad saya bulat: membangun platform SaaS terpadu yang bukan hanya mencatat nilai sekolah, melainkan sebuah ekosistem holistik yang menghubungkan pelatihan berbasis gamifikasi, algoritma pengambilan keputusan saintifik (SPK), mesin kasir komersial (POS), hingga transparansi penuh bagi orang tua.
    </p>

    <h2 class="section-header">II. The Story of Us: Menjahit Harapan Empat Aktor Ekosistem</h2>
    <p>
        Sebuah perangkat lunak tidak akan berdaya jika hanya memecahkan masalah satu pihak secara terisolasi. Dalam ekosistem vokasi inklusif, ada empat aktor utama yang selama ini berjalan dalam pulau-pulau sunyi tanpa jembatan komunikasi:
    </p>
    <ul>
        <li><strong>Siswa dengan Ragam Disabilitas (The Aspiring Talents):</strong> Siswa autisme, disabilitas sensorik netra/rungu, disabilitas intelektual, dan tunadaksa. Mereka membutuhkan antarmuka belajar visual, instruksi terstruktur (<em>step-by-step</em>), penguatan positif (<em>gamification badges</em>), dan aksesibilitas ramah neurodivergen.</li>
        <li><strong>Guru dan Instruktur Pendamping SLB (The Dedicated Mentors):</strong> Pahlawan tanpa tanda jasa yang membimbing siswa setiap hari. Mereka membutuhkan instrumen evaluasi harian yang praktis untuk mencatat karakter (<em>soft skills</em>) tanpa terbebani administrasi manual.</li>
        <li><strong>Pengusaha Kafe Mitra Industri (The Progressive Partners):</strong> Pelaku bisnis F&B yang sebenarnya berniat membuka lapangan kerja inklusif, namun dihantui rasa khawatir: <em>"Bagaimana bila operasional terganggu?"</em> Mereka memerlukan metrik kesiapan kerja yang objektif dan terukur.</li>
        <li><strong>Orang Tua / Wali Murid (The Hopeful Families):</strong> Pihak yang memendam kekhawatiran terbesar: <em>"Bagaimana nasib anak saya kelak ketika saya sudah tiada?"</em> Mereka merindukan bukti nyata bahwa buah hati mereka mampu berdikari dan berkarya.</li>
    </ul>

    <div class="figure-box">
        <img src="{img_landing_hero}" alt="Landing Page Hero">
        <div class="figure-caption">Gambar 1: Halaman Depan Publik BREWTECH — Menghubungkan 65 Siswa Binaan, 11 SLB, dan 11 Kafe Mitra Nasional.</div>
    </div>

    <h2 class="section-header">III. The Story of Now: Arsitektur Solusi & Implementasi Nyata</h2>
    <p>
        Saatnya telah tiba untuk menggantikan spekulasi dengan data, dan menggantikan keraguan dengan platform yang tangguh. Inilah bagaimana BREWTECH bekerja secara nyata di lapangan:
    </p>

    <h3 class="sub-header">3.1 Etalase Bakat Publik & Desain Aksesibilitas Universal</h3>
    <p>
        Langkah awal adalah meruntuhkan stigma di ruang publik. Halaman depan BREWTECH dirancang sebagai etalase prestisius yang menampilkan profil <strong>"Top Talents"</strong> barista binaan lengkap dengan asal sekolah SLB, kategori keahlian, dan indeks komputasi kesiapan kerja mereka.
    </p>
    <p>
        Sistem dilengkapi <strong>Accessibility Toolbar Adaptif</strong> dengan fitur Text-to-Speech (TTS), filter buta warna (Protanopia, Deuteranopia, Tritanopia), font ramah disleksia (OpenDyslexic), serta pembesar kursor dan kontras tinggi.
    </p>

    <div class="figure-box">
        <img src="{img_talents}" alt="Top Talents">
        <div class="figure-caption">Gambar 2: Bursa Talenta Unggul — Menampilkan Rekam Jejak dan Rekomendasi Akomodasi Kerja Siswa.</div>
    </div>

    <div class="figure-box">
        <img src="{img_gallery}" alt="Galeri Dokumentasi">
        <div class="figure-caption">Gambar 3: Galeri Dokumentasi Praktik Brewing & Jaringan Kemitraan Ekosistem SLB se-Indonesia.</div>
    </div>

    <h3 class="sub-header">3.2 Gamifikasi Belajar: Mengubah Rasa Takut Menjadi Lencana Prestasi</h3>
    <p>
        Pada portal siswa (<code>/student/dashboard</code>), kurikulum barista dipecah menjadi modul interaktif mikro (<em>micro-learning</em>). Siswa dipandu melalui simulasi visual tentang kalibrasi grinder, takaran espresso, sanitasi steam wand, hingga keramahan pelayanan tamu. Setiap modul yang tuntas dihadiahi lencana prestasi (<em>badges</em>) dan bintang.
    </p>

    <div class="figure-box">
        <img src="{img_student_dash}" alt="Student Dashboard">
        <div class="figure-caption">Gambar 4: Dashboard Pembelajaran Siswa — Desain Gamifikasi dengan Pelacakan Modul dan Lencana Bintang.</div>
    </div>

    <div class="figure-box">
        <img src="{img_quiz}" alt="Quiz Preview">
        <div class="figure-caption">Gambar 5: Pratinjau Kuis & Simulasi Soal Interaktif untuk Menakar Pemahaman Resep Barista.</div>
    </div>

    <h3 class="sub-header">3.3 Penilaian Karakter Harian oleh Instruktur & Guru Pendamping</h3>
    <p>
        Keahlian meracik kopi (<em>hard skill</em>) hanyalah separuh cerita; separuh lainnya yang sangat krusial adalah karakter sosial (<em>soft skill</em>). Melalui portal instruktur (<code>/instructor/classes</code>), guru mengisi rubrik observasi berkala pada 5 indikator: Kedisiplinan & Waktu, Kebersihan Meja Bar, Kerja Sama Tim, Komunikasi Tamu, dan Inisiatif Mandiri.
    </p>

    <div class="figure-box">
        <img src="{img_instructor_dash}" alt="Instructor Dashboard">
        <div class="figure-caption">Gambar 6: Dashboard Instruktur — Memantau Kelas Binaan dan Siswa yang Membutuhkan Pendampingan Khusus.</div>
    </div>

    <div class="figure-box">
        <img src="{img_instructor_eval}" alt="Rubrik Evaluasi">
        <div class="figure-caption">Gambar 7: Rubrik Observasi Soft Skills — Menangkap Dinamika Sikap dan Etika Kerja Lapangan.</div>
    </div>

    <h3 class="sub-header">3.4 Engine SPK MCDM: Transparansi Sains Menggantikan Subjektivitas</h3>
    <p>
        Inilah diferensiasi teknologi utama BREWTECH: mengintegrasikan Engine <strong>Multi-Criteria Decision Making (MCDM)</strong> formal dengan 3 model matematis yang dapat dipilih admin sekolah:
    </p>

    <div class="callout">
        <div class="callout-title">Tiga Algoritma Pengambilan Keputusan Terintegrasi</div>
        <div class="callout-body">
            <strong>1. SAW (Simple Additive Weighting):</strong> Normalisasi skala [0, 1] dan penjumlahan preferensi linear: <em>V_i = &Sigma; (w_j &times; r_ij)</em>.<br>
            <strong>2. WP (Weighted Product):</strong> Perkalian eksponensial dengan pemangkatan bobot: <em>S_i = &prod; (x_ij ^ w_j)</em>.<br>
            <strong>3. TOPSIS:</strong> Menghitung kedekatan geometris relatif terhadap Solusi Ideal Positif (A+) dan Negatif (A-): <em>C_i = D_i^- / (D_i^+ + D_i^-)</em>.
        </div>
    </div>

    <p>
        Pada halaman <code>/school/reports</code>, admin sekolah dapat membandingkan perankingan antar-algoritma melalui <strong>Algorithm Switcher Tabs</strong> secara instan. Tombol <strong>"MATRIKS ILMIAH"</strong> membuka transparansi perhitungan: menampilkan Matriks Keputusan Asal (X), Matriks Ternormalisasi (R/Y), Vektor S dan V, hingga koordinat Solusi Ideal A+/A-.
    </p>

    <div class="figure-box">
        <img src="{img_reports}" alt="SPK Reports">
        <div class="figure-caption">Gambar 8: Laporan SPK MCDM Mutakhir — Tab Switcher Algoritma (SAW, WP, TOPSIS) dan Sebaran Analitik.</div>
    </div>

    <div class="figure-box">
        <img src="{img_spk_settings}" alt="SPK Settings">
        <div class="figure-caption">Gambar 9: Pengaturan Algoritma SPK — Fleksibilitas Penyesuaian Bobot 6 Kriteria Kejuruan (C1 - C6).</div>
    </div>

    <h3 class="sub-header">3.5 Dari Rapor Sekolah Langsung ke Mesin Kasir Kafe (Point-of-Sale)</h3>
    <p>
        Bukti keberhasilan BREWTECH bermuara di meja bar kafe komersial. Pada Portal Admin Kafe (<code>/cafe/pos</code>), mitra industri seperti <strong>Kafe Among Rasa</strong> menggunakan sistem kasir POS layar sentuh yang inklusif. Saat transaksi diproses, kasir dapat memilih siswa magang yang meracik minuman tersebut, merekam jam terbang nyata ke dalam portofolio digital mereka.
    </p>

    <div class="figure-box">
        <img src="{img_cafe_dash}" alt="Cafe Dashboard">
        <div class="figure-caption">Gambar 10: Dashboard Kafe Mitra (Among Rasa) — Rekapitulasi Omzet Penjualan dan Monitoring Kinerja Magang.</div>
    </div>

    <div class="figure-box">
        <img src="{img_pos}" alt="POS Cashier">
        <div class="figure-caption">Gambar 11: Aplikasi Kasir POS Layar Sentuh Inklusif — Mengintegrasikan Penjualan Riil dengan Jam Terbang Siswa.</div>
    </div>

    <div class="figure-box">
        <img src="{img_products}" alt="Cafe Products">
        <div class="figure-caption">Gambar 12: Katalog Produk & Inventori Minuman — Manajemen Stok Bahan Baku dan HPP.</div>
    </div>

    <h3 class="sub-header">3.6 Menghapus Kecemasan Keluarga: Dashboard Orang Tua & Tata Kelola Superadmin</h3>
    <p>
        Bagi wali murid, portal orang tua (<code>/parent/dashboard</code>) adalah ruang haru dan kepastian. Mereka dapat melihat catatan apresiasi guru, histori modul kopi yang telah dituntaskan sang buah hati, serta skor kesiapan kerja mereka menuju industri.
    </p>
    <p>
        Di tingkat nasional, Superadmin mengontrol tata kelola SLB dan Kafe seluruh provinsi, memvalidasi kurikulum modul, memonitor CMS landing page, serta memantau Audit Activity Logs untuk integritas keamanan data.
    </p>

    <div class="figure-box">
        <img src="{img_parent_dash}" alt="Parent Dashboard">
        <div class="figure-caption">Gambar 13: Dashboard Orang Tua — Menyajikan Bukti Kemajuan dan Menumbuhkan Kebanggaan Keluarga.</div>
    </div>

    <div class="figure-box">
        <img src="{img_superadmin_dash}" alt="Superadmin Dashboard">
        <div class="figure-caption">Gambar 14: Dashboard Superadmin Nasional — Pemantauan Agregat Sekolah, Kafe, dan Modul se-Indonesia.</div>
    </div>

    <div class="figure-box">
        <img src="{img_logs}" alt="Audit Logs">
        <div class="figure-caption">Gambar 15: Pusat Rekam Jejak & Audit Activity Logs untuk Menjamin Integritas Sistem.</div>
    </div>

    <h2 class="section-header">IV. Kedalaman Rekayasa Teknologi (Engineering Highlights)</h2>
    <ul>
        <li><strong>Serverless PHP Edge Computing:</strong> Laravel 10 serverless di Vercel dengan optimasi direktori sementara (<code>/tmp/storage</code>) untuk caching views dan sessions tanpa disk persistent.</li>
        <li><strong>Inertia.js + React 18:</strong> Single-Page Application (SPA) yang sangat mulus tanpa latency routing REST API konvensional.</li>
        <li><strong>PostgreSQL Cloud di Supabase (AWS eu-west-2):</strong> Koneksi pooler PgBouncer port 6543 dengan adapter khusus <code>PostgresConnection</code> untuk konsistensi tipe data boolean.</li>
        <li><strong>CI/CD Otomatis via GitHub Actions:</strong> Pipeline migrasi database otomatis yang mengeksekusi 29 skema tabel dan seeder secara remote tanpa downtime.</li>
        <li><strong>Ekspor Rapor Formal (Excel & DomPDF):</strong> Otomasi berkas laporan analitik berkas cetak siap pakai dalam hitungan detik untuk keperluan akreditasi.</li>
    </ul>

    <h2 class="section-header">V. Refleksi & Call to Action: Masa Depan Vokasi Inklusif</h2>
    <p>
        BREWTECH membuktikan bahwa rekayasa perangkat lunak terbaik bukan tentang seberapa rumit kode yang ditulis, melainkan seberapa besar kehidupan manusia yang dapat dimartabatkan oleh kode tersebut.
    </p>
    <p>
        Ketika seorang siswa autisme yang dulunya dicap tidak mampu kini dapat berdiri tegak di balik mesin espresso kafe komersial, menyajikan secangkir latte hangat dengan senyuman tulus, dan dinilai secara adil oleh algoritma sains—di situlah teknologi menemukan makna tertingginya.
    </p>

    <div class="quote-box">
        "Teknologi yang inklusif bukan sekadar fitur tambahan (add-on), melainkan manifestasi dari keadilan sosial dalam bentuk baris-baris kode."
        <span class="quote-author">— Komitmen Pengembang BREWTECH</span>
    </div>

    <p>
        Kini, sistem ini siap direplikasi ke ratusan SLB dan jejaring kafe lainnya di seluruh penjuru tanah air. Mari bersama-sama mengubah belas kasihan menjadi kesempatan nyata—satu tegukan kopi, satu talenta mandiri, satu kebanggaan Indonesia.
    </p>

    <div class="footer-note">
        Dokumen Laporan Portofolio & Studi Kasus &bull; BREWTECH Inclusive Vocation Platform &bull; Terbitan Resmi 2026
    </div>

</body>
</html>
"""

    temp_html_path = r"d:\PAL\brewtech\scratch_narrative.html"
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print("[1] Temporary HTML generated.")

    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(options=options)

    try:
        print("[2] Opening HTML in headless Chrome...")
        driver.get(f"file:///{temp_html_path.replace(os.sep, '/')}")
        time.sleep(3)
        try:
            driver.execute_script("return document.fonts.ready")
        except Exception:
            pass
        time.sleep(1)

        print("[3] Printing to PDF via Chrome DevTools Protocol (Montserrat)...")
        pdf_data = driver.execute_cdp_cmd('Page.printToPDF', {
            'printBackground': True,
            'preferCSSPageSize': True,
            'marginTop': 0,
            'marginBottom': 0,
            'marginLeft': 0,
            'marginRight': 0,
        })

        with open(PDF_OUT, "wb") as f:
            f.write(base64.b64decode(pdf_data['data']))

        print(f"[4] SUCCESS! PDF generated at: {PDF_OUT}")
    finally:
        driver.quit()
        if os.path.exists(temp_html_path):
            os.remove(temp_html_path)

def generate_overview_pdf(driver):
    # Load all base64 images
    img_landing_hero = get_base64_image("01_landing_hero.png")
    img_talents = get_base64_image("02_landing_talents.png")
    img_gallery = get_base64_image("03_landing_gallery.png")
    img_login = get_base64_image("04_login_page.png")
    img_superadmin_dash = get_base64_image("05_superadmin_dashboard.png")
    img_schools = get_base64_image("06_superadmin_schools.png")
    img_cafes = get_base64_image("07_superadmin_cafes.png")
    img_modules = get_base64_image("08_superadmin_modules.png")
    img_quiz = get_base64_image("08b_module_preview_quiz.png")
    img_cms = get_base64_image("09_superadmin_cms.png")
    img_logs = get_base64_image("10_superadmin_logs.png")
    img_school_dash = get_base64_image("11_school_dashboard.png")
    img_school_users = get_base64_image("12_school_users.png")
    img_school_classes = get_base64_image("13_school_classes.png")
    img_reports = get_base64_image("14_school_reports.png")
    img_spk_settings = get_base64_image("15_school_spk.png")
    img_cafe_dash = get_base64_image("16_cafe_dashboard.png")
    img_pos = get_base64_image("17_cafe_pos.png")
    img_products = get_base64_image("18_cafe_products.png")
    img_instructor_dash = get_base64_image("19_instructor_dashboard.png")
    img_instructor_eval = get_base64_image("20_instructor_classes.png")
    img_student_dash = get_base64_image("21_student_dashboard.png")
    img_parent_dash = get_base64_image("22_parent_dashboard.png")

    OVERVIEW_PDF_OUT = r"d:\PAL\brewtech\Dokumen_Overview_dan_Panduan_Aplikasi_BREWTECH.pdf"

    html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Panduan & Overview Sistem Aplikasi BREWTECH v2.0</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&display=swap');
    @page {{ size: A4; margin: 18mm 20mm; }}
    body {{
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 9pt; line-height: 1.55; color: #334155; margin: 0; padding: 0;
    }}
    .tagline {{
        display: inline-block; padding: 4px 12px; background: #e0f2fe; color: #0284c7;
        font-size: 8pt; font-weight: 800; letter-spacing: 1.5px; border-radius: 20px; text-transform: uppercase;
    }}
    h1.title {{ font-size: 24pt; font-weight: 900; color: #0f172a; margin: 8px 0; line-height: 1.15; }}
    .subtitle {{ font-size: 11pt; color: #0ea5e9; font-style: italic; margin-bottom: 16px; }}
    .meta-box {{ width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 8.5pt; }}
    .meta-box td {{ padding: 6px 10px; border: 1px solid #e2e8f0; }}
    .meta-box td.lbl {{ background: #f8fafc; font-weight: bold; width: 25%; color: #0f172a; }}
    h2 {{ font-size: 13pt; font-weight: 800; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-top: 24px; text-transform: uppercase; page-break-after: avoid; }}
    h3 {{ font-size: 10.5pt; font-weight: 700; color: #db2777; margin-top: 14px; page-break-after: avoid; }}
    p {{ margin: 0 0 8px 0; text-align: justify; }}
    ul {{ margin: 0 0 10px 0; padding-left: 20px; }}
    li {{ margin-bottom: 4px; text-align: justify; }}
    .fig {{ text-align: center; margin: 12px 0; page-break-inside: avoid; }}
    .fig img {{ max-width: 98%; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06); }}
    .fig-cap {{ font-size: 7.5pt; color: #64748b; font-style: italic; margin-top: 4px; }}
    .callout {{ background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin: 12px 0; page-break-inside: avoid; }}
    .callout b {{ color: #166534; }}
    .tbl-roles {{ width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 8pt; page-break-inside: avoid; }}
    .tbl-roles th {{ background: #0f172a; color: white; padding: 6px 8px; text-align: left; font-size: 8pt; }}
    .tbl-roles td {{ padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }}
    .tbl-roles tr:nth-child(even) td {{ background: #f8fafc; }}
    .footer-note {{ margin-top: 24px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 7.5pt; color: #94a3b8; text-align: center; }}
</style>
</head>
<body>
    <!-- ========================================== -->
    <!-- HALAMAN 1: COVER PAGE PANDUAN SISTEM -->
    <!-- ========================================== -->
    <div style="text-align: center; padding-top: 25px; page-break-after: always;">
        <div class="tagline" style="margin-bottom: 14px;">INCLUSIVE VOCATIONAL EDUCATION & COMMERCIAL ECOSYSTEM</div>
        <h1 class="title" style="font-size: 26pt; margin-bottom: 4px;">PANDUAN & OVERVIEW SISTEM<br><span style="color: #0284c7;">APLIKASI BREWTECH v2.0</span></h1>
        <div class="subtitle" style="font-size: 11pt; max-width: 90%; margin: 0 auto 16px auto;">Platform SaaS Pendidikan Vokasi Disabilitas Terintegrasi, Penilaian SPK Kesiapan Kerja, Kasir POS Kafe Mitra, dan Portal Pemantauan Multi-Peran</div>

        <div style="margin: 16px 0;">
            <img src="{img_landing_hero}" alt="Hero" style="max-width: 94%; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
        </div>

        <table class="meta-box" style="margin-top: 18px; font-size: 8.5pt;">
            <tr><td class="lbl" style="width: 28%;">Nama Platform</td><td><strong>BREWTECH (The Cup We Share)</strong></td></tr>
            <tr><td class="lbl">Versi Sistem</td><td>v2.0 Production (Serverless + PostgreSQL)</td></tr>
            <tr><td class="lbl">Lingkungan Cloud</td><td>Vercel Edge Cloud & Supabase PostgreSQL (AWS eu-west-2)</td></tr>
            <tr><td class="lbl">Alamat Produksi Live</td><td><strong style="color: #0284c7;">https://brewtech-v2.vercel.app</strong></td></tr>
            <tr><td class="lbl">Fokus Ekosistem</td><td>Hilirisasi Vokasi Disabilitas: SLB &rarr; Pelatihan Barista &rarr; Penilaian SPK &rarr; Kasir POS Kafe Mitra</td></tr>
            <tr><td class="lbl">Tanggal Terbit</td><td>November 2026 &bull; Dokumentasi Resmi</td></tr>
        </table>
    </div>

    <!-- ========================================== -->
    <!-- HALAMAN 2: BAB I & SETERUSNYA -->
    <!-- ========================================== -->
    <h2 style="margin-top: 10px;">BAB I: PENDAHULUAN & ARSITEKTUR SISTEM</h2>
    <p>BREWTECH adalah platform perangkat lunak berbasis layanan (SaaS) yang dirancang secara khusus untuk mengatasi kesenjangan antara dunia pendidikan khusus (Sekolah Luar Biasa / SLB) dan industri kerja komersial (Food & Beverage / Kafe). Melalui pendekatan vokasi terintegrasi, Brewtech memberdayakan siswa penyandang disabilitas agar memperoleh keterampilan profesional sebagai barista dan tenaga kerja kafe mandiri.</p>

    <h3>Empat Pilar Utama Ekosistem Brewtech</h3>
    <ul>
        <li><strong>LMS Vokasi Berbasis Gamifikasi:</strong> Kurikulum pelatihan barista berstandar industri dengan materi visual, video, dan kuis interaktif.</li>
        <li><strong>Sistem Pendukung Keputusan (SPK) MCDM:</strong> Engine Multi-Criteria Decision Making komprehensif mengimplementasikan 3 algoritma (SAW, WP, TOPSIS) berbasis 6 kriteria kejuruan (C1-C6).</li>
        <li><strong>Hilirisasi Industri & Kasir POS Kafe:</strong> Modul kasir Point-of-Sale (POS) terintegrasi pada Kafe Mitra (seperti Kafe Among Rasa) yang menjadi wadah kerja nyata siswa.</li>
        <li><strong>Portal Wali Murid Transparan:</strong> Transparansi penuh bagi orang tua/wali untuk memantau kehadiran, progres modul, catatan instruktur, dan perkembangan psikososial anak.</li>
    </ul>

    <h2>BAB II: STRUKTUR PERAN & KREDENSIAL LOGIN DEMO</h2>
    <p>Tersedia 6 akun resmi yang dapat digunakan langsung untuk keperluan presentasi dan pengujian:</p>
    <table class="tbl-roles">
        <thead>
            <tr><th>Peran Pengguna</th><th>Email Login</th><th>Password</th><th>Hak Akses & Fungsi Utama</th></tr>
        </thead>
        <tbody>
            <tr><td><b>Superadmin</b></td><td>superadmin@brewtech.id</td><td>password123</td><td>Dashboard Nasional, CRUD SLB & Mitra Kafe, Master Builder Kurikulum Modul, Audit Logs, CMS.</td></tr>
            <tr><td><b>Admin Sekolah</b></td><td>admin@slbypacmalang.sch.id</td><td>password123</td><td>Dashboard SLB YPAC, Manajemen Siswa, Wali, Guru, Kelas Vokasi, Engine SPK Settings, Rapor.</td></tr>
            <tr><td><b>Instruktur / Guru</b></td><td>lilikkurniyatispdgr@instructor.com</td><td>password123</td><td>Dashboard Pelatih, Manajemen Kelas Binaan, Form Observasi Rubrik Soft Skills Harian Siswa.</td></tr>
            <tr><td><b>Admin Kafe</b></td><td>admin@amongrasa.com</td><td>password123</td><td>Dashboard Kafe Among Rasa, Kasir POS Layar Sentuh, Katalog Produk Minuman & Inventori Bahan.</td></tr>
            <tr><td><b>Siswa (Student)</b></td><td>arlandomalanesiawaran@student.com</td><td>password123</td><td>Dashboard Belajar Gamifikasi, Materi Brewing Interaktif, Simulasi Kuis, Perolehan Bintang.</td></tr>
            <tr><td><b>Orang Tua / Wali</b></td><td>veronikaworabay@parent.com</td><td>password123</td><td>Dashboard Wali Murid, Monitoring Progres Modul Anak, Evaluasi Karakter dari Guru, Unduh Rapor.</td></tr>
        </tbody>
    </table>

    <h2>BAB III: DAFTAR MENU, FITUR & DOKUMENTASI SCREENSHOT</h2>
    
    <h3>3.1 Halaman Depan Publik (Landing Page)</h3>
    <div class="fig"><img src="{img_landing_hero}"><div class="fig-cap">Gambar 1: Halaman Depan Publik (Hero Banner & Statistik Realtime Nasional)</div></div>
    <div class="fig"><img src="{img_talents}"><div class="fig-cap">Gambar 2: Section Top Talents Barista Berprestasi Berdasarkan SPK</div></div>
    <div class="fig"><img src="{img_gallery}"><div class="fig-cap">Gambar 3: Galeri Dokumentasi & Jaringan Kemitraan Ekosistem SLB Nasional</div></div>

    <h3>3.2 Portal Autentikasi Satu Pintu</h3>
    <div class="fig"><img src="{img_login}"><div class="fig-cap">Gambar 4: Halaman Login Terpadu Seluruh Aktor Ekosistem</div></div>

    <h3>3.3 Portal Superadmin Nasional</h3>
    <div class="fig"><img src="{img_superadmin_dash}"><div class="fig-cap">Gambar 5: Dashboard Superadmin (Agregat Statistik Nasional)</div></div>
    <div class="fig"><img src="{img_schools}"><div class="fig-cap">Gambar 6: Master Data Sekolah SLB Binaan se-Indonesia</div></div>
    <div class="fig"><img src="{img_cafes}"><div class="fig-cap">Gambar 7: Master Data Kafe Mitra Industri Komersial</div></div>
    <div class="fig"><img src="{img_modules}"><div class="fig-cap">Gambar 8: Master Builder Kurikulum Modul Pelatihan Barista</div></div>
    <div class="fig"><img src="{img_quiz}"><div class="fig-cap">Gambar 9: Pratinjau Kuis & Simulasi Soal Interaktif</div></div>
    <div class="fig"><img src="{img_cms}"><div class="fig-cap">Gambar 10: CMS Pengelolaan Konten Banner & Unduhan APK/PWA</div></div>
    <div class="fig"><img src="{img_logs}"><div class="fig-cap">Gambar 11: Pusat Audit Trail & Log Aktivitas Sistem</div></div>

    <h3>3.4 Portal Admin Sekolah (SLB YPAC Kota Malang)</h3>
    <div class="fig"><img src="{img_school_dash}"><div class="fig-cap">Gambar 12: Dashboard Admin Sekolah SLB YPAC Kota Malang</div></div>
    <div class="fig"><img src="{img_school_users}"><div class="fig-cap">Gambar 13: Manajemen Siswa, Wali Murid, dan Guru Pendamping</div></div>
    <div class="fig"><img src="{img_school_classes}"><div class="fig-cap">Gambar 14: Manajemen Rombongan Belajar Kelas Vokasi</div></div>
    <div class="fig"><img src="{img_reports}"><div class="fig-cap">Gambar 15: Laporan SPK MCDM (Multi-Algoritma SAW, WP, TOPSIS & Analitik)</div></div>
    <div class="fig"><img src="{img_spk_settings}"><div class="fig-cap">Gambar 16: Pengaturan Engine & Bobot 6 Kriteria Kejuruan SPK</div></div>

    <h3>3.5 Portal Admin Kafe & Kasir POS (Among Rasa)</h3>
    <div class="fig"><img src="{img_cafe_dash}"><div class="fig-cap">Gambar 17: Dashboard Penjualan Bisnis Kafe Mitra</div></div>
    <div class="fig"><img src="{img_pos}"><div class="fig-cap">Gambar 18: Aplikasi Kasir Point-of-Sale (POS) Inklusif Terhubung Siswa Magang</div></div>
    <div class="fig"><img src="{img_products}"><div class="fig-cap">Gambar 19: Katalog Produk & Inventori Stok Bahan Minuman</div></div>

    <h3>3.6 Portal Instruktur, Siswa & Orang Tua</h3>
    <div class="fig"><img src="{img_instructor_dash}"><div class="fig-cap">Gambar 20: Dashboard Pelatih & Guru Pendamping</div></div>
    <div class="fig"><img src="{img_instructor_eval}"><div class="fig-cap">Gambar 21: Form Observasi Rubrik Soft Skills Siswa</div></div>
    <div class="fig"><img src="{img_student_dash}"><div class="fig-cap">Gambar 22: Dashboard Gamifikasi Pembelajaran Siswa Barista</div></div>
    <div class="fig"><img src="{img_parent_dash}"><div class="fig-cap">Gambar 23: Dashboard Transparansi Pemantauan Orang Tua</div></div>

    <div class="footer-note">
        Dokumen Panduan Sistem &bull; BREWTECH Inclusive Vocation Platform v2.0 &bull; Diterbitkan Otomatis
    </div>
</body>
</html>
"""
    temp_overview_path = r"d:\PAL\brewtech\scratch_overview.html"
    with open(temp_overview_path, "w", encoding="utf-8") as f:
        f.write(html)

    print("[Overview 1] Opening HTML in headless Chrome...")
    driver.get(f"file:///{temp_overview_path.replace(os.sep, '/')}")
    time.sleep(3)
    try:
        driver.execute_script("return document.fonts.ready")
    except Exception:
        pass
    time.sleep(1)

    print("[Overview 2] Printing to PDF via CDP (Montserrat)...")
    pdf_data = driver.execute_cdp_cmd('Page.printToPDF', {
        'printBackground': True,
        'preferCSSPageSize': True,
        'marginTop': 0, 'marginBottom': 0, 'marginLeft': 0, 'marginRight': 0,
    })

    with open(OVERVIEW_PDF_OUT, "wb") as f:
        f.write(base64.b64decode(pdf_data['data']))

    print(f"[Overview 3] SUCCESS! PDF generated at: {OVERVIEW_PDF_OUT}")
    if os.path.exists(temp_overview_path):
        os.remove(temp_overview_path)

if __name__ == "__main__":
    generate_public_narrative_pdf()
    
    # Also generate overview PDF with single browser session
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(options=options)
    try:
        generate_overview_pdf(driver)
    finally:
        driver.quit()

