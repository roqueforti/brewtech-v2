<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        $student = Auth::user();
        $student->load(['studentClass.modules', 'moduleProgresses', 'softSkillEvaluations.module', 'softSkillEvaluations.criteria']);

        return Inertia::render('Student/Report', [
            'student' => $student,
            'progress' => $student->moduleProgresses,
            'evaluations' => $student->softSkillEvaluations,
            'modules' => $student->studentClass ? $student->studentClass->modules : []
        ]);
    }
}
