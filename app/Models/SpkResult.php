<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SpkResult extends Model
{
    protected $fillable = ['student_id', 'total_hard_skill', 'total_soft_skill', 'nilai_keseluruhan', 'kategori_spk'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}