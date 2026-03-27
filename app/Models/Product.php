<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivity;

class Product extends Model
{
    use LogsActivity;

    protected $fillable = ['cafe_id', 'name', 'price', 'cost_price', 'image_url', 'status', 'stock'];

    public function cafe(): BelongsTo
    {
        return $this->belongsTo(Cafe::class);
    }
}