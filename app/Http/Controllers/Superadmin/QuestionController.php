<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'options' => 'required|array|min:4', // Wajib ada 4 pilihan (A, B, C, D)
            'correct_answer' => 'required|string', // Kunci jawaban
        ]);

        $module->questions()->create([
            'question_text' => $validated['question_text'],
            'options' => json_encode($validated['options']), // Simpan array sebagai JSON
            'correct_answer' => $validated['correct_answer'],
        ]);

        return redirect()->back()->with('message', 'Soal berhasil ditambahkan!');
    }
}