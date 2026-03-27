<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;

// ==========================================
// HALAMAN DEPAN & AUTENTIKASI UMUM
// ==========================================
Route::get('/', function () {
    // Stats
    $stats = [
        'total_siswa' => \App\Models\User::where('role', 'student')->count(),
        'jumlah_modul' => \App\Models\Module::count(),
        'jumlah_sekolah' => \App\Models\School::count(),
        'jumlah_kafe' => \App\Models\Cafe::count(),
    ];

    // Top Talents (berdasarkan modul yang diselesaikan terbanyak)
    $topTalents = \App\Models\User::where('role', 'student')
        ->whereHas('moduleProgresses', function($q) {
            $q->where('status', 'completed');
        })
        ->with(['school', 'moduleProgresses' => function($q) {
            $q->where('status', 'completed');
        }])
        ->get()
        ->sortByDesc(function($user) {
            return $user->moduleProgresses->count();
        })
        ->take(4)
        ->map(function($user) {
            $completedCount = $user->moduleProgresses->count();
            // Estimate a score based on real progress
            $skor = min(100, $completedCount * 20); 
            $predikat = $completedCount >= 5 ? 'Coffee Master' : ($completedCount >= 3 ? 'Barista Expert' : 'Barista Junior');

            return [
                'name' => $user->name,
                'sekolah' => $user->school->name ?? 'Sekolah Umum',
                'disabilitas' => $user->disability_type ?? 'Tidak spesifik',
                'skor' => $skor,
                'predikat' => $predikat,
            ];
        })->values();

    // Evidences (Dynamic from DB if available, fallback to empty array if no real evidence framework is built yet)
    $evidences = [];

    // Kelas From DB
    $kelasFromDB = \App\Models\StudyClass::with('students')->get()->map(function($class) {
        return [
            'id' => $class->id,
            'nama' => $class->name,
            'emoji' => $class->emoji_icon,
            'school_id' => $class->school_id,
            'students' => $class->students->map(fn($s) => ['id' => $s->id, 'name' => $s->name]),
        ];
    });

    // Schools
    $schools = \App\Models\School::all()->map(function($school) {
        return [
            'id'      => $school->id,
            'name'    => $school->name,
            'address' => $school->address,
        ];
    });

    // Cafes
    $cafes = \App\Models\Cafe::all()->map(function($cafe) {
        return [
            'id'   => $cafe->id,
            'name' => $cafe->name,
            'city' => $cafe->city ?? $cafe->address ?? '-',
        ];
    });

    // Landing Page Assets (CMS)
    $landingAssets = \App\Models\LandingPageAsset::where('is_active', true)
        ->orderBy('order')
        ->get()
        ->map(function($asset) {
            $asset->full_image_url = $asset->image_path ? asset(ltrim($asset->image_path, '/')) : null;
            return $asset;
        })
        ->groupBy('type');

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'stats' => $stats,
        'topTalents' => $topTalents,
        'evidences' => $evidences,
        'landingAssets' => $landingAssets,
        'kelasFromDB' => $kelasFromDB,
        'schools' => $schools,
        'cafes'   => $cafes,
        'performanceData' => [
            // Pertumbuhan siswa 6 bulan terakhir
            'monthlyGrowth' => collect(range(5, 0))->map(function($i) {
                $date = \Carbon\Carbon::now()->subMonths($i);
                return [
                    'bulan' => $date->translatedFormat('M'),
                    'siswa' => \App\Models\User::where('role', 'student')
                        ->whereMonth('created_at', $date->month)
                        ->whereYear('created_at', $date->year)->count(),
                    'sekolah' => \App\Models\School::whereMonth('created_at', $date->month)
                        ->whereYear('created_at', $date->year)->count(),
                ];
            })->values(),
            // Tingkat penyelesaian modul
            'completionRate' => (function() {
                $total = \App\Models\StudentModuleProgress::count();
                $done  = \App\Models\StudentModuleProgress::where('status', 'completed')->count();
                return $total > 0 ? round(($done / $total) * 100) : 0;
            })(),
            // Distribusi jenis disabilitas
            'disabilityBreakdown' => \App\Models\User::where('role', 'student')
                ->whereNotNull('disability_type')
                ->selectRaw('disability_type, count(*) as total')
                ->groupBy('disability_type')
                ->get()
                ->map(fn($r) => ['label' => $r->disability_type, 'value' => $r->total])
                ->values(),
            // Jangkauan provinsi (estimasi dari sekolah)
            'totalProvinsi' => \App\Models\School::selectRaw('DISTINCT province')->count(),
        ],
    ]);
});

