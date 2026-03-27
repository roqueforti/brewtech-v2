<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ModuleQuestion extends Model
{
    protected $fillable = ['module_id', 'type', 'question_text', 'media_url'];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ModuleQuestionOption::class);
    }
}