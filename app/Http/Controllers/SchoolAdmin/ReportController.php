<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\School;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SpkResultsExport;

class ReportController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;
        $schoolInfo = School::findOrFail($schoolId);

        $spkResults = $this->getCalculatedSpkResults($schoolId, $schoolInfo);

        return Inertia::render('SchoolAdmin/Reports', compact('spkResults', 'schoolInfo'));
    }

    private function getCalculatedSpkResults($schoolId, $schoolInfo)
    {
        $students = User::where('role', 'student')
            ->where('school_id', $schoolId)
            ->with(['studentClass', 'parent', 'moduleProgresses', 'softSkillEvaluations'])
            ->get();

        return $students->map(function($student) use ($schoolInfo) {
            $hardSkillScore = $student->moduleProgresses->where('status', 'completed')->avg('post_test_score') ?? 0;
            $softSkillScore = $student->softSkillEvaluations->avg('score') ?? 0;

            $hardWeight = ($schoolInfo->spk_hard_skill_weight ?? 70) / 100;
            $softWeight = ($schoolInfo->spk_soft_skill_weight ?? 30) / 100;
            
            $finalScore = ($hardSkillScore * $hardWeight) + ($softSkillScore * $softWeight);

            return (object) [
                'id' => $student->id,
                'student' => (object) [
                    'name' => $student->name,
                    'disability_type' => $student->disability_type,
                    'class' => $student->studentClass,
                    'parent' => $student->parent
                ],
                'hard_skill_score' => round($hardSkillScore, 1),
                'soft_skill_score' => round($softSkillScore, 1),
                'final_score' => round($finalScore, 1),
                'kategori_spk' => $this->getKategoriSpk($finalScore)
            ];
        });
    }

    private function getKategoriSpk($score)
    {
        if ($score >= 80) return 'Siap Praktek Kerja (magang)';
        if ($score >= 65) return 'Perlu Pendampingan';
        return 'Perlu Pelatihan Lanjutan';
    }

    public function export(Request $request)
    {
        $format = $request->get('format', 'excel');
        $schoolId = auth()->user()->school_id;
        $schoolInfo = School::findOrFail($schoolId);

        $spkResults = $this->getCalculatedSpkResults($schoolId, $schoolInfo);

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.spk-report', compact('spkResults', 'schoolInfo'));
            return $pdf->download('laporan-spk-sekolah.pdf');
        }

        return Excel::download(new SpkResultsExport($spkResults), 'laporan-spk-sekolah.xlsx');
    }
}