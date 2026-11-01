<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use App\Services\SpkEngine;
use Inertia\Inertia;

class SpkController extends Controller
{
    public function edit()
    {
        $schoolId = auth()->user()->school_id;
        $schoolInfo = School::findOrFail($schoolId);

        $defaultCriteria = SpkEngine::getDefaultCriteria();
        $customWeights = $schoolInfo->spk_criteria_weights ?? [];

        // Gabungkan default criteria dengan saved weights
        $criteria = [];
        foreach ($defaultCriteria as $key => $c) {
            $criteria[$key] = [
                'code' => $c['code'],
                'name' => $c['name'],
                'type' => $c['type'],
                'weight' => isset($customWeights[$key]) ? (float) $customWeights[$key] : $c['weight'],
                'description' => $c['description'],
            ];
        }

        return Inertia::render('SchoolAdmin/SpkSettings', [
            'schoolInfo' => $schoolInfo,
            'criteria' => $criteria,
            'currentMethod' => $schoolInfo->spk_method ?? 'saw',
            'availableMethods' => [
                'saw' => [
                    'id' => 'saw',
                    'name' => 'Simple Additive Weighting (SAW)',
                    'short' => 'SAW',
                    'tagline' => 'Penjumlahan Terbobot Linear',
                    'description' => 'Metode paling transparan dan intuitif, menormalisasi skala kriteria secara proporsional.',
                ],
                'wp' => [
                    'id' => 'wp',
                    'name' => 'Weighted Product (WP)',
                    'short' => 'WP',
                    'tagline' => 'Perkalian Eksponensial Terbobot',
                    'description' => 'Metode non-linear menggunakan pemangkatan bobot, sangat objektif untuk seleksi kompetensi ketat.',
                ],
                'topsis' => [
                    'id' => 'topsis',
                    'name' => 'TOPSIS (Closeness to Ideal)',
                    'short' => 'TOPSIS',
                    'tagline' => 'Jarak Relatif Solusi Ideal',
                    'description' => 'Metode berbasis jarak geometri Euclidean menuju kandidat terbaik (ideal positif) dan terjauh dari terburuk (ideal negatif).',
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        $school = School::findOrFail($schoolId);

        $request->validate([
            'spk_method' => 'nullable|string|in:saw,wp,topsis',
            'spk_hard_skill_weight' => 'nullable|numeric|min:0|max:100',
            'spk_soft_skill_weight' => 'nullable|numeric|min:0|max:100',
            'spk_criteria_weights' => 'nullable|array',
        ]);

        $updateData = [];

        if ($request->filled('spk_method')) {
            $updateData['spk_method'] = $request->spk_method;
        }

        if ($request->has('spk_hard_skill_weight') && $request->has('spk_soft_skill_weight')) {
            $updateData['spk_hard_skill_weight'] = (int) $request->spk_hard_skill_weight;
            $updateData['spk_soft_skill_weight'] = (int) $request->spk_soft_skill_weight;
        }

        if ($request->has('spk_criteria_weights') && is_array($request->spk_criteria_weights)) {
            $updateData['spk_criteria_weights'] = $request->spk_criteria_weights;
        }

        $school->update($updateData);

        return back()->with('message', 'Konfigurasi SPK Multi-Kriteria berhasil disimpan!');
    }
}
