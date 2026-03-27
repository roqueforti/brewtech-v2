<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Module;
use App\Models\StudentSoftSkillEvaluation;
use App\Models\StudentModuleProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class EvaluationController extends Controller
{
    public function create($studentId, $moduleId)
    {
        $instructorId = Auth::id();
        
        $student = User::where('role', 'student')->findOrFail($studentId);
        $module = Module::with('softSkillCriteria')->findOrFail($moduleId);
        
        // Check if existing evaluation exists
        $existingEvals = StudentSoftSkillEvaluation::where('student_id', $studentId)
            ->where('module_id', $moduleId)
            ->get()
            ->keyBy('criteria_id');

        return Inertia::render('Instructor/Evaluate', [
            'student' => $student,
            'module' => $module,
            'existingEvaluations' => $existingEvals
        ]);
    }

    public function store(Request $request, $studentId, $moduleId)
    {
        $request->validate([
            'evaluations' => 'required|array',
            'evaluations.*.criteria_id' => 'required|exists:module_soft_skill_criteria,id',
            'evaluations.*.score' => 'required|numeric|min:0|max:100',
            'evaluations.*.observation_notes' => 'nullable|string',
        ]);

        $instructorId = Auth::id();

        foreach ($request->evaluations as $eval) {
            StudentSoftSkillEvaluation::updateOrCreate(
                [
                    'student_id' => $studentId, 
                    'module_id' => $moduleId,
                    'criteria_id' => $eval['criteria_id']
                ],
                [
                    'instructor_id' => $instructorId,
                    'score' => $eval['score'],
                    'observation_notes' => $eval['observation_notes'] ?? null
                ]
            );
        }
        
        // Also update module progress status to completed if not already
        $progress = StudentModuleProgress::where('student_id', $studentId)
            ->where('module_id', $moduleId)
            ->first();
            
        if ($progress && $progress->status !== 'completed') {
            $progress->update(['status' => 'completed']);
        }

        $student = User::find($studentId);
        
        if ($student && $student->kelas_id) {
            return redirect()->route('classes.show', $student->kelas_id)
                ->with('message', 'Evaluasi soft skill berhasil disimpan!');
        }

        return redirect()->route('instructor.students.show', $studentId)
            ->with('message', 'Evaluasi soft skill berhasil disimpan!');
    }
}
