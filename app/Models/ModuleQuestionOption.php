<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleQuestionOption extends Model
{
    protected $fillable = ['module_question_id', 'option_text', 'is_correct'];

    // Cast is_correct menjadi boolean
    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(ModuleQuestion::class, 'module_question_id');
    }
}