<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Subdistrict extends Model
{
    protected $table = 'subdistricts';
    public function districts(): BelongsTo
    {
        return $this->belongsTo(District::class, 'district_id');
    }
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
