<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleMaterial;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'type' => 'required|in:alat,bahan,langkah',
            'content_text' => 'required|string',
            'media_url' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $module->materials()->create($validated);

        return redirect()->back()->with('message', 'Materi berhasil ditambahkan!');
    }
}
