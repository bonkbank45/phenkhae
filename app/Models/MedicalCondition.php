<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class MedicalCondition extends Model
{
    protected $table = 'medical_conditions';
    protected $fillable = ['name'];
    public $timestamps = false;
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
