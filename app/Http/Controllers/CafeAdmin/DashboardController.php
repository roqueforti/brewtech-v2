<?php

namespace App\Http\Controllers\CafeAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $cafe = Auth::user()->cafe;
        
        // Simple aggregate stats
        $totalProducts = Product::where('cafe_id', Auth::user()->cafe_id ?? 1)->count();
        $totalTransactions = Transaction::where('cafe_id', Auth::user()->cafe_id ?? 1)->count();
        $totalTalents = User::where('role', 'student')
            ->whereHas('moduleProgresses', function ($q) {
                $q->where('status', 'completed');
            })->count();

        // Fetch Last 7 Days Revenue
        $sevenDaysAgo = Carbon::now()->subDays(6)->startOfDay();
        $revenueRaw = Transaction::where('cafe_id', $cafe->id ?? 1)
            ->where('tipe', 'debit')
            ->where('tanggal', '>=', $sevenDaysAgo->format('Y-m-d'))
            ->selectRaw('tanggal, SUM(nominal) as total, SUM(cogs) as total_cogs')
            ->groupBy('tanggal')
            ->orderBy('tanggal', 'asc')
            ->get()
            ->keyBy('tanggal');

        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $dateString = Carbon::now()->subDays($i)->format('Y-m-d');
            $shortDate = Carbon::now()->subDays($i)->locale('id')->translatedFormat('d M');
            
            $rev = isset($revenueRaw[$dateString]) ? (int) $revenueRaw[$dateString]->total : 0;
            $cogs = isset($revenueRaw[$dateString]) ? (int) $revenueRaw[$dateString]->total_cogs : 0;

            $chartData[] = [
                'name' => $shortDate,
                'pv' => $rev,                     // Revenue (Omset)
                'profit' => max(0, $rev - $cogs)  // Profit (Laba Bersih)
            ];
        }

        // Recent Transactions list
        $recentTransactions = Transaction::where('cafe_id', $cafe->id ?? 1)
            ->orderBy('tanggal', 'desc')
            ->orderBy('id', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('CafeAdmin/Dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalTransactions' => $totalTransactions,
                'totalTalents' => $totalTalents,
            ],
            'chartData' => $chartData,
            'recentTransactions' => $recentTransactions
        ]);
    }
}
