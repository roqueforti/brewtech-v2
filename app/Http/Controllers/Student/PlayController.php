<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\StudentModuleProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PlayController extends Controller
{
    public function show($id)
    {
        $module = Module::with(['materials', 'questions.options'])->findOrFail($id);
        
        // Ensure student has access and start progress
        $student = Auth::user();
        $progress = StudentModuleProgress::firstOrCreate(
            ['student_id' => $student->id, 'module_id' => $module->id],
            ['status' => 'pre_test']
        );

        return Inertia::render('Student/Play', [
            'module' => $module,
            'progress' => $progress
        ]);
    }

    public function submitAnswer(Request $request, $id)
    {
        // Simple logic to just record score
        $request->validate([
            'type' => 'required|in:pre_test,post_test',
            'score' => 'required|numeric'
        ]);

        $student = Auth::user();
        $progress = StudentModuleProgress::firstOrCreate(
            ['student_id' => $student->id, 'module_id' => $id],
            ['status' => 'pre_test']
        );

        if ($request->type === 'pre_test') {
            $progress->pre_test_score = $request->score;
        } else {
            $progress->post_test_score = $request->score;
            $progress->status = 'completed'; // auto complete after post test
        }
        
        $progress->save();

        return redirect()->back()->with('message', 'Skor berhasil disimpan!');
    }

    public function finishPractice(Request $request, $id)
    {
        $student = Auth::user();
        $progress = StudentModuleProgress::firstOrCreate(
            ['student_id' => $student->id, 'module_id' => $id]
        );
        
        $progress->status = 'completed';
        $progress->save();

        return redirect()->route('student.dashboard')->with('message', 'Hore! Kamu telah menyelesaikan praktik ini!');
    }
}
