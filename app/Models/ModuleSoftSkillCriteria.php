<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleSoftSkillCriteria extends Model
{
    // Tambahkan baris ini untuk memberitahu Laravel nama tabel yang benar
    // Ganti 'module_soft_skill_criteria' sesuai nama asli tabel di database Anda
    protected $table = 'module_soft_skill_criteria'; 

    protected $fillable = [
        'module_id',
        'criteria_name',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}