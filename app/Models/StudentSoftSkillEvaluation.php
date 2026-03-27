<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSoftSkillEvaluation extends Model
{
    protected $fillable = ['student_id', 'module_id', 'instructor_id', 'criteria_id', 'score', 'observation_notes'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function criteria(): BelongsTo
    {
        return $this->belongsTo(ModuleSoftSkillCriteria::class, 'criteria_id');
    }
}