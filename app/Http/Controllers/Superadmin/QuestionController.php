<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleQuestion;
use App\Models\ModuleQuestionOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'type' => 'required|in:pre_test,post_test',
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ]);

        DB::transaction(function () use ($module, $validated) {
            $question = $module->questions()->create([
                'type' => $validated['type'],
                'question_text' => $validated['question_text'],
            ]);

            foreach ($validated['options'] as $opt) {
                $question->options()->create([
                    'option_text' => $opt['text'],
                    'is_correct' => (bool)$opt['is_correct'],
                ]);
            }
        });

        return redirect()->back()->with('message', 'Soal berhasil ditambahkan!');
    }
}
