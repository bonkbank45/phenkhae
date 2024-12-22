<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Prename extends Model
{
    protected $table = 'prenames';
    public $incrementing = false;
    protected $keyType = 'integer';
    protected $fillable = ['prename_tha', 'prename_eng', 'prename_short_tha', 'prename_short_eng', 'show_status'];
    public $timestamps = false;
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
