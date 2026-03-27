<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Cafe;
use App\Models\School; 
use App\Models\Module;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil Stats Dinamis
        $stats = [
            [
                'label' => 'Total Kafe',
                'value' => Cafe::count(),
                'icon' => 'Store',
                'color' => 'text-blue-600',
                'bg' => 'bg-blue-50',
                'trend' => '+' . Cafe::where('created_at', '>=', now()->subMonth())->count() . ' bln ini'
            ],
            [
                'label' => 'Mitra SLB',
                'value' => School::count(),
                'icon' => 'Building2',
                'color' => 'text-emerald-600',
                'bg' => 'bg-emerald-50',
                'trend' => 'Nasional'
            ],
            [
                'label' => 'Modul Aktif',
                'value' => Module::count(),
                'icon' => 'BookOpen',
                'color' => 'text-violet-600',
                'bg' => 'bg-violet-50',
                'trend' => Module::count() . ' Total Modul'
            ],
            [
                'label' => 'Siswa',
                'value' => User::where('role', 'student')->count(),
                'icon' => 'Users',
                'color' => 'text-orange-600',
                'bg' => 'bg-orange-50',
                'trend' => '+' . User::where('role', 'student')->where('created_at', '>=', now()->subMonth())->count() . ' baru'
            ],
        ];

        // 2. Ambil Aktivitas Terbaru (Gabungan Sekolah & Kafe)
        $recentCafes = Cafe::latest()->take(3)->get()->map(fn($item) => [
            'id' => 'c-'.$item->id,
            'user' => 'System', 
            'action' => 'mendaftarkan mitra kafe',
            'target' => $item->name,
            'time' => $item->created_at->diffForHumans(),
        ]);

        $recentSchools = School::latest()->take(2)->get()->map(fn($item) => [
            'id' => 's-'.$item->id,
            'user' => 'System', 
            'action' => 'mendaftarkan mitra SLB',
            'target' => $item->name,
            'time' => $item->created_at->diffForHumans(),
        ]);

        $recentActivities = $recentCafes->concat($recentSchools)->sortByDesc('time')->values();

        // 3. Data Grafik: Pertumbuhan 6 Bulan Terakhir
        // Menghasilkan array: ['month' => 'Jan', 'siswa' => 10, 'sekolah' => 2]
        $chartData = collect(range(5, 0))->map(function ($i) {
            $date = Carbon::now()->subMonths($i);
            return [
                'month' => $date->translatedFormat('M'),
                'siswa' => User::where('role', 'student')
                            ->whereMonth('created_at', $date->month)
                            ->whereYear('created_at', $date->year)->count(),
                'sekolah' => School::whereMonth('created_at', $date->month)
                            ->whereYear('created_at', $date->year)->count(),
            ];
        });

        return Inertia::render('Superadmin/Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'chartData' => $chartData
        ]);
    }

    /**
     * Fitur Ekspor PDF (Contoh Logic)
     */
    public function exportPdf()
    {
        // Anda perlu install: composer require barryvdh/laravel-dompdf
        $data = [
            'title' => 'Laporan Nasional Brewtech ' . date('Y'),
            'date' => date('d/m/Y'),
            'total_cafe' => Cafe::count(),
            'total_school' => School::count(),
            'total_student' => User::where('role', 'student')->count(),
        ];
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rekap_nasional', $data);
        return $pdf->download('rekap-nasional-brewtech.pdf');

        // return response()->json(['message' => 'Fungsi ekspor siap diimplementasikan dengan DomPDF']);
    }
}