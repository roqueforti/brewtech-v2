<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        $student = Auth::user();
        $student->load(['studentClass.modules', 'moduleProgresses', 'softSkillEvaluations.module', 'softSkillEvaluations.criteria']);

        $modules = collect();
        if ($student->studentClass && $student->studentClass->modules()->exists()) {
            $modules = $student->studentClass->modules;
        }
        if ($modules->isEmpty()) {
            $modules = Module::orderBy('id')->get();
        }

        return Inertia::render('Student/Report', [
            'student' => $student,
            'progress' => $student->moduleProgresses,
            'evaluations' => $student->softSkillEvaluations,
            'modules' => $modules
        ]);
    }
}
