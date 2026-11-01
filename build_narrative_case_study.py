# -*- coding: utf-8 -*-
"""
Script to generate the Public Narrative Case Study for BREWTECH.
Generates:
1. BREWTECH_Case_Study_Public_Narrative.docx (Styled Executive Word Document)
2. BREWTECH_Portfolio_Case_Study.md (Web-ready Markdown for Portfolio / Blog)
"""

import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

SCREENSHOTS_DIR = r"d:\PAL\brewtech\doc_screenshots"
DOCX_OUT = r"d:\PAL\brewtech\BREWTECH_Case_Study_Public_Narrative.docx"
MD_OUT = r"d:\PAL\brewtech\BREWTECH_Portfolio_Case_Study.md"

# Color Palette
C_PRIMARY = RGBColor(14, 165, 233)    # Cyan / Sky (#0EA5E9)
C_SECONDARY = RGBColor(236, 72, 153) # Pink / Rose (#EC4899)
C_DARK = RGBColor(15, 23, 42)        # Slate 900 (#0F172A)
C_SLATE = RGBColor(71, 85, 105)      # Slate 600
C_MUTED = RGBColor(100, 116, 139)    # Slate 500
C_ACCENT = RGBColor(124, 58, 237)    # Purple 600

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.9)
        section.bottom_margin = Inches(0.9)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Helper functions
    def add_title(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Montserrat"
        run.font.size = Pt(28)
        run.font.color.rgb = C_DARK
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(20)
        run = p.add_run(text)
        run.italic = True
        run.font.name = "Montserrat"
        run.font.size = Pt(13)
        run.font.color.rgb = C_PRIMARY
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(24)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Montserrat"
        run.font.size = Pt(17)
        run.font.color.rgb = C_DARK
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.bold = True
        run.font.name = "Montserrat"
        run.font.size = Pt(13)
        run.font.color.rgb = C_ACCENT
        return p

    def add_p(text, bold_prefix=None, space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.2
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.bold = True
            r_bold.font.name = "Montserrat"
            r_bold.font.size = Pt(10.5)
            r_bold.font.color.rgb = C_DARK
        run = p.add_run(text)
        run.font.name = "Montserrat"
        run.font.size = Pt(10.5)
        run.font.color.rgb = C_SLATE
        return p

    def add_quote(quote_text, author=""):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, top=140, bottom=140, left=200, right=160)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(f'"{quote_text}"')
        r.italic = True
        r.bold = True
        r.font.name = "Montserrat"
        r.font.size = Pt(11)
        r.font.color.rgb = C_DARK

        if author:
            p2 = cell.add_paragraph()
            p2.paragraph_format.space_before = Pt(4)
            p2.paragraph_format.space_after = Pt(0)
            r2 = p2.add_run(f'— {author}')
            r2.font.name = "Montserrat"
            r2.font.size = Pt(9.5)
            r2.font.color.rgb = C_MUTED
        
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(8)

    def add_screenshot(filename, caption):
        img_path = os.path.join(SCREENSHOTS_DIR, filename)
        if not os.path.exists(img_path):
            print(f"Warning: {filename} not found.")
            return

        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        run = p.add_run()
        run.add_picture(img_path, width=Inches(6.2))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(14)
        r_cap = p_cap.add_run(f"Gambar: {caption}")
        r_cap.italic = True
        r_cap.font.name = "Montserrat"
        r_cap.font.size = Pt(8.5)
        r_cap.font.color.rgb = C_MUTED

    def add_callout(title, text, color_hex="F0FDF4", border_color=C_PRIMARY):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, color_hex)
        set_cell_margins(cell, top=140, bottom=140, left=180, right=160)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        r_title = p.add_run(f"💡 {title}\n")
        r_title.bold = True
        r_title.font.name = "Montserrat"
        r_title.font.size = Pt(10.5)
        r_title.font.color.rgb = C_DARK

        r_text = p.add_run(text)
        r_text.font.name = "Montserrat"
        r_text.font.size = Pt(9.5)
        r_text.font.color.rgb = C_SLATE

        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(8)

    # -------------------------------------------------------------
    # DOCUMENT CONTENT
    # -------------------------------------------------------------

    # Category Pill
    p_meta = doc.add_paragraph()
    r_meta = p_meta.add_run("PUBLIC NARRATIVE PRODUCT CASE STUDY &bull; INCLUSIVE TECH &bull; FULL STACK SAAS")
    r_meta.bold = True
    r_meta.font.name = "Montserrat"
    r_meta.font.size = Pt(9)
    r_meta.font.color.rgb = C_PRIMARY

    # Main Title & Subtitle
    add_title("BREWTECH: Menjembatani Secangkir Kopi, Talenta Istimewa, dan Martabat Vokasi Disabilitas")
    add_subtitle("Sebuah Perjalanan Transformasi dari Belas Kasihan Menuju Kompetensi Berdaya Saing Tinggi Melalui Rekayasa Perangkat Lunak dan Matematika Keputusan")

    add_quote(
        "Kemandirian seorang individu tidak lahir dari belas kasihan masyarakat, melainkan dari panggung kesempatan yang setara untuk membuktikan nilai karya mereka.",
        "Refleksi Perancangan Sistem Brewtech"
    )

    # Meta Table (Role, Tech, Timeline, Live URL)
    t_info = doc.add_table(rows=4, cols=2)
    t_info.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        ("Peran Pengembang", "Full-Stack Engineer, Decision Systems Architect & Inclusive UX Designer"),
        ("Teknologi Inti", "Laravel 10 Serverless, React 18, Inertia.js, Supabase PostgreSQL, Recharts, MCDM Engine"),
        ("Dampak Nyata", "65 Siswa Terdaftar, 11 SLB Percontohan, 11 Mitra Industri Kafe di 10 Kota Besar"),
        ("Tautan Produksi", "https://brewtech-v2.vercel.app (Live Remote Deployment)")
    ]
    for i, (k, v) in enumerate(meta_rows):
        c0, c1 = t_info.rows[i].cells
        c0.width = Inches(2.0)
        c1.width = Inches(4.5)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, top=60, bottom=60, left=80, right=80)
        set_cell_margins(c1, top=60, bottom=60, left=80, right=80)
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(k)
        r0.bold = True
        r0.font.size = Pt(9)
        r0.font.name = "Montserrat"
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(v)
        r1.font.size = Pt(9)
        r1.font.name = "Montserrat"
        if "http" in v:
            r1.bold = True
            r1.font.color.rgb = C_PRIMARY

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # CHAPTER 1: THE STORY OF SELF
    # -------------------------------------------------------------
    add_h1("I. THE STORY OF SELF: PANGGILAN DI BALIK AROMA BIJI KOPI")
    
    add_p("Pernahkah Anda memperhatikan apa yang terjadi ketika seorang anak dengan autisme atau disabilitas sensorik menyelesaikan masa sekolahnya di Sekolah Luar Biasa (SLB)? Di ruang kelas, mereka dihargai dan dilindungi. Namun begitu melangkah melewati gerbang kelulusan, mereka kerap berhadapan dengan tembok keheningan: dunia industri yang bingung bagaimana mempekerjakan mereka, dan masyarakat yang masih memandang mereka melalui kacamata belas kasihan (charity model), bukan kacamata kapasitas dan kapabilitas.")

    add_p("Kisah ini bermula dari perjumpaan saya dengan salah satu laboratorium kejuruan vokasi di Jawa Timur. Di sana, seorang siswa rungu bernama Arlando sedang menyeduh kopi manual (V60). Tangannya mantap menimbang air dengan rasio 1:15, matanya sangat jeli memperhatikan waktu blooming, dan perhatiannya terhadap kebersihan meja bar begitu presisi—jauh lebih teliti daripada kebanyakan orang biasa. Namun, sang guru pendamping bercerita dengan nada getir: 'Pak, anak-anak kami punya tangan emas dan ketekunan luar biasa. Tapi kami bingung, ke kafe mana mereka bisa magang? Bagaimana cara meyakinkan pemilik kafe bahwa anak ini siap kerja?'")

    add_p("Momen itulah yang mengubah cara pandang saya sebagai seorang rekayasawan perangkat lunak (software engineer). Selama ini, industri teknologi sering kali menghabiskan jutaan jam komputasi untuk mengoptimalkan klik iklan atau membuat algoritma yang memicu adiksi media sosial. Mengapa kita tidak menggunakan keahlian rekayasa sistem yang sama untuk membangun jembatan peradaban yang memartabatkan manusia?")

    add_p("Dari kegelisahan itulah, BREWTECH lahir. Tekad saya bulat: membangun platform SaaS terpadu yang bukan hanya mencatat nilai sekolah, melainkan sebuah ekosistem holistik yang menghubungkan pelatihan berbasis gamifikasi, algoritma pengambilan keputusan saintifik (SPK), mesin kasir komersial (POS), hingga transparansi penuh bagi orang tua.")

    # -------------------------------------------------------------
    # CHAPTER 2: THE STORY OF US
    # -------------------------------------------------------------
    add_h1("II. THE STORY OF US: MENJAHIT HARAPAN EMPAT AKTOR EKOSISTEM")

    add_p("Sebuah perangkat lunak tidak akan berdaya jika hanya memecahkan masalah satu pihak secara terisolasi. Dalam ekosistem vokasi inklusif, ada empat aktor utama yang selama ini berjalan dalam pulau-pulau sunyi tanpa jembatan komunikasi:")

    add_p("1. Siswa dengan Ragam Disabilitas (The Aspiring Talents): Siswa autisme, disabilitas sensorik netra/rungu, disabilitas intelektual, dan tunadaksa. Mereka membutuhkan antarmuka belajar visual, langkah instruksi yang terstruktur (step-by-step), sistem penguatan positif (gamification badges), serta aksesibilitas ramah sensorik.", bold_prefix="• ")
    add_p("2. Guru dan Instruktur Pendamping SLB (The Dedicated Mentors): Pahlawan tanpa tanda jasa yang setiap hari membimbing siswa. Mereka membutuhkan instrumen evaluasi harian yang praktis untuk mencatat karakter (soft skills) tanpa terbebani administrasi manual yang rumit.", bold_prefix="• ")
    add_p("3. Pengusaha Kafe Mitra Industri (The Progressive Partners): Pelaku bisnis F&B yang sebenarnya memiliki itikad sosial tinggi untuk membuka lapangan kerja inklusif, namun dihantui rasa takut: 'Bagaimana bila operasional terganggu? Bagaimana jika terjadi salah takaran resep?' Mereka memerlukan metrik kesiapan kerja yang transparan dan dapat dipertanggungjawabkan secara objektif.", bold_prefix="• ")
    add_p("4. Orang Tua / Wali Murid (The Hopeful Families): Pihak yang menanggung kecemasan terbesar: 'Bagaimana nasib anak saya kelak ketika saya sudah tiada?' Mereka merindukan bukti nyata bahwa anak mereka mampu berdikari dan berkarya di tengah masyarakat.", bold_prefix="• ")

    add_quote(
        "Kekuatan 'US' dalam BREWTECH adalah ketika keempat aktor ini dipertemukan dalam satu arsitektur digital. Guru melatih, sistem menganalisis, kafe menampung, dan orang tua menyaksikan buah perjuangan putra-putri mereka.",
        "Filosofi Desain Ekosistem Brewtech"
    )

    add_screenshot("01_landing_hero.png", "Halaman Depan Publik BREWTECH: Menghubungkan 65 Siswa Binaan, 11 SLB, dan 11 Kafe Mitra Nasional")

    # -------------------------------------------------------------
    # CHAPTER 3: THE STORY OF NOW
    # -------------------------------------------------------------
    add_h1("III. THE STORY OF NOW: ARSITEKTUR SOLUSI & IMPLEMENTASI NYATA")

    add_p("Saatnya telah tiba untuk menggantikan spekulasi dengan data, dan menggantikan keraguan dengan platform yang tangguh. Inilah bagaimana BREWTECH bekerja secara nyata, dari pintu masuk publik hingga ke mesin kasir kafe komersial:")

    # 3.1 Gerbang Inklusif & Portofolio Siswa
    add_h2("3.1 Etalase Bakat Publik & Desain Aksesibilitas Universal")
    add_p("Langkah awal adalah meruntuhkan stigma di ruang publik. Halaman depan BREWTECH dirancang sebagai etalase prestisius yang menampilkan profil 'Top Talents' barista binaan lengkap dengan asal sekolah SLB, kategori keahlian, dan indeks komputasi kesiapan kerja mereka.")
    add_p("Agar dapat diakses oleh semua ragam disabilitas, kami menyematkan Accessibility Toolbar adaptif yang mendukung pembaca layar (Text-to-Speech), filter ramah buta warna (Protanopia, Deuteranopia, Tritanopia), font ramah disleksia (OpenDyslexic), serta pembesar kursor dan kontras tinggi.")

    add_screenshot("02_landing_talents.png", "Bursa Talenta Unggul: Menampilkan Rekam Jejak dan Rekomendasi Akomodasi Kerja Siswa")
    add_screenshot("03_landing_gallery.png", "Galeri Dokumentasi Praktik Brewing & Jaringan Kemitraan Ekosistem SLB se-Indonesia")

    # 3.2 LMS Gamifikasi
    add_h2("3.2 Gamifikasi Belajar: Mengubah Rasa Takut Menjadi Lencana Prestasi")
    add_p("Bagi siswa dengan hambatan belajar, lembar soal konvensional sering kali memicu kecemasan kognitif. Pada portal pembelajaran siswa (/student/dashboard), kurikulum barista dipecah menjadi modul interaktif mikro (micro-learning). Siswa dipandu melalui simulasi visual tentang kalibrasi grinder, takaran espresso, sanitasi steam wand, hingga hospitality etika melayani tamu. Setiap ketuntasan modul dihadiahi lencana prestasi (badges) dan perolehan bintang yang menumbuhkan rasa percaya diri.")

    add_screenshot("21_student_dashboard.png", "Dashboard Pembelajaran Siswa: Desain Gamifikasi dengan Pelacakan Modul dan Lencana Bintang")
    add_screenshot("08b_module_preview_quiz.png", "Pratinjau Kuis & Simulasi Soal Interaktif untuk Menakar Pemahaman Resep Barista")

    # 3.3 Penilaian Karakter Harian
    add_h2("3.3 Observasi Berkelanjutan oleh Instruktur & Guru Pendamping")
    add_p("Keahlian meracik kopi (hard skill) hanyalah separuh dari keberhasilan kerja; separuh lainnya yang sangat krusial adalah karakter sosial (soft skill). Melalui portal instruktur (/instructor/classes), guru pendamping mengisi rubrik observasi berkala pada 5 indikator perilaku: Kedisiplinan & Waktu, Higienitas Meja Bar, Kerja Sama Tim, Komunikasi Tamu, dan Inisiatif Mandiri.")

    add_screenshot("19_instructor_dashboard.png", "Dashboard Instruktur: Memantau Kelas Binaan dan Siswa yang Membutuhkan Intervensi Khusus")
    add_screenshot("20_instructor_classes.png", "Rubrik Observasi Soft Skills: Menangkap Dinamika Sikap dan Etika Kerja Lapangan")

    # 3.4 Deep Dive SPK MCDM
    add_h2("3.4 Engine SPK MCDM: Transparansi Sains Menggantikan Subjektivitas")
    add_p("Inilah jantung kecerdasan buatan dan diferensiasi teknologi BREWTECH. Kami menolak formula penilaian arbitrer dan mengintegrasikan Engine Multi-Criteria Decision Making (MCDM) formal dengan 3 model matematis teruji yang dapat diaktifkan sekolah:")

    add_callout(
        "Tiga Pilar Algoritma Keputusan Terintegrasi di BREWTECH",
        "1. SAW (Simple Additive Weighting): Menormalisasi matriks skor ke skala relatif [0, 1] dan menghitung preferensi terbobot linier.\n"
        "2. WP (Weighted Product): Menggunakan perkalian eksponensial di mana tiap kriteria dipangkatkan dengan bobot terbobot, sangat selektif menyaring kandidat konsisten.\n"
        "3. TOPSIS: Menghitung jarak geometri Euclidean menuju Solusi Ideal Positif (A+) dan terjauh dari Solusi Ideal Negatif (A-), menghasilkan kedekatan relatif (Relative Closeness Ci) dengan akurasi tinggi.",
        color_hex="FDF4FF"
    )

    add_p("Pada halaman /school/reports, Admin Sekolah dapat membandingkan hasil perankingan antar-metode melalui Algorithm Switcher Tabs secara instan. Lebih dari itu, tersedia tombol 'MATRIKS ILMIAH' yang membuka transparansi komputasi: menampilkan Matriks Keputusan Asal (X), Matriks Ternormalisasi (R/Y), Vektor S dan V, hingga koordinat Solusi Ideal A+/A-.")

    add_screenshot("14_school_reports.png", "Laporan SPK MCDM Mutakhir: Tab Switcher Algoritma (SAW, WP, TOPSIS) dan Sebaran Analitik")
    add_screenshot("15_school_spk.png", "Pengaturan Algoritma SPK: Fleksibilitas Penyesuaian Bobot 6 Kriteria Kejuruan (C1 - C6)")

    # 3.5 POS Kasir & Hilirisasi
    add_h2("3.5 Dari Rapor Sekolah Langsung ke Mesin Kasir Kafe (Point-of-Sale)")
    add_p("Bukti keberhasilan BREWTECH bermuara di meja bar kafe komersial. Pada Portal Admin Kafe (/cafe/pos), mitra industri seperti Kafe Among Rasa menggunakan sistem kasir POS layar sentuh yang dirancang responsif dan ramah disabilitas. Ketika melayani pesanan kopi (Espresso, Latte, Matchabiyu), kasir dapat menetapkan siswa magang yang bertugas meracik minuman tersebut.")
    add_p("Dengan demikian, setiap struk belanja pelanggan merekam jam terbang dan kontribusi nyata siswa barista. Data ini terakumulasi otomatis ke dalam portofolio digital mereka.")

    add_screenshot("16_cafe_dashboard.png", "Dashboard Kafe Mitra (Among Rasa): Rekapitulasi Omzet Penjualan dan Monitoring Kinerja Magang")
    add_screenshot("17_cafe_pos.png", "Aplikasi Kasir POS Layar Sentuh Inklusif: Mengintegrasikan Penjualan Riil dengan Jam Terbang Siswa")
    add_screenshot("18_cafe_products.png", "Katalog Produk & Inventori Minuman: Manajemen Stok Bahan Baku dan HPP")

    # 3.6 Transparansi Orang Tua & Tata Kelola
    add_h2("3.6 Menghapus Kecemasan Keluarga: Dashboard Orang Tua & Tata Kelola Superadmin")
    add_p("Bagi orang tua, portal wali murid (/parent/dashboard) adalah ruang haru dan kepastian. Mereka dapat melihat catatan apresiasi guru, histori modul kopi yang telah dituntaskan sang buah hati, serta skor kesiapan kerja mereka menuju dunia industri.")
    add_p("Di tingkat nasional, Superadmin mengontrol tata kelola SLB dan Kafe seluruh provinsi, memvalidasi kurikulum modul, memonitor CMS landing page, serta memantau Audit Activity Logs untuk integritas keamanan data.")

    add_screenshot("22_parent_dashboard.png", "Dashboard Orang Tua: Menyajikan Bukti Kemajuan dan Menumbuhkan Kebanggaan Keluarga")
    add_screenshot("05_superadmin_dashboard.png", "Dashboard Superadmin Nasional: Pemantauan Agregat Sekolah, Kafe, dan Modul se-Indonesia")
    add_screenshot("10_superadmin_logs.png", "Pusat Rekam Jejak & Audit Activity Logs untuk Menjamin Integritas Sistem")

    # -------------------------------------------------------------
    # CHAPTER 4: TECHNICAL ARCHITECTURE
    # -------------------------------------------------------------
    add_h1("IV. KEDALAMAN REKAYASA TEKNOLOGI (ENGINEERING EXCELLENCE)")

    add_p("Membangun aplikasi berdampak sosial tinggi tidak boleh berkompromi dengan kualitas arsitektur teknis. BREWTECH dirancang dengan standar industri perangkat lunak modern:")

    add_p("1. Serverless PHP Edge Computing: Berjalan pada Laravel 10 serverless di Vercel dengan penyesuaian temporary directory (/tmp/storage) untuk caching view dan sessions.", bold_prefix="• ")
    add_p("2. Inertia.js + React 18: Pengalaman pengguna Single-Page Application (SPA) yang sangat mulus tanpa latency routing REST API konvensional.", bold_prefix="• ")
    add_p("3. PostgreSQL Cloud di Supabase (AWS eu-west-2): Koneksi pooler PgBouncer port 6543 dengan optimasi adapter boolean PostgresConnection untuk mencegah diskrepansi casting tipe data.", bold_prefix="• ")
    add_p("4. CI/CD Otomatis via GitHub Actions: Pipeline migrasi database otomatis yang mengeksekusi 29 skema tabel dan data seeder secara remote tanpa downtime.", bold_prefix="• ")
    add_p("5. Ekspor Rapor Formal (Excel & DomPDF): Kemampuan men-generate laporan analitik berkas cetak siap pakai dalam hitungan detik untuk keperluan akreditasi.", bold_prefix="• ")

    # -------------------------------------------------------------
    # CHAPTER 5: REFLECTION & IMPACT
    # -------------------------------------------------------------
    add_h1("V. REFLEKSI & CALL TO ACTION: MASA DEPAN VOKASI INKLUSIF")

    add_p("BREWTECH membuktikan bahwa rekayasa perangkat lunak terbaik bukan tentang seberapa rumit kode yang ditulis, melainkan seberapa besar kehidupan manusia yang dapat dimartabatkan oleh kode tersebut.")

    add_p("Ketika seorang siswa autisme yang dulunya dicap tidak mampu kini dapat berdiri tegak di balik mesin espresso kafe komersial, menyajikan secangkir latte hangat dengan senyuman tulus, dan dinilai secara adil oleh algoritma sains—di situlah teknologi menemukan makna tertingginya.")

    add_quote(
        "Teknologi yang inklusif bukan sekadar fitur tambahan (add-on), melainkan manifestasi dari keadilan sosial dalam bentuk baris-baris kode.",
        "Komitmen Pengembang BREWTECH"
    )

    add_p("Kini, sistem ini siap direplikasi ke ratusan SLB dan jejaring kafe lainnya di seluruh penjuru tanah air. Mari bersama-sama mengubah belas kasihan menjadi kesempatan nyata—satu tegukan kopi, satu talenta mandiri, satu kebanggaan Indonesia.")

    # Save docx
    doc.save(DOCX_OUT)
    print(f"[OK] Word Document saved to: {DOCX_OUT}")

