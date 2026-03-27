<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\LogsActivity;

class StudyClass extends Model
{
    use LogsActivity;

    // Memastikan nama tabel sesuai migration
    protected $table = 'study_classes'; 

    protected $fillable = ['school_id', 'name', 'emoji_icon', 'instructor_id'];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'kelas_id')->where('role', 'student');
    }

    // Relasi Pivot ke tabel class_module
    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'class_module');
    }

    public function adoptedModules()
    {
        return $this->modules();
    }
}