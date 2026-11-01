<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\School;
use App\Services\SpkEngine;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SpkResultsExport;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        $schoolInfo = School::findOrFail($schoolId);

        // Metode SPK yang diminta (fallback ke setting sekolah atau 'saw')
        $requestedMethod = $request->query('method', $schoolInfo->spk_method ?? 'saw');

        $analysis = $this->getAdvancedSpkAnalysis($schoolId, $schoolInfo, $requestedMethod);

        return Inertia::render('SchoolAdmin/Reports', [
            'spkAnalysis'     => $analysis,
            'spkResults'      => $analysis['ranking'],
            'schoolInfo'      => $schoolInfo,
            'currentMethod'   => $requestedMethod,
            'availableMethods' => [
                'saw'    => 'Simple Additive Weighting (SAW)',
                'wp'     => 'Weighted Product (WP)',
                'topsis' => 'TOPSIS (Closeness to Ideal)',
            ],
        ]);
    }

    private function getAdvancedSpkAnalysis($schoolId, $schoolInfo, string $method)
    {
        $students = User::where('role', 'student')
            ->where('school_id', $schoolId)
            ->with(['studentClass', 'parent', 'moduleProgresses', 'softSkillEvaluations.criteria'])
            ->get();

        $candidates = [];

        foreach ($students as $student) {
            $hardScore = $student->moduleProgresses->where('status', 'completed')->avg('post_test_score');
            if ($hardScore === null || $hardScore == 0) {
                // Estimasi dari pre-test atau default baseline kompetensi jika modul sedang berjalan
                $hardScore = $student->moduleProgresses->avg('pre_test_score') ?: 70.0;
            }

            // Ekstrak skor per kriteria soft skill
            $softEvals = $student->softSkillEvaluations;

            $getCriteriaScore = function($keyword) use ($softEvals) {
                $filtered = $softEvals->filter(function($e) use ($keyword) {
                    $cName = strtolower($e->criteria->criteria_name ?? '');
                    return str_contains($cName, strtolower($keyword));
                });
                return $filtered->count() > 0 ? (float) $filtered->avg('score') : null;
            };

            $avgSoftOverall = $softEvals->count() > 0 ? (float) $softEvals->avg('score') : 75.0;

            $c2Discipline    = $getCriteriaScore('disiplin') ?? $avgSoftOverall;
            $c3Cleanliness   = $getCriteriaScore('bersih') ?? $avgSoftOverall;
            $c4Teamwork      = $getCriteriaScore('sama') ?? $avgSoftOverall;
            $c5Communication = $getCriteriaScore('komunikasi') ?? $avgSoftOverall;
            $c6Initiative    = $getCriteriaScore('inisiatif') ?? $avgSoftOverall;

            $candidates[] = [
                'id' => $student->id,
                'student' => (object) [
                    'id'              => $student->id,
                    'name'            => $student->name,
                    'disability_type' => $student->disability_type ?? 'Umum',
                    'class'           => $student->studentClass,
                    'parent'          => $student->parent,
                ],
                'scores' => [
                    'c1_hardskill'     => round($hardScore, 1),
                    'c2_discipline'    => round($c2Discipline, 1),
                    'c3_cleanliness'   => round($c3Cleanliness, 1),
                    'c4_teamwork'      => round($c4Teamwork, 1),
                    'c5_communication' => round($c5Communication, 1),
                    'c6_initiative'    => round($c6Initiative, 1),
                ],
            ];
        }

        // Bobot kustom dari database sekolah jika ada
        $customWeights = $schoolInfo->spk_criteria_weights ?? [];

        return SpkEngine::analyze($candidates, $customWeights, $method);
    }

    public function export(Request $request)
    {
        $format = $request->get('format', 'excel');
        $method = $request->get('method', 'saw');
        $schoolId = auth()->user()->school_id;
        $schoolInfo = School::findOrFail($schoolId);

        $analysis = $this->getAdvancedSpkAnalysis($schoolId, $schoolInfo, $method);
        $spkResults = $analysis['ranking'];

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.spk-report', compact('spkResults', 'schoolInfo', 'analysis'));
            return $pdf->download('laporan-spk-sekolah.pdf');
        }

        return Excel::download(new SpkResultsExport($spkResults), 'laporan-spk-sekolah.xlsx');
    }
}