def create_markdown():
    md_content = """# BREWTECH: Menjembatani Secangkir Kopi, Talenta Istimewa, dan Martabat Vokasi Disabilitas
> **A Public Narrative Product Engineering Case Study**
> *Sebuah Perjalanan Transformasi dari Belas Kasihan Menuju Kompetensi Berdaya Saing Tinggi Melalui Rekayasa Perangkat Lunak & Matematika Keputusan*

---

### 📌 Project Meta
- **Role:** Lead Full-Stack Engineer, Decision Systems Architect & Inclusive UX Designer
- **Stack:** Laravel 10 (Serverless Edge), React 18, Inertia.js, PostgreSQL (Supabase), Recharts, MCDM Engine (SAW, WP, TOPSIS)
- **Scale & Impact:** 65 Siswa Binaan, 11 SLB Percontohan, 11 Mitra Industri Kafe di 10 Kota Besar
- **Live Production URL:** [https://brewtech-v2.vercel.app](https://brewtech-v2.vercel.app)
- **Repository:** [github.com/roqueforti/brewtech-v2](https://github.com/roqueforti/brewtech-v2)

---

> *"Kemandirian seorang individu tidak lahir dari belas kasihan masyarakat, melainkan dari panggung kesempatan yang setara untuk membuktikan nilai karya mereka."*

---

## I. The Story of Self: Panggilan di Balik Aroma Biji Kopi

Pernahkah Anda memperhatikan apa yang terjadi ketika seorang anak dengan autisme atau disabilitas sensorik menyelesaikan masa sekolahnya di Sekolah Luar Biasa (SLB)? Di ruang kelas, mereka dihargai dan dilindungi. Namun begitu melangkah melewati gerbang kelulusan, mereka kerap berhadapan dengan tembok keheningan: dunia industri yang bingung bagaimana mempekerjakan mereka, dan masyarakat yang masih memandang mereka melalui kacamata belas kasihan (*charity model*), bukan kacamata kapasitas dan kapabilitas.

Kisah ini bermula dari perjumpaan saya dengan salah satu laboratorium kejuruan vokasi di Jawa Timur. Di sana, seorang siswa rungu bernama Arlando sedang menyeduh kopi manual (*pour-over* V60). Tangannya mantap menimbang air dengan rasio 1:15, matanya sangat jeli memperhatikan waktu *blooming*, dan perhatiannya terhadap kebersihan meja bar begitu presisi—jauh lebih teliti daripada kebanyakan orang biasa. Namun, sang guru pendamping bercerita dengan nada getir: 

> *"Pak, anak-anak kami punya tangan emas dan ketekunan luar biasa. Tapi kami bingung, ke kafe mana mereka bisa magang? Bagaimana cara meyakinkan pemilik kafe bahwa anak ini siap kerja?"*

Momen itulah yang mengubah cara pandang saya sebagai seorang *software engineer*. Selama ini, industri teknologi sering kali menghabiskan jutaan jam komputasi untuk mengoptimalkan klik iklan atau membuat algoritma yang memicu adiksi media sosial. **Mengapa kita tidak menggunakan keahlian rekayasa sistem yang sama untuk membangun jembatan peradaban yang memartabatkan manusia?**

Dari kegelisahan itulah, **BREWTECH** lahir. Tekad saya bulat: membangun platform SaaS terpadu yang bukan hanya mencatat nilai sekolah, melainkan sebuah ekosistem holistik yang menghubungkan pelatihan berbasis gamifikasi, algoritma pengambilan keputusan saintifik (SPK), mesin kasir komersial (POS), hingga transparansi penuh bagi orang tua.

---

## II. The Story of Us: Menjahit Harapan Empat Aktor Ekosistem

Sebuah perangkat lunak tidak akan berdaya jika hanya memecahkan masalah satu pihak secara terisolasi. Dalam ekosistem vokasi inklusif, ada empat aktor utama yang selama ini berjalan dalam pulau-pulau sunyi tanpa jembatan komunikasi:

```mermaid
flowchart TD
    A["🎓 Siswa Disabilitas<br/>(Belajar Gamifikasi & Bangun Portofolio)"] <--> B["🧑‍🏫 Guru Pendamping SLB<br/>(Observasi Karakter & Pantau Modul)"]
    B <--> C["⚖️ Engine SPK MCDM<br/>(Kalkulasi SAW, WP, TOPSIS)"]
    C <--> D["☕ Kafe Mitra Komersial<br/>(Kasir POS & Penempatan Magang)"]
    A <--> E["👨‍👩‍👧 Orang Tua / Wali<br/>(Pantau Riwayat & Rapor Mandiri)"]
    D <--> E
```

1. **Siswa dengan Ragam Disabilitas (*The Aspiring Talents*):** Siswa autisme, disabilitas sensorik netra/rungu, disabilitas intelektual, dan tunadaksa. Mereka membutuhkan antarmuka belajar visual, langkah instruksi yang terstruktur (*step-by-step*), sistem penguatan positif (*gamification badges*), serta aksesibilitas ramah neurodivergen.
2. **Guru & Instruktur Pendamping SLB (*The Dedicated Mentors*):** Pahlawan tanpa tanda jasa yang setiap hari membimbing siswa. Mereka membutuhkan instrumen evaluasi harian yang praktis untuk mencatat karakter (*soft skills*) tanpa terbebani administrasi manual yang rumit.
3. **Pengusaha Kafe Mitra Industri (*The Progressive Partners*):** Pelaku bisnis F&B yang sebenarnya memiliki itikad sosial tinggi untuk membuka lapangan kerja inklusif, namun dihantui rasa takut: *"Bagaimana bila operasional terganggu? Bagaimana jika terjadi salah takaran resep?"* Mereka memerlukan metrik kesiapan kerja yang transparan dan dapat dipertanggungjawabkan secara objektif.
4. **Orang Tua / Wali Murid (*The Hopeful Families*):** Pihak yang menanggung kecemasan terbesar: *"Bagaimana nasib anak saya kelak ketika saya sudah tiada?"* Mereka merindukan bukti nyata bahwa anak mereka mampu berdikari dan berkarya di tengah masyarakat.

![Landing Page Hero](doc_screenshots/01_landing_hero.png)
*Gambar 1: Halaman Depan Publik BREWTECH — Menghubungkan 65 Siswa Binaan, 11 SLB, dan 11 Kafe Mitra Nasional.*

---

## III. The Story of Now: Arsitektur Solusi & Implementasi Nyata

Saatnya telah tiba untuk menggantikan spekulasi dengan data, dan menggantikan keraguan dengan platform yang tangguh. Inilah bagaimana BREWTECH bekerja secara nyata, dari pintu masuk publik hingga ke mesin kasir kafe komersial:

### 3.1 Etalase Bakat Publik & Desain Aksesibilitas Universal
Langkah awal adalah meruntuhkan stigma di ruang publik. Halaman depan BREWTECH dirancang sebagai etalase prestisius yang menampilkan profil **"Top Talents"** barista binaan lengkap dengan asal sekolah SLB, kategori keahlian, dan indeks komputasi kesiapan kerja mereka.

Agar dapat diakses oleh semua ragam disabilitas, kami menyematkan **Accessibility Toolbar adaptif**:
- 🔊 **Text-to-Speech (TTS):** Membacakan isi teks untuk tunanetra atau *low-vision*.
- 🎨 **Filter Buta Warna:** Protanopia, Deuteranopia, Tritanopia, dan Monokromatik.
- 📖 **Font Ramah Disleksia:** Integrasi font khusus *OpenDyslexic*.
- 🔍 **Pembesar Kursor & Kontras Tinggi:** Mempermudah navigasi bagi motorik terbatas.

![Top Talents](doc_screenshots/02_landing_talents.png)
*Gambar 2: Bursa Talenta Unggul — Menampilkan Rekam Jejak dan Rekomendasi Akomodasi Kerja Siswa.*

![Galeri Pelatihan](doc_screenshots/03_landing_gallery.png)
*Gambar 3: Galeri Dokumentasi Praktik Brewing & Jaringan Kemitraan Ekosistem SLB se-Indonesia.*

---

### 3.2 Gamifikasi Belajar: Mengubah Rasa Takut Menjadi Lencana Prestasi
Bagi siswa dengan hambatan belajar, lembar soal konvensional sering kali memicu kecemasan kognitif. Pada portal pembelajaran siswa (`/student/dashboard`), kurikulum barista dipecah menjadi modul interaktif mikro (*micro-learning*). 

Siswa dipandu melalui simulasi visual tentang kalibrasi grinder, takaran espresso, sanitasi *steam wand*, hingga *hospitality* etika melayani tamu. Setiap ketuntasan modul dihadiahi lencana prestasi (*badges*) dan perolehan bintang yang menumbuhkan rasa percaya diri.

![Student LMS](doc_screenshots/21_student_dashboard.png)
*Gambar 4: Dashboard Pembelajaran Siswa — Desain Gamifikasi dengan Pelacakan Modul dan Lencana Bintang.*

![Quiz Simulation](doc_screenshots/08b_module_preview_quiz.png)
*Gambar 5: Pratinjau Kuis & Simulasi Soal Interaktif untuk Menakar Pemahaman Resep Barista.*

---

### 3.3 Penilaian Karakter Harian oleh Instruktur & Guru Pendamping
Keahlian meracik kopi (*hard skill*) hanyalah separuh dari keberhasilan kerja; separuh lainnya yang sangat krusial adalah karakter sosial (*soft skill*). Melalui portal instruktur (`/instructor/classes`), guru pendamping mengisi rubrik observasi berkala pada 5 indikator perilaku:
- Kedisiplinan & Ketepatan Waktu
- Higienitas & Kerapian Meja Bar
- Kerja Sama Tim & Adaptasi
- Komunikasi & Keramahan Pelanggan
- Inisiatif Mandiri

![Instructor Dashboard](doc_screenshots/19_instructor_dashboard.png)
*Gambar 6: Dashboard Instruktur — Memantau Kelas Binaan dan Siswa yang Membutuhkan Pendampingan Khusus.*

![Rubrik Soft Skill](doc_screenshots/20_instructor_classes.png)
*Gambar 7: Rubrik Observasi Soft Skills — Menangkap Dinamika Sikap dan Etika Kerja Lapangan.*

---

### 3.4 Engine SPK MCDM: Transparansi Sains Menggantikan Subjektivitas
Inilah jantung kecerdasan buatan dan diferensiasi teknologi BREWTECH. Kami menolak formula penilaian arbitrer dan mengintegrasikan Engine **Multi-Criteria Decision Making (MCDM)** formal dengan 3 model matematis teruji:

1. **SAW (Simple Additive Weighting):**
   $$V_i = \sum_{j=1}^n w_j \cdot r_{ij}$$
   Menormalisasi matriks skor ke skala relatif [0, 1] dan menghitung preferensi terbobot linier.
2. **WP (Weighted Product):**
   $$S_i = \prod_{j=1}^n x_{ij}^{w_j}, \quad V_i = \frac{S_i}{\sum S_k}$$
   Menggunakan perkalian eksponensial di mana tiap kriteria dipangkatkan dengan bobot terbobot, sangat selektif menyaring kandidat konsisten.
3. **TOPSIS (Ideal Solution Closeness):**
   $$C_i = \frac{D_i^-}{D_i^+ + D_i^-}$$
   Menghitung jarak geometri Euclidean menuju Solusi Ideal Positif ($A^+$) dan terjauh dari Solusi Ideal Negatif ($A^-$).

Pada antarmuka `/school/reports`, Admin Sekolah dapat membandingkan perankingan antar-metode secara instan melalui **Algorithm Switcher Tabs**. Tersedia juga tombol **"MATRIKS ILMIAH"** yang membuka transparansi komputasi: menampilkan Matriks Keputusan Asal ($X$), Matriks Ternormalisasi ($R/Y$), Vektor $S$ dan $V$, hingga koordinat Solusi Ideal $A^+/A^-$.

![SPK Reports](doc_screenshots/14_school_reports.png)
*Gambar 8: Laporan SPK MCDM Mutakhir — Tab Switcher Algoritma (SAW, WP, TOPSIS) dan Sebaran Analitik.*

![SPK Settings](doc_screenshots/15_school_spk.png)
*Gambar 9: Pengaturan Algoritma SPK — Fleksibilitas Penyesuaian Bobot 6 Kriteria Kejuruan (C1 - C6).*

---

### 3.5 Dari Rapor Sekolah Langsung ke Mesin Kasir Kafe (Point-of-Sale)
Bukti keberhasilan BREWTECH bermuara di meja bar kafe komersial. Pada Portal Admin Kafe (`/cafe/pos`), mitra industri seperti **Kafe Among Rasa** menggunakan sistem kasir POS layar sentuh yang dirancang responsif dan ramah disabilitas.

Ketika melayani pesanan kopi (Espresso, Latte, Matchabiyu), kasir dapat menetapkan siswa magang yang bertugas meracik minuman tersebut. Dengan demikian, setiap struk belanja pelanggan merekam jam terbang dan kontribusi nyata siswa barista. Data ini terakumulasi otomatis ke dalam portofolio digital mereka.

![Cafe Dashboard](doc_screenshots/16_cafe_dashboard.png)
*Gambar 10: Dashboard Kafe Mitra (Among Rasa) — Rekapitulasi Omzet Penjualan dan Monitoring Kinerja Magang.*

![POS Cashier](doc_screenshots/17_cafe_pos.png)
*Gambar 11: Aplikasi Kasir POS Layar Sentuh Inklusif — Mengintegrasikan Penjualan Riil dengan Jam Terbang Siswa.*

![Cafe Products](doc_screenshots/18_cafe_products.png)
*Gambar 12: Katalog Produk & Inventori Minuman — Manajemen Stok Bahan Baku dan HPP.*

---

### 3.6 Menghapus Kecemasan Keluarga: Dashboard Orang Tua & Tata Kelola Superadmin
Bagi orang tua, portal wali murid (`/parent/dashboard`) adalah ruang haru dan kepastian. Mereka dapat melihat catatan apresiasi guru, histori modul kopi yang telah dituntaskan sang buah hati, serta skor kesiapan kerja mereka menuju dunia industri.

Di tingkat nasional, Superadmin mengontrol tata kelola SLB dan Kafe seluruh provinsi, memvalidasi kurikulum modul, memonitor CMS landing page, serta memantau Audit Activity Logs untuk integritas keamanan data.

![Parent Dashboard](doc_screenshots/22_parent_dashboard.png)
*Gambar 13: Dashboard Orang Tua — Menyajikan Bukti Kemajuan dan Menumbuhkan Kebanggaan Keluarga.*

![Superadmin Dashboard](doc_screenshots/05_superadmin_dashboard.png)
*Gambar 14: Dashboard Superadmin Nasional — Pemantauan Agregat Sekolah, Kafe, dan Modul se-Indonesia.*

![Audit Logs](doc_screenshots/10_superadmin_logs.png)
*Gambar 15: Pusat Rekam Jejak & Audit Activity Logs untuk Menjamin Integritas Sistem.*

---

## IV. Kedalaman Rekayasa Teknologi (Engineering Highlights)

1. **Serverless PHP Edge Computing:** Berjalan pada Laravel 10 serverless di Vercel dengan penyesuaian temporary directory (`/tmp/storage`) untuk caching view dan sessions.
2. **Inertia.js + React 18:** Pengalaman pengguna Single-Page Application (SPA) yang sangat mulus tanpa *latency routing* REST API konvensional.
3. **PostgreSQL Cloud di Supabase (AWS eu-west-2):** Koneksi pooler PgBouncer port 6543 dengan optimasi adapter boolean `PostgresConnection` untuk mencegah diskrepansi casting tipe data.
4. **CI/CD Otomatis via GitHub Actions:** Pipeline migrasi database otomatis yang mengeksekusi 29 skema tabel dan data seeder secara remote tanpa downtime.
5. **Ekspor Rapor Formal (Excel & DomPDF):** Kemampuan men-generate laporan analitik berkas cetak siap pakai dalam hitungan detik untuk keperluan akreditasi.

---

## V. Refleksi & Call to Action: Masa Depan Vokasi Inklusif

BREWTECH membuktikan bahwa rekayasa perangkat lunak terbaik bukan tentang seberapa rumit kode yang ditulis, melainkan seberapa besar kehidupan manusia yang dapat dimartabatkan oleh kode tersebut.

Ketika seorang siswa autisme yang dulunya dicap tidak mampu kini dapat berdiri tegak di balik mesin espresso kafe komersial, menyajikan secangkir latte hangat dengan senyuman tulus, dan dinilai secara adil oleh algoritma sains—di situlah teknologi menemukan makna tertingginya.

> *"Teknologi yang inklusif bukan sekadar fitur tambahan (add-on), melainkan manifestasi dari keadilan sosial dalam bentuk baris-baris kode."*

Kini, sistem ini siap direplikasi ke ratusan SLB dan jejaring kafe lainnya di seluruh penjuru tanah air. Mari bersama-sama mengubah belas kasihan menjadi kesempatan nyata—satu tegukan kopi, satu talenta mandiri, satu kebanggaan Indonesia.
"""
    with open(MD_OUT, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"[OK] Markdown Portfolio saved to: {MD_OUT}")

if __name__ == "__main__":
    create_document()
    create_markdown()

