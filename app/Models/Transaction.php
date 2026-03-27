<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Transaction extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'cafe_id',
        'user_id',
        'tanggal',
        'keterangan',
        'tipe',
        'nominal'
    ];

    // Relasi opsional
    public function cafe() { return $this->belongsTo(Cafe::class); }
    public function user() { return $this->belongsTo(User::class); }
}