<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudyClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function show($id)
    {
        $instructorId = Auth::id();
        
        // Ensure student belongs to a class taught by this instructor
        $student = User::where('role', 'student')
            ->where('id', $id)
            ->with(['school', 'studentClass.modules'])
            ->firstOrFail();
            
        // Check if student's class is taught by the current instructor
        if ($student->studentClass && $student->studentClass->instructor_id !== $instructorId) {
             abort(403, 'Unauthorized action.');
        }

        // Get progress & evaluations
        $progress = $student->moduleProgresses()->with('module')->get();
        $evaluations = $student->softSkillEvaluations()->with(['module', 'criteria'])->get();

        return Inertia::render('Instructor/StudentDetail', [
            'student' => $student,
            'progress' => $progress,
            'evaluations' => $evaluations
        ]);
    }
}
