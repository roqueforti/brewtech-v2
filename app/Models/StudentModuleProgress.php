<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentModuleProgress extends Model
{
    protected $table = 'student_module_progresses';

    protected $fillable = ['student_id', 'module_id', 'status', 'pre_test_score', 'post_test_score'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}