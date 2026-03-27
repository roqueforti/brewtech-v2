<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\LogsActivity;

class Module extends Model
{
    use LogsActivity;

    protected $fillable = ['title', 'description', 'order'];

    public function materials(): HasMany
    {
        return $this->hasMany(ModuleMaterial::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ModuleQuestion::class);
    }

    public function softSkillCriteria(): HasMany
    {
        return $this->hasMany(ModuleSoftSkillCriteria::class);
    }

    public function studyClasses(): BelongsToMany
    {
        return $this->belongsToMany(StudyClass::class, 'class_module');
    }
}