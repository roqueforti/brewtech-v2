<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class User extends Authenticatable
{
    use HasFactory, Notifiable, LogsActivity;

    protected $fillable = [
        'name', 'email', 'password', 'role', 
        'school_id', 'cafe_id', 'kelas_id', 'parent_id', 'disability_type', 'ready_for_pkl'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Pengecekan Role Cepat
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // =========================================================
    // RELASI KE ENTITAS LAIN
    // =========================================================

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function cafe(): BelongsTo
    {
        return $this->belongsTo(Cafe::class);
    }

    /**
     * Relasi untuk Siswa: Mengetahui siswa berada di kelas mana.
     * Menggunakan nama 'studentClass' agar selaras dengan Controller.
     */
    public function studentClass(): BelongsTo
    {
        return $this->belongsTo(StudyClass::class, 'kelas_id');
    }

    /**
     * Relasi untuk Siswa: Mengetahui siapa Wali Muridnya.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Relasi untuk Wali Murid: Mengetahui siapa saja anak yang ditautkan.
     */
    public function children(): HasMany
    {
        return $this->hasMany(User::class, 'parent_id');
    }

    /**
     * Relasi untuk Pelatih/Instruktur: Mengetahui kelas mana saja yang diajar.
     */
    public function instructorClasses(): HasMany
    {
        return $this->hasMany(StudyClass::class, 'instructor_id');
    }

    /**
     * Relasi untuk Siswa: Progress modul.
     */
    public function moduleProgresses(): HasMany
    {
        return $this->hasMany(StudentModuleProgress::class, 'student_id');
    }

    /**
     * Relasi untuk Siswa: Evaluasi soft skill.
     */
    public function softSkillEvaluations(): HasMany
    {
        return $this->hasMany(StudentSoftSkillEvaluation::class, 'student_id');
    }
}