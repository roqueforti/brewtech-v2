<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function show(Request $request)
    {
        $parentId = Auth::id();
        $studentId = $request->query('student_id');

        if (!$studentId) {
            // Auto-detect if parent only has one child
            $children = User::where('role', 'student')->where('parent_id', $parentId)->get();
            if ($children->count() === 1) {
                return redirect()->route('parent.report.detail', ['student_id' => $children->first()->id]);
            }
            return redirect()->route('parent.dashboard')->with('error', 'Silakan pilih profil anak terlebih dahulu.');
        }

        $child = User::where('role', 'student')
            ->where('parent_id', $parentId)
            ->where('id', $studentId)
            ->with(['school', 'studentClass.modules', 'moduleProgresses.module', 'softSkillEvaluations.module', 'softSkillEvaluations.criteria'])
            ->firstOrFail();

        return Inertia::render('Parent/ReportDetail', [
            'child' => $child,
            'modules' => $child->studentClass ? $child->studentClass->modules : [],
            'progress' => $child->moduleProgresses,
            'evaluations' => $child->softSkillEvaluations
        ]);
    }

    public function downloadReport(Request $request)
    {
        $parentId = Auth::id();
        $studentId = $request->query('student_id');

        if (!$studentId) {
            // Auto-detect if parent only has one child
            $children = User::where('role', 'student')->where('parent_id', $parentId)->get();
            if ($children->count() === 1) {
                $studentId = $children->first()->id;
            } else {
                return redirect()->route('parent.dashboard')->with('error', 'ID Siswa diperlukan untuk mengunduh rapor.');
            }
        }

        $child = User::where('role', 'student')
            ->where('parent_id', $parentId)
            ->where('id', $studentId)
            ->with(['school', 'studentClass.modules', 'moduleProgresses.module', 'softSkillEvaluations'])
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.rapor_summary', [
            'child' => $child,
            'modules' => $child->studentClass ? $child->studentClass->modules : [],
            'progress' => $child->moduleProgresses,
            'evaluations' => $child->softSkillEvaluations
        ]);
        
        $pdf->setPaper('a4', 'portrait');
        
        return $pdf->download('Rapor_Belajar_'.$child->name.'.pdf');
    }

    public function downloadModuleCertificate($studentId, $moduleId)
    {
        $parentId = Auth::id();
        
        $child = User::where('role', 'student')
            ->where('parent_id', $parentId)
            ->where('id', $studentId)
            ->firstOrFail();

        $module = \App\Models\Module::findOrFail($moduleId);
        
        $progress = \App\Models\StudentModuleProgress::where('user_id', $studentId)
            ->where('module_id', $moduleId)
            ->where('status', 'completed')
            ->firstOrFail();

        $softSkills = \App\Models\SoftSkillEvaluation::where('user_id', $studentId)
            ->where('module_id', $moduleId)
            ->get();
            
        $avgSoftSkill = $softSkills->count() > 0 ? $softSkills->avg('score') : null;

        $pdf = Pdf::loadView('pdf.module_certificate', [
            'child' => $child,
            'module' => $module,
            'progress' => $progress,
            'avgSoftSkill' => $avgSoftSkill
        ]);
        
        $pdf->setPaper('a4', 'landscape');
        
        return $pdf->download('Sertifikat_Modul_'.$module->title.'_'.$child->name.'.pdf');
    }
}
