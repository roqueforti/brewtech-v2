import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

SCREENSHOTS_DIR = r"d:\PAL\brewtech\doc_screenshots"
OUTPUT_FILE = r"d:\PAL\brewtech\Dokumen_Overview_dan_Panduan_Aplikasi_BREWTECH.docx"

doc = Document()

# Set standard margins (0.75 inch)
for section in doc.sections:
    section.top_margin = Inches(0.75)
    section.bottom_margin = Inches(0.75)
    section.left_margin = Inches(0.8)
    section.right_margin = Inches(0.8)

# Color constants
C_NAVY = RGBColor(15, 23, 42)      # #0F172A
C_PRIMARY = RGBColor(2, 132, 199)  # #0284C7
C_PINK = RGBColor(236, 72, 153)    # #EC4899
C_MUTED = RGBColor(100, 116, 139)  # #64748B
C_DARK = RGBColor(30, 41, 59)      # #1E293B

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_header(title, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.keep_with_next = True
    if level == 1:
        p.paragraph_format.space_before = Pt(22)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(title)
        r.font.name = "Montserrat"
        r.font.size = Pt(17)
        r.bold = True
        r.font.color.rgb = C_NAVY
    elif level == 2:
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(title)
        r.font.name = "Montserrat"
        r.font.size = Pt(13.5)
        r.bold = True
        r.font.color.rgb = C_PRIMARY
    elif level == 3:
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(title)
        r.font.name = "Montserrat"
        r.font.size = Pt(11.5)
        r.bold = True
        r.font.color.rgb = C_DARK
    return p

def add_body(text, bold_prefix="", space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.bold = True
        r_pre.font.name = "Montserrat"
        r_pre.font.size = Pt(10.5)
        r_pre.font.color.rgb = C_DARK
    r_body = p.add_run(text)
    r_body.font.name = "Montserrat"
    r_body.font.size = Pt(10.5)
    r_body.font.color.rgb = C_DARK
    return p

def add_bullet(bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    r_pre = p.add_run(bold_prefix)
    r_pre.bold = True
    r_pre.font.name = "Montserrat"
    r_pre.font.size = Pt(10)
    r_pre.font.color.rgb = C_DARK
    r_txt = p.add_run(text)
    r_txt.font.name = "Montserrat"
    r_txt.font.size = Pt(10)
    r_txt.font.color.rgb = C_DARK
    return p

def add_callout(text, title="CATATAN PENTING"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.rows[0].cells[0]
    cell.width = Inches(6.5)
    set_cell_background(cell, "F0F9FF")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>\n'
        f'  <w:left w:val="single" w:sz="24" w:space="0" w:color="0284C7"/>\n'
        f'  <w:top w:val="none"/>\n'
        f'  <w:right w:val="none"/>\n'
        f'  <w:bottom w:val="none"/>\n'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    run_t = p.add_run(f"📌 {title}: ")
    run_t.bold = True
    run_t.font.name = "Montserrat"
    run_t.font.size = Pt(10)
    run_t.font.color.rgb = C_PRIMARY
    
    run_body = p.add_run(text)
    run_body.font.name = "Montserrat"
    run_body.font.size = Pt(9.5)
    run_body.font.color.rgb = C_DARK
    
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(4)

def add_screenshot(filename, caption):
    img_path = os.path.join(SCREENSHOTS_DIR, filename)
    if not os.path.exists(img_path):
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)
    
    run = p.add_run()
    run.add_picture(img_path, width=Inches(6.2))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(2)
    p_cap.paragraph_format.space_after = Pt(12)
    r_cap = p_cap.add_run(f"Tangkapan Layar: {caption}")
    r_cap.italic = True
    r_cap.font.name = "Montserrat"
    r_cap.font.size = Pt(9)
    r_cap.font.color.rgb = C_MUTED

# ==========================================
# 1. COVER PAGE
# ==========================================
p_cov_sp = doc.add_paragraph()
p_cov_sp.paragraph_format.space_before = Pt(40)

# Tagline pill
p_pill = doc.add_paragraph()
p_pill.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_pill = p_pill.add_run("INCLUSIVE VOCATIONAL EDUCATION & COMMERCIAL ECOSYSTEM")
r_pill.font.name = "Montserrat"
r_pill.font.size = Pt(10)
r_pill.bold = True
r_pill.font.color.rgb = C_PRIMARY

# Title
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_before = Pt(10)
p_title.paragraph_format.space_after = Pt(8)
r_title = p_title.add_run("PANDUAN & OVERVIEW SISTEM\nAPLIKASI BREWTECH")
r_title.font.name = "Montserrat"
r_title.font.size = Pt(26)
r_title.bold = True
r_title.font.color.rgb = C_NAVY

# Subtitle
p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_sub.paragraph_format.space_after = Pt(30)
r_sub = p_sub.add_run("Platform SaaS Pendidikan Vokasi Disabilitas Terintegrasi, Penilaian SPK Kesiapan Kerja, Kasir POS Kafe Mitra, dan Portal Pemantauan Multi-Peran")
r_sub.font.name = "Montserrat"
r_sub.font.size = Pt(12)
r_sub.font.color.rgb = C_MUTED

# Meta Card Table
t_meta = doc.add_table(rows=6, cols=2)
t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
t_meta.autofit = False

meta_data = [
    ("Nama Platform", "BREWTECH (The Cup We Share)"),
    ("Versi Sistem", "v2.0 Production (Serverless + PostgreSQL)"),
    ("Alamat Produksi Live", "https://brewtech-v2.vercel.app"),
    ("Infrastruktur Backend", "PHP 8.3 Serverless (Vercel) + Supabase PostgreSQL (AWS eu-west-2)"),
    ("Infrastruktur Frontend", "Inertia.js React 18, Vite, Tailwind CSS, Lucide Icons"),
    ("Tanggal Terbit Dokumen", "November 2026")
]

for idx, (label, val) in enumerate(meta_data):
    cell_lbl = t_meta.rows[idx].cells[0]
    cell_val = t_meta.rows[idx].cells[1]
    cell_lbl.width = Inches(2.2)
    cell_val.width = Inches(4.3)
    
    set_cell_background(cell_lbl, "F1F5F9" if idx % 2 == 0 else "FFFFFF")
    set_cell_background(cell_val, "F8FAFC" if idx % 2 == 0 else "FFFFFF")
    set_cell_margins(cell_lbl, top=80, bottom=80, left=120, right=120)
    set_cell_margins(cell_val, top=80, bottom=80, left=120, right=120)
    
    p_l = cell_lbl.paragraphs[0]
    p_l.paragraph_format.space_before = Pt(2)
    p_l.paragraph_format.space_after = Pt(2)
    r_l = p_l.add_run(label)
    r_l.bold = True
    r_l.font.name = "Montserrat"
    r_l.font.size = Pt(10)
    r_l.font.color.rgb = C_DARK
    
    p_v = cell_val.paragraphs[0]
    p_v.paragraph_format.space_before = Pt(2)
    p_v.paragraph_format.space_after = Pt(2)
    r_v = p_v.add_run(val)
    r_v.font.name = "Montserrat"
    r_v.font.size = Pt(10)
    r_v.font.color.rgb = C_NAVY if "http" not in val else C_PRIMARY
    if "http" in val:
        r_v.bold = True

doc.add_page_break()

# ==========================================
# 2. BAB I: PENDAHULUAN & ARSITEKTUR SISTEM
# ==========================================
add_header("BAB I: PENDAHULUAN & ARSITEKTUR SISTEM", level=1)

add_body("BREWTECH adalah platform perangkat lunak berbasis layanan (Software-as-a-Service / SaaS) yang dirancang secara khusus untuk mengatasi kesenjangan antara dunia pendidikan khusus (Sekolah Luar Biasa / SLB) dan industri kerja komersial (Food & Beverage / Kafe). Melalui pendekatan vokasi terintegrasi, Brewtech memberdayakan siswa penyandang disabilitas (Autisme, Disabilitas Sensorik Netra/Rungu, Disabilitas Intelektual, dan Fisik) agar memperoleh keterampilan profesional sebagai barista dan tenaga kerja kafe yang mandiri.")

add_header("1.1 Empat Pilar Utama Ekosistem Brewtech", level=2)
add_bullet("1. LMS Vokasi Berbasis Gamifikasi: ", "Kurikulum pelatihan barista berstandar industri dengan materi visual, video, dan kuis interaktif yang ramah aksesibilitas neurodivergen.")
add_bullet("2. Sistem Pendukung Keputusan (SPK) MCDM Mutakhir: ", "Engine Multi-Criteria Decision Making komprehensif yang mengimplementasikan 3 algoritma ilmiah formal (Simple Additive Weighting / SAW, Weighted Product / WP, dan TOPSIS) berbasis 6 kriteria kejuruan (C1 Teknis Barista, C2 Kedisiplinan, C3 Higienitas Bar, C4 Kerja Sama Tim, C5 Komunikasi Tamu, C6 Inisiatif) dengan transparansi matriks kalkulasi penuh.")
add_bullet("3. Hilirisasi Industri & Kasir POS Kafe: ", "Modul kasir Point-of-Sale (POS) terintegrasi pada Kafe Mitra (seperti Kafe Among Rasa di Malang serta mitra kafe di 10 regional kota besar) yang menjadi wadah kerja nyata siswa.")
add_bullet("4. Portal Wali Murid Transparan: ", "Transparansi penuh bagi orang tua/wali untuk memantau kehadiran, progres materi, catatan harian instruktur, dan perkembangan psikososial anak.")

add_header("1.2 Arsitektur Teknologi Modern", level=2)
add_body("Aplikasi ini dibangun menggunakan arsitektur cloud serverless modern yang mengedepankan performa tinggi, waktu muat instan, dan skalabilitas tinggi:")

add_bullet("Backend Framework: ", "Laravel 10 running pada runtime serverless PHP 8.3 dengan optimasi penyimpanan sementara /tmp/storage untuk kompatibilitas edge serverless.")
add_bullet("Frontend Architecture: ", "Inertia.js dengan React 18 dan Vite. Pendekatan ini memberikan pengalaman Single-Page Application (SPA) yang sangat mulus tanpa memerlukan REST API overhead yang lambat.")
add_bullet("Database Engine: ", "PostgreSQL 15 di Supabase (AWS eu-west-2) yang diakses melalui pooler Supavisor/PgBouncer port 6543 dengan adapter khusus PostgresConnection untuk konsistensi tipe data boolean.")
add_bullet("Otomasi CI/CD: ", "GitHub Actions Workflow (.github/workflows/supabase-migrate.yml) yang mengotomasi seluruh migrasi skema tabel (28 tabel) dan pengisian data uji (seeder) secara remote dan terkontrol.")
add_bullet("Keamanan & Autentikasi: ", "Password dienkripsi menggunakan Bcrypt (cost 12), Role-Based Access Control (RBAC) 6 level, proteksi Session Cookie, dan penanganan auto-redirect cerdas.")

add_header("1.3 Inovasi Standar Terbaik (Best-Case) Platform Vokasi Inklusif", level=2)
add_body("Untuk mencapai standar terbaik (gold standard) sebuah platform teknologi asistif pendidikan vokasi disabilitas, BREWTECH mengimplementasikan empat pilar keunggulan unik:")
add_bullet("1. Bilah Aksesibilitas Inklusif (A11y Suite): ", "Tersedia tombol aksesibilitas mengambang (floating ♿) yang dapat diakses dari halaman publik maupun portal pengguna. Menyediakan pengaturan ukuran teks instan (Normal, A+, A++), Mode Kontras Tinggi untuk siswa low-vision, Spasi Ramah Disleksia (perenggangan huruf & kata), dan asisten suara Text-to-Speech (TTS) Bahasa Indonesia.")
add_bullet("2. Bursa Talenta Terintegrasi Rekomendasi Akomodasi: ", "Mitra kafe tidak hanya melihat nilai SPK, namun memperoleh panduan akomodasi kerja spesifik sesuai ragam disabilitas (Autisme, Netra, Rungu, Intelektual, Fisik), serta tombol hubungi guru pembimbing sekolah secara langsung via WhatsApp.")
add_bullet("3. Kasir POS Berbasis Siswa Magang: ", "Pada sistem POS kasir kafe, staf kasir dapat memilih siswa barista magang yang bertugas meracik minuman, sehingga setiap transaksi terhubung langsung dengan portofolio dan jam terbang nyata siswa.")
add_bullet("4. Rapor & Sertifikasi Kompetensi Terverifikasi: ", "Setiap pencapaian modul menghasilkan sertifikat kompetensi digital yang siap diunduh orang tua dalam format landscape profesional lengkap dengan skor uji teori (Pre/Post Test) dan evaluasi observasi praktik instruktur.")

add_callout("Seluruh infrastruktur telah berhasil di-deploy dan berjalan aktif tanpa kendala di Vercel Production dengan domain https://brewtech-v2.vercel.app dan terhubung langsung ke basis data Supabase PostgreSQL.", "STATUS OPERASIONAL SISTEM")

doc.add_page_break()

# ==========================================
# 3. BAB II: STRUKTUR PERAN & HAK AKSES (RBAC)
# ==========================================
add_header("BAB II: STRUKTUR PERAN & HAK AKSES PENGGUNA", level=1)
add_body("Sistem Brewtech membagi hak akses ke dalam 6 tingkatan peran pengguna yang saling terhubung dalam satu pintu ekosistem:")

table_roles = doc.add_table(rows=7, cols=4)
table_roles.alignment = WD_TABLE_ALIGNMENT.CENTER
table_roles.autofit = False

col_widths = [Inches(1.2), Inches(1.8), Inches(1.2), Inches(2.3)]
headers = ["Peran", "Akun Email Demo", "Password", "Cakupan Hak Akses & Dashboard"]

for i, h in enumerate(headers):
    cell = table_roles.rows[0].cells[i]
    cell.width = col_widths[i]
    set_cell_background(cell, "0284C7")
    set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
    p = cell.paragraphs[0]
    r = p.add_run(h)
    r.bold = True
    r.font.name = "Montserrat"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(255, 255, 255)

roles_data = [
    ("Superadmin", "superadmin@brewtech.id", "password123", "Dashboard Nasional, CRUD SLB & Mitra Kafe seluruh provinsi, Master Builder Kurikulum Modul, Audit Logs, CMS Banner Landing Page."),
    ("Admin Sekolah", "admin@slbypacmalang.sch.id", "password123", "Dashboard Sekolah SLB YPAC, Manajemen Siswa, Orang Tua, Guru Pendamping, Manajemen Kelas Vokasi, SPK Settings, Rapor Siswa."),
    ("Instruktur / Guru", "lilikkurniyatispdgr@instructor.com", "password123", "Dashboard Pelatih, Manajemen Kelas Binaan, Form Penilaian Rubrik Soft Skills Harian Siswa, Tracking Modul Siswa."),
    ("Admin Kafe", "admin@amongrasa.com", "password123", "Dashboard Kafe Among Rasa, Sistem Kasir POS (Point of Sale), Manajemen Menu & Stok Bahan, Rekapitulasi Penjualan Harian/Bulanan."),
    ("Siswa (Student)", "arlandomalanesiawaran@student.com", "password123", "Dashboard Belajar Siswa (Gamifikasi), Materi Brewing Interaktif, Simulasi Kuis, Poin/Skor dan Status Kesiapan PKL."),
    ("Orang Tua / Wali", "veronikaworabay@parent.com", "password123", "Dashboard Wali Murid, Monitoring Progres Ketuntasan Modul Anak, Evaluasi Karakter/Soft Skill dari Instruktur, Unduh Rapor.")
]

for row_idx, r_data in enumerate(roles_data, start=1):
    row_cells = table_roles.rows[row_idx].cells
    bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
    for col_idx in range(4):
        c = row_cells[col_idx]
        c.width = col_widths[col_idx]
        set_cell_background(c, bg)
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.1
        r = p.add_run(r_data[col_idx])
        r.font.name = "Montserrat"
        r.font.size = Pt(8.5)
        if col_idx == 0:
            r.bold = True
            r.font.color.rgb = C_PRIMARY
        elif col_idx == 2:
            r.bold = True
            r.font.color.rgb = C_NAVY
        else:
            r.font.color.rgb = C_DARK

add_body("Catatan: Untuk kelancaran demonstrasi langsung, sistem autentikasi menerima password 'password123' maupun 'password' secara fleksibel pada seluruh akun di atas.", space_after=12)

doc.add_page_break()

# ==========================================
# 4. BAB III: DAFTAR MENU, FITUR, DAN SCREENSHOT
# ==========================================
add_header("BAB III: DAFTAR MENU, FITUR & DOKUMENTASI SCREENSHOT", level=1)
add_body("Berikut adalah panduan detail setiap antarmuka halaman, menu fungsional, dan tangkapan layar langsung dari aplikasi produksi Brewtech:")

# 3.1 Landing Page
add_header("3.1 Halaman Depan Publik (Landing Page)", level=2)
add_body("Halaman depan Brewtech berfungsi sebagai etalase publik dan pintu masuk utama sistem yang responsif dan inklusif.")
add_bullet("Fitur Hero Banner Dinamis: ", "Menampilkan pesan misi vokasi terpadu dengan carousel gambar resolusi tinggi yang dikelola melalui modul CMS Superadmin.")
add_bullet("Statistik Realtime Nasional: ", "Menampilkan total 65 siswa binaan, 11 SLB percontohan, 11 Kafe Mitra, dan 4 modul kurikulum yang terhubung langsung ke basis data.")
add_screenshot("01_landing_hero.png", "Halaman Utama Publik (Hero Banner & Statistik Realtime Nasional)")

add_bullet("Section Top Talents (Lulusan Terbaik): ", "Menampilkan 4 siswa berprestasi tertinggi hasil komputasi SPK (seperti Xavier Anarghyaza, Juliam Rutin Putra, Shintya Ayu Rizki, Dauz) lengkap dengan asal sekolah, kategori disabilitas, skor, dan predikat keahlian.")
add_screenshot("02_landing_talents.png", "Section Profil Top Talents Barista Berprestasi Berdasarkan SPK")

add_bullet("Ekosistem & Galeri Dokumentasi: ", "Menampilkan jaringan kemitraan sekolah SLB di berbagai provinsi serta foto dokumentasi pelatihan praktik brewing barista di lapangan.")
add_screenshot("03_landing_gallery.png", "Galeri Dokumentasi & Jaringan Kemitraan Ekosistem SLB Nasional")

# 3.2 Halaman Autentikasi
add_header("3.2 Antarmuka Autentikasi / Login Portal", level=2)
add_body("Brewtech menyediakan dua jalur masuk: Login Cepat Siswa (Quick Student Login) dari dropdown kelas di halaman depan tanpa mengetik password untuk kemudahan disabilitas motorik, serta Halaman Login Mandiri untuk Pengurus dan Mitra.")
add_screenshot("04_login_page.png", "Halaman Login Mandiri (Standalone Login Portal)")

# 3.3 Superadmin Portal
add_header("3.3 Portal Superadmin Nasional", level=2)
add_body("Superadmin memegang kendali tata kelola seluruh sistem Brewtech di tingkat nasional.")
add_bullet("Dashboard Ringkasan Eksekutif: ", "Menampilkan metrik kafe, SLB, modul aktif, grafik pertumbuhan bulanan, serta audit aktivitas pengguna secara langsung.")
add_screenshot("05_superadmin_dashboard.png", "Dashboard Utama Superadmin Nasional")

add_bullet("Manajemen Mitra SLB (/superadmin/schools): ", "Fitur tambah, perbarui, dan pantau seluruh profil Sekolah Luar Biasa di seluruh wilayah Indonesia.")
add_screenshot("06_superadmin_schools.png", "Menu Manajemen Mitra Sekolah Luar Biasa (SLB)")

add_bullet("Manajemen Mitra Kafe (/superadmin/cafes): ", "Pusat pendataan kafe komersial yang bersedia menjadi mitra magang dan kerja bagi talenta barista disabilitas.")
add_screenshot("07_superadmin_cafes.png", "Menu Manajemen Jaringan Mitra Kafe Vokasi")

add_bullet("Master Kurikulum Modul (/superadmin/modules): ", "Penyusunan modul berjenjang dari Tingkat Dasar hingga Ahli, lengkap dengan materi pembelajaran, butir kuis, dan rubrik kriteria soft skill.")
add_screenshot("08_superadmin_modules.png", "Menu Master Builder Modul Pelatihan Barista (Materi, Soal Kuis & Soft Skill)")
add_screenshot("08b_module_preview_quiz.png", "Pratinjau Modul & Soal Kuis Interaktif (Pre-Test/Post-Test) dengan Bantuan Suara Otomatis TTS")

add_bullet("CMS Landing Page (/superadmin/cms): ", "Pengelolaan banner promosi, galeri foto, teks headline, dan file unduhan aplikasi mobile (PWA/APK/IPA).")
add_screenshot("09_superadmin_cms.png", "Menu CMS Manajemen Konten Halaman Depan")

add_bullet("Audit Trail / Activity Logs (/superadmin/activity-logs): ", "Perekaman jejak digital menyeluruh (login, pembuatan data, modifikasi, penghapusan) beserta alamat IP dan perangkat pengakses demi keamanan data.")
add_screenshot("10_superadmin_logs.png", "Pusat Audit Trail & Log Aktivitas Sistem")

# 3.4 School Admin Portal
add_header("3.4 Portal Admin Sekolah (SLB YPAC Kota Malang & Mitra)", level=2)
add_body("Admin Sekolah berwenang mengelola operasional pelatihan kejuruan internal di masing-masing satuan pendidikan SLB.")
add_bullet("Dashboard Kesiapan Kerja: ", "Menyajikan statistik total siswa, rasio siswa yang telah berstatus 'Ready for PKL' berdasarkan kalkulasi SPK, serta grafik progres kelas.")
add_screenshot("11_school_dashboard.png", "Dashboard Admin Sekolah (SLB YPAC Kota Malang)")

add_bullet("Manajemen Pengguna Internal (/school/users): ", "Pendataan akun siswa, relasi dengan akun wali murid, serta penugasan guru pendamping/instruktur.")
add_screenshot("12_school_users.png", "Menu Manajemen Siswa, Orang Tua, dan Guru Pendamping")

add_bullet("Manajemen Kelas Vokasi (/school/classes): ", "Pembuatan rombongan belajar (rombel) pelatihan barista (misal: 'The Cup We Share') dan alokasi kurikulum modul yang aktif dipelajari.")
add_screenshot("13_school_classes.png", "Menu Manajemen Rombongan Belajar Kelas Vokasi")

add_bullet("Rapor & Rekomendasi Penyaluran (/school/reports): ", "Laporan komparasi capaian siswa berbasis Multi-Criteria Decision Making (MCDM) canggih dengan switch multi-algoritma (SAW, WP, TOPSIS), visualisasi matriks ilmiah (Matriks X, Normalisasi R, Matriks Terbobot Y, Solusi Ideal A+/A-), serta ekspor rekapitulasi data ke format Excel dan PDF.")
add_screenshot("14_school_reports.png", "Menu Rekapitulasi Rapor & Rekomendasi Penempatan Siswa Berbasis MCDM")

add_bullet("Engine Algoritma & Pengaturan Bobot SPK (/school/spk-settings): ", "Konfigurasi engine ilmiah SPK: pemilihan model matematis utama (SAW, WP, atau TOPSIS), penyesuaian bobot 6 kriteria kejuruan barista (C1 Teknis Seduh, C2 Kedisiplinan, C3 Higienitas Bar, C4 Kerja Sama Tim, C5 Komunikasi, C6 Inisiatif), serta pengaturan rasio makro teknis vs sosial.")
add_screenshot("15_school_spk.png", "Engine Algoritma & Pengaturan Bobot Kriteria SPK Vokasi Inklusif")

# 3.5 Cafe Admin & POS Portal
add_header("3.5 Portal Admin Kafe & Kasir POS (Among Rasa)", level=2)
add_body("Mitra industri kafe menggunakan Brewtech untuk operasional kasir sekaligus mempekerjakan barista lulusan vokasi secara inklusif.")
add_bullet("Dashboard Penjualan Kafe: ", "Menampilkan grafik omzet harian, jumlah transaksi, produk terlaris, dan performa barista yang bertugas.")
add_screenshot("16_cafe_dashboard.png", "Dashboard Manajemen Bisnis Kafe Mitra")

add_bullet("Aplikasi Kasir POS (Point of Sale) (/cafe/pos): ", "Antarmuka kasir layar sentuh yang cepat dan ramah disabilitas untuk memproses pesanan minuman (Espresso, Latte, Matchabiyu, Choco Latte), kalkulasi diskon, dan cetak struk.")
add_screenshot("17_cafe_pos.png", "Sistem Kasir Point-of-Sale (POS) Inklusif")

add_bullet("Katalog Produk & Inventori Menu (/cafe/products): ", "Pengaturan harga jual, harga pokok penjualan (HPP), serta stok bahan baku minuman.")
add_screenshot("18_cafe_products.png", "Menu Pengelolaan Katalog Produk & Stok Bahan Minuman")

# 3.6 Instructor Portal
add_header("3.6 Portal Instruktur & Guru Pendamping", level=2)
add_body("Guru pembimbing menggunakan portal ini untuk mengamati dan mengevaluasi perilaku serta perkembangan harian siswa.")
add_bullet("Dashboard Pelatih: ", "Daftar kelas yang dibina dan daftar siswa yang memerlukan pendampingan khusus.")
add_screenshot("19_instructor_dashboard.png", "Dashboard Pendampingan Instruktur")

add_bullet("Kelas Binaan & Penilaian Rubrik: ", "Pengisian form observasi berkala terhadap indikator soft skill (sikap kerja, kebersihan meja bar, interaksi dengan pelanggan, penanganan alat brewing).")
add_screenshot("20_instructor_classes.png", "Menu Kelas Binaan & Evaluasi Soft Skills")

# 3.7 Student Portal
add_header("3.7 Portal Pembelajaran Siswa (Gamification LMS)", level=2)
add_body("Portal siswa didesain dengan konsep gamifikasi menarik agar memotivasi siswa disabilitas dalam belajar tanpa rasa tertekan.")
add_bullet("Alur Modul Interaktif: ", "Materi interaktif langkah demi langkah teknik meracik kopi, pengenalan mesin espresso, sanitasi, dan hospitality yang disertai lencana penghargaan (badges) dan perolehan bintang.")
add_screenshot("21_student_dashboard.png", "Dashboard Gamifikasi Pembelajaran Siswa Barista")

# 3.8 Parent Portal
add_header("3.8 Portal Orang Tua / Wali Murid", level=2)
add_body("Portal khusus bagi wali murid untuk melihat buah perjuangan dan bakat anak mereka secara nyata.")
add_bullet("Monitoring Perkembangan Karakter: ", "Melihat catatan apresiasi dari instruktur sekolah, histori pengerjaan modul, serta kesiapan sang anak untuk mulai melangkah ke dunia kerja mandiri.")
add_screenshot("22_parent_dashboard.png", "Dashboard Transparansi Pemantauan Orang Tua")

doc.add_page_break()

# ==========================================
# 5. BAB IV: PANDUAN SKENARIO DEMO APLIKASI
# ==========================================
add_header("BAB IV: PANDUAN SKENARIO DEMONSTRASI (DEMO FLOW)", level=1)
add_body("Untuk memberikan impresi presentasi yang kuat dan profesional kepada penguji, mitra industri, atau investor, ikuti alur demonstrasi 5 menit berikut:")

add_body("Langkah 1: Tampilkan Halaman Depan Publik (1 Menit)", bold_prefix="1. Pembukaan: ")
add_bullet("Buka URL: ", "https://brewtech-v2.vercel.app")
add_bullet("Jelaskan Visi: ", "Perkenalkan Brewtech sebagai platform SaaS vokasi disabilitas pertama yang menghubungkan SLB ke industri kafe nyata.")
add_bullet("Tunjukkan Bukti Realtime: ", "Sorot angka statistik realtime (65 Siswa, 11 Sekolah, 11 Kafe) dan 4 profil Top Talents barista binaan.")

add_body("Langkah 2: Demonstrasikan Portal Sekolah SLB (1.5 Menit)", bold_prefix="2. Pengelolaan Vokasi & SPK: ")
add_bullet("Login Akun: ", "admin@slbypacmalang.sch.id / password123")
add_bullet("Tunjukkan Dashboard: ", "Sorot grafik rasio siswa 'Ready for PKL' yang dihitung secara otomatis oleh algoritma SPK.")
add_bullet("Buka Menu SPK Settings: ", "Perlihatkan transparansi pembobotan hard skill (40%) dan soft skill (60%).")

add_body("Langkah 3: Tunjukkan Hilirisasi ke Kafe Mitra & POS (1.5 Menit)", bold_prefix="3. Hilirisasi Industri Kafe: ")
add_bullet("Buka Menu Kasir: ", "Login admin@amongrasa.com / password123 -> masuk menu Kasir POS.")
add_bullet("Simulasi Transaksi: ", "Pilih menu 'Matchabiyu' atau 'Kopi Susu Gula Aren', klik bayar, dan tunjukkan kemudahan antarmuka kasir bagi barista berkebutuhan khusus.")

add_body("Langkah 4: Tunjukkan Portal Siswa & Wali Murid (1 Menit)", bold_prefix="4. Penutup & Dampak Sosial: ")
add_bullet("Login Siswa: ", "Perlihatkan tampilan gamifikasi modul barista yang ramah disabilitas.")
add_bullet("Login Orang Tua: ", "Tunjukkan transparansi catatan instruktur yang menumbuhkan rasa bangga dan optimisme masa depan anak.")

doc.add_page_break()

# ==========================================
# 6. BAB V: KESIMPULAN & TAUTAN RESMI
# ==========================================
add_header("BAB V: KESIMPULAN & TAUTAN RESMI", level=1)
add_body("Aplikasi BREWTECH v2.0 telah berhasil dibangun, dimigrasi, dan diuji secara komprehensif di lingkungan cloud produksi. Dengan terwujudnya integrasi antara platform pembelajaran inklusif, sistem pendukung keputusan kesiapan kerja, serta modul POS komersial kafe, Brewtech siap menjadi pionir hilirisasi vokasi disabilitas berdaya saing tinggi di Indonesia.")

add_callout(
    "Website Produksi: https://brewtech-v2.vercel.app\n"
    "Repositori Kode: https://github.com/roqueforti/brewtech-v2\n"
    "Basis Data: Supabase PostgreSQL (Managed Supavisor Pooler)\n"
    "Deployment Host: Vercel Edge Serverless Global Infrastructure",
    "TAUTAN DAN INFORMASI SISTEM"
)

# Save document
doc.save(OUTPUT_FILE)
print(f"DOCUMENT SAVED SUCCESSFULLY: {OUTPUT_FILE}")

