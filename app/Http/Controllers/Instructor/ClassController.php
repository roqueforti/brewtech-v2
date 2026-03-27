<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\StudyClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClassController extends Controller
{
    public function index()
    {
        $instructorId = Auth::id();
        
        // Fetch classes assigned to the instructor with students and modules
        $classes = StudyClass::where('instructor_id', $instructorId)
            ->with(['students' => function ($query) {
                // Eager load progress for students
                $query->with('moduleProgresses');
            }, 'modules'])
            ->get();

        return Inertia::render('Instructor/MyClasses', [
            'classes' => $classes
        ]);
    }
}
