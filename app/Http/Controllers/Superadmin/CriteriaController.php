<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\ModuleCriteria;

class CriteriaController extends Controller
{
    /**
     * Store a newly created criteria in storage.
     */
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'criteria_name' => 'required|string|max:255',
            'weight' => 'required|integer|min:1|max:100',
        ]);

        $module->criteria()->create($validated);

        return back()->with('success', 'Kriteria penilaian berhasil ditambahkan.');
    }
}
