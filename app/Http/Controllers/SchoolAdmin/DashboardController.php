<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\StudyClass;

class DashboardController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;

        $stats = [
            'totalClasses' => StudyClass::where('school_id', $schoolId)->count(),
            'totalInstructors' => User::where('school_id', $schoolId)->where('role', 'instructor')->count(),
            'totalStudents' => User::where('school_id', $schoolId)->where('role', 'student')->count(),
            'readyForPKL' => User::where('school_id', $schoolId)->where('role', 'student')->where('ready_for_pkl', true)->count(),
        ];

        return inertia('SchoolAdmin/Dashboard', compact('stats'));
    }
}