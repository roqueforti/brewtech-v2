<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $parent = Auth::user();
        
        // Fetch children (students related to this parent)
        $children = User::where('role', 'student')
            ->where('parent_id', $parent->id)
            ->with(['school', 'studentClass.modules', 'moduleProgresses'])
            ->get()
            ->map(function ($child) {
                // Calculate quick stats - Only count modules assigned to their class
                $classModuleIds = $child->studentClass ? $child->studentClass->modules->pluck('id')->toArray() : [];
                
                $completed = $child->moduleProgresses
                    ->where('status', 'completed')
                    ->whereIn('module_id', $classModuleIds)
                    ->count();
                
                $total = count($classModuleIds);
                $progressPercentage = $total > 0 ? round(($completed / $total) * 100) : 0;
                
                $avgScore = $child->moduleProgresses->avg('post_test_score') ?? 0;

                return [
                    'id' => $child->id,
                    'name' => $child->name,
                    'school_name' => $child->school->name ?? 'Belum ada sekolah',
                    'class_name' => $child->studentClass->name ?? 'Belum ada kelas',
                    'progress_percentage' => $progressPercentage,
                    'average_score' => round($avgScore)
                ];
            });

        return Inertia::render('Parent/Dashboard', [
            'children' => $children
        ]);
    }
}
