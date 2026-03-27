<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleMaterial extends Model
{
    protected $fillable = ['module_id', 'type', 'content_text', 'media_url', 'order'];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}