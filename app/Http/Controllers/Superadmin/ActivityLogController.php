<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Count per role
        $roleStats = ActivityLog::join('users', 'activity_logs.user_id', '=', 'users.id')
            ->select('users.role', DB::raw('count(*) as total'))
            ->groupBy('users.role')
            ->get()
            ->map(fn($r) => ['role' => $r->role, 'total' => $r->total]);

        // Count per action type
        $actionStats = ActivityLog::select('action', DB::raw('count(*) as total'))
            ->groupBy('action')
            ->get()
            ->map(fn($a) => ['action' => $a->action, 'total' => $a->total]);

        // Overall total
        $totalLogs = ActivityLog::count();

        return Inertia::render('Superadmin/Logs', [
            'logs'        => $logs,
            'roleStats'   => $roleStats,
            'actionStats' => $actionStats,
            'totalLogs'   => $totalLogs,
        ]);
    }
}
