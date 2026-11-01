<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class School extends Model
{
    use LogsActivity;

    protected $fillable = [
        'name', 'address', 'phone', 'logo_url', 
        'spk_hard_skill_weight', 'spk_soft_skill_weight',
        'spk_method', 'spk_criteria_weights'
    ];

    protected $casts = [
        'spk_criteria_weights' => 'array',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function studyClasses(): HasMany
    {
        return $this->hasMany(StudyClass::class);
    }
}