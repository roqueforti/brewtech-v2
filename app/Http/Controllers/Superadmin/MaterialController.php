<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'content' => 'required|string',
        ]);

        $module->materials()->create($validated);

        return redirect()->back()->with('message', 'Materi berhasil ditambahkan!');
    }
}