<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\School;
use Inertia\Inertia;

class SpkController extends Controller
{
    public function edit()
    {
        $schoolId = auth()->user()->school_id;
        $schoolInfo = School::find($schoolId);

        return Inertia::render('SchoolAdmin/SpkSettings', compact('schoolInfo'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'spk_hard_skill_weight' => 'required|integer|min:0|max:100',
            'spk_soft_skill_weight' => 'required|integer|min:0|max:100',
        ]);

        $totalWeight = $request->spk_hard_skill_weight + $request->spk_soft_skill_weight;

        if ($totalWeight !== 100) {
            return back()->withErrors(['total' => 'Total bobot Hard Skill dan Soft Skill harus 100%']);
        }

        $schoolId = auth()->user()->school_id;
        $school = School::find($schoolId);

        $school->update([
            'spk_hard_skill_weight' => $request->spk_hard_skill_weight,
            'spk_soft_skill_weight' => $request->spk_soft_skill_weight,
        ]);

        return back()->with('message', 'Pengaturan SPK berhasil diperbarui!');
    }
}