<?php

namespace App\Http\Controllers\CafeAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\SpkResult;

class TalentPoolController extends Controller
{
    public function index()
    {
        // Get all students sorted by their completed modules / performance as a mock talent pool
        $talents = User::where('role', 'student')
            ->with(['school', 'moduleProgresses', 'softSkillEvaluations'])
            ->get()
            ->map(function ($student) {
                $hardSkillScore = $student->moduleProgresses->where('status', 'completed')->avg('post_test_score') ?? 0;
                $softSkillScore = $student->softSkillEvaluations->avg('score') ?? 0;
                
                // Fallback to 40/60 weight if school not specified
                $hardWeight = ($student->school->spk_hard_skill_weight ?? 40) / 100;
                $softWeight = ($student->school->spk_soft_skill_weight ?? 60) / 100;
                
                $spk_score = round(($hardSkillScore * $hardWeight) + ($softSkillScore * $softWeight), 1);
                
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'school' => $student->school->name ?? 'Sekolah Umum',
                    'disability_type' => $student->disability_type,
                    'modules_completed' => $student->moduleProgresses->where('status', 'completed')->count(),
                    'spk_score' => $spk_score,
                    'ready_for_pkl' => $student->ready_for_pkl ?? ($spk_score >= 80),
                    'recommendation' => $spk_score >= 80 ? 'Siap Praktek Kerja (magang)' : ($spk_score >= 65 ? 'Perlu Pendampingan' : 'Perlu Pelatihan Lanjutan')
                ];
            })
            ->sortByDesc('spk_score')
            ->values();

        return Inertia::render('CafeAdmin/TalentPool', [
            'talents' => $talents
        ]);
    }
}
