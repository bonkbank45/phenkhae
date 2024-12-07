<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class District extends Model
{
    protected $table = 'districts';
    public function subdistricts(): HasMany
    {
        return $this->hasMany(Subdistrict::class);
    }
    public function provinces(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id');
    }
}
