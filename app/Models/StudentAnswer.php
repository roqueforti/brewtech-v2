<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAnswer extends Model
{
    protected $fillable = ['student_id', 'module_question_id', 'selected_option_id', 'is_correct'];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(ModuleQuestion::class, 'module_question_id');
    }

    public function selectedOption(): BelongsTo
    {
        return $this->belongsTo(ModuleQuestionOption::class, 'selected_option_id');
    }
}