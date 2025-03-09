<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Occupation extends Model
{
    protected $table = 'occupations';
    protected $fillable = ['id', 'occupation_name'];
    public $incrementing = false;
    public $keyType = 'string';
    public $timestamps = false;
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