// Login Spesifik Siswa (Tanpa Password, via Modal)
Route::post('/login/student', [\App\Http\Controllers\Auth\StudentLoginController::class, 'store'])->name('login.student');

// ==========================================
// RUTE TERPROTEKSI (HARUS LOGIN)
// ==========================================
Route::middleware('auth')->group(function () {
    
    // Profil Bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ==========================================
    // 1. PANEL SUPERADMIN (Pusat Kendali)
    // ==========================================
Route::middleware(['auth', 'role:superadmin'])->prefix('superadmin')->name('superadmin.')->group(function () {
    
    // UBAH INI: Arahkan ke Controller, jangan langsung render view
    Route::get('/dashboard', [\App\Http\Controllers\Superadmin\DashboardController::class, 'index'])->name('dashboard');

    // TAMBAHKAN INI: Rute untuk Ekspor PDF
    Route::get('/export-pdf', [\App\Http\Controllers\Superadmin\DashboardController::class, 'exportPdf'])->name('export.pdf');

    // Manajemen Mitra
    Route::resource('schools', \App\Http\Controllers\Superadmin\SchoolController::class);
    Route::resource('cafes', \App\Http\Controllers\Superadmin\CafeController::class);

    // Master Modul Builder
    Route::resource('modules', \App\Http\Controllers\Superadmin\MasterModuleController::class);
    Route::post('modules/{module}/materials', [\App\Http\Controllers\Superadmin\MaterialController::class, 'store'])->name('modules.materials.store');
    Route::post('modules/{module}/questions', [\App\Http\Controllers\Superadmin\QuestionController::class, 'store'])->name('modules.questions.store');
    Route::post('modules/{module}/criteria', [\App\Http\Controllers\Superadmin\CriteriaController::class, 'store'])->name('modules.criteria.store');

    // Global Activity Logs
    Route::get('/activity-logs', [\App\Http\Controllers\Superadmin\ActivityLogController::class, 'index'])->name('logs.index');

    // CMS Landing Page
    Route::get('/cms', [\App\Http\Controllers\Superadmin\CmsController::class, 'index'])->name('cms.index');
    Route::post('/cms', [\App\Http\Controllers\Superadmin\CmsController::class, 'store'])->name('cms.store');
    Route::post('/cms/{asset}/update', [\App\Http\Controllers\Superadmin\CmsController::class, 'update'])->name('cms.update');
    Route::patch('/cms/{asset}', [\App\Http\Controllers\Superadmin\CmsController::class, 'update']);
    Route::delete('/cms/{asset}', [\App\Http\Controllers\Superadmin\CmsController::class, 'destroy'])->name('cms.destroy');
});

    // ==========================================
    // 2. PANEL ADMIN SEKOLAH (Guru Utama)
    // ==========================================
    Route::middleware('role:school_admin')->prefix('school')->name('school.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\SchoolAdmin\DashboardController::class, 'index'])->name('dashboard');

        // Manajemen Internal Sekolah
        Route::resource('users', \App\Http\Controllers\SchoolAdmin\UserController::class);
        Route::get('/users-manager', [\App\Http\Controllers\SchoolAdmin\UserController::class, 'index'])->name('users.manager');
        Route::get('/users/export/{type}', [\App\Http\Controllers\SchoolAdmin\UserController::class, 'export'])->name('users.export');
        Route::post('/users/import', [\App\Http\Controllers\SchoolAdmin\UserController::class, 'import'])->name('users.import');
        Route::get('/classes/{class}', [\App\Http\Controllers\SchoolAdmin\ClassRoomController::class, 'show'])->name('classes.show');
        Route::post('/classes/{class}/toggle-module', [\App\Http\Controllers\SchoolAdmin\ClassRoomController::class, 'toggleModule'])->name('classes.toggle_module');
        Route::resource('classes', \App\Http\Controllers\SchoolAdmin\ClassRoomController::class)->except(['show']);
        
        // Adopsi Kurikulum Nasional ke Sekolah
        Route::get('/curriculum', [\App\Http\Controllers\SchoolAdmin\CurriculumController::class, 'index'])->name('curriculum.index');
        Route::post('/curriculum/adopt', [\App\Http\Controllers\SchoolAdmin\CurriculumController::class, 'adopt'])->name('curriculum.adopt');

        // SPK & Rapor
        Route::get('/reports', [\App\Http\Controllers\SchoolAdmin\ReportController::class, 'index'])->name('reports.index');
        Route::get('/spk-settings', [\App\Http\Controllers\SchoolAdmin\SpkController::class, 'edit'])->name('spk.settings');
        Route::put('/spk-settings', [\App\Http\Controllers\SchoolAdmin\SpkController::class, 'update'])->name('spk.update');
    });

    // ==========================================
    // 3. PANEL PELATIH / INSTRUKTUR
    // ==========================================
    Route::middleware('role:instructor')->prefix('instructor')->name('instructor.')->group(function () {
        Route::get('/dashboard', function () { return Inertia::render('Instructor/Dashboard'); })->name('dashboard');
        
        // Kelas dan Siswa
        Route::get('/my-classes', [\App\Http\Controllers\Instructor\ClassController::class, 'index'])->name('classes.index');
        Route::get('/students/{student}', [\App\Http\Controllers\Instructor\StudentController::class, 'show'])->name('students.show');

        // Evaluasi Soft Skill Observasi Praktik
        Route::get('/evaluate/{student}/{module}', [\App\Http\Controllers\Instructor\EvaluationController::class, 'create'])->name('evaluate.create');
        Route::post('/evaluate/{student}/{module}', [\App\Http\Controllers\Instructor\EvaluationController::class, 'store'])->name('evaluate.store');
    });

    // Shared Routes: Detail & Manajemen Kurikulum Kelas (Accessible by School Admin and Instructor of the class)
    Route::get('/classes/{class}', [\App\Http\Controllers\SchoolAdmin\ClassRoomController::class, 'show'])->name('classes.show');
    Route::post('/classes/{class}/toggle-module', [\App\Http\Controllers\SchoolAdmin\ClassRoomController::class, 'toggleModule'])->name('classes.toggle_module');

    // ==========================================
    // 4. AKSESIBILITAS SISWA (Gamification Mode)
    // ==========================================
    Route::middleware('role:student')->prefix('play')->name('student.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
        
        // Alur Belajar & Kuis Interaktif
        Route::get('/modules/{module}', [\App\Http\Controllers\Student\PlayController::class, 'show'])->name('modules.play');
        Route::post('/modules/{module}/answer', [\App\Http\Controllers\Student\PlayController::class, 'submitAnswer'])->name('modules.answer');
        Route::post('/modules/{module}/finish-practice', [\App\Http\Controllers\Student\PlayController::class, 'finishPractice'])->name('modules.finish_practice');

        // Rapor & Lencana
        Route::get('/my-report', [\App\Http\Controllers\Student\ReportController::class, 'index'])->name('report.index');
    });

    // ==========================================
    // 5. PANEL WALI MURID (Read-Only)
    // ==========================================
    Route::middleware('role:parent')->prefix('parent')->name('parent.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Parent\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/report-detail', [\App\Http\Controllers\Parent\ReportController::class, 'show'])->name('report.detail');
        Route::get('/report/download', [\App\Http\Controllers\Parent\ReportController::class, 'downloadReport'])->name('report.download');
        Route::get('/certificate/module/{student}/{module}', [\App\Http\Controllers\Parent\ReportController::class, 'downloadModuleCertificate'])->name('certificate.module.download');
    });

    // ==========================================
    // 6. PANEL ADMIN KAFE (Mitra Industri)
    // ==========================================
    Route::middleware('role:cafe_admin')->prefix('cafe')->name('cafe.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\CafeAdmin\DashboardController::class, 'index'])->name('dashboard');

        // Sistem POS & Menu
        Route::resource('products', \App\Http\Controllers\CafeAdmin\ProductController::class);
        Route::get('/pos', [\App\Http\Controllers\CafeAdmin\PosController::class, 'index'])->name('pos.index');
        Route::post('/pos/checkout', [\App\Http\Controllers\CafeAdmin\PosController::class, 'checkout'])->name('pos.checkout');
        
        // Transaksi & Laporan
        Route::get('/transactions', [\App\Http\Controllers\CafeAdmin\TransactionController::class, 'index'])->name('transactions.index');
        Route::post('/transactions', [App\Http\Controllers\CafeAdmin\TransactionController::class, 'store'])->name('transactions.store');
        Route::get('/transactions/export', [App\Http\Controllers\CafeAdmin\TransactionController::class, 'export'])->name('transactions.export');
        Route::post('/transactions/import', [App\Http\Controllers\CafeAdmin\TransactionController::class, 'import'])->name('transactions.import');
        Route::delete('/transactions/{transaction}', [\App\Http\Controllers\CafeAdmin\TransactionController::class, 'destroy'])->name('transactions.destroy');
        Route::delete('/transactions-all', [\App\Http\Controllers\CafeAdmin\TransactionController::class, 'destroyAll'])->name('transactions.destroyAll');
        // Bursa Kerja (Hilirisasi)
        Route::get('/talent-pool', [\App\Http\Controllers\CafeAdmin\TalentPoolController::class, 'index'])->name('talent_pool.index');
    });

});

// Autentikasi Bawaan
require __DIR__.'/auth.php';