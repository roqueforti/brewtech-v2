<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudyClass;
use App\Models\User;
use App\Models\Module;
use Inertia\Inertia;

class ClassRoomController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;

        $classes = StudyClass::with('instructor')->withCount('students', 'adoptedModules')->where('school_id', $schoolId)->get();
        $instructors = User::where('school_id', $schoolId)->where('role', 'instructor')->get();

        return Inertia::render('SchoolAdmin/ClassManager', compact('classes', 'instructors'));
    }

    public function show(StudyClass $class)
    {
        if ($class->school_id !== auth()->user()->school_id) {
            abort(403);
        }

        $class->load(['instructor', 'students.moduleProgresses', 'students.softSkillEvaluations', 'modules']);
        
        $allModules = Module::orderBy('order')->get();
        
        // Enhance students with aggregated stats
        $class->students->each(function($student) {
            $student->avg_hardskill = round($student->moduleProgresses->where('status', 'completed')->avg('post_test_score') ?? 0, 1);
            $student->avg_softskill = round($student->softSkillEvaluations->avg('score') ?? 0, 1);
            $student->completed_modules = $student->moduleProgresses->where('status', 'completed')->count();
        });

        // Calculate some basic stats for the class
        $stats = [
            'avg_hardskill' => round($class->students->avg('avg_hardskill') ?? 0, 1),
            'avg_softskill' => round($class->students->avg('avg_softskill') ?? 0, 1),
            'avg_progress' => round(($class->students->avg(function($student) use ($allModules) {
                $total = $allModules->count();
                return $total > 0 ? ($student->completed_modules / $total) * 100 : 0;
            }) ?? 0), 1),
        ];

        return Inertia::render('SchoolAdmin/ClassDetail', [
            'class' => $class,
            'allModules' => $allModules,
            'stats' => $stats,
            'is_instructor' => auth()->id() === $class->instructor_id
        ]);
    }

    public function toggleModule(Request $request, StudyClass $class)
    {
        if ($class->school_id !== auth()->user()->school_id) {
            abort(403);
        }

        $request->validate([
            'module_id' => 'required|exists:modules,id',
        ]);

        $class->modules()->toggle($request->module_id);

        return redirect()->back()->with('message', 'Kurikulum kelas diperbarui!');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'emoji_icon' => 'required|string',
            'instructor_id' => 'required|exists:users,id',
        ]);

        StudyClass::create([
            'name' => $request->name,
            'emoji_icon' => $request->emoji_icon,
            'instructor_id' => $request->instructor_id,
            'school_id' => auth()->user()->school_id,
        ]);

        return redirect()->back()->with('message', 'Kelas berhasil dibuat!');
    }

    public function update(Request $request, StudyClass $class)
    {
        if ($class->school_id !== auth()->user()->school_id) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'emoji_icon' => 'required|string',
            'instructor_id' => 'required|exists:users,id',
        ]);

        $class->update([
            'name' => $request->name,
            'emoji_icon' => $request->emoji_icon,
            'instructor_id' => $request->instructor_id,
        ]);

        return redirect()->back()->with('message', 'Kelas berhasil diperbarui!');
    }

    public function destroy(StudyClass $class)
    {
        if ($class->school_id !== auth()->user()->school_id) {
            abort(403);
        }

        $class->delete();

        return redirect()->back()->with('message', 'Kelas berhasil dihapus!');
    }
}