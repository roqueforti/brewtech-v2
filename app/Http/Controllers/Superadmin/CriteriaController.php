<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\ModuleSoftSkillCriteria;

class CriteriaController extends Controller
{
    /**
     * Store a newly created criteria in storage.
     */
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'criteria_name' => 'required|string|max:255',
        ]);

        $module->softSkillCriteria()->create($validated);

        return back()->with('message', 'Kriteria penilaian berhasil ditambahkan.');
    }
}
