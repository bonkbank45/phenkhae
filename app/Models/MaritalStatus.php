<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaritalStatus extends Model
{
    protected $table = 'marital_statuses';
    protected $fillable = ['marital_status_name'];
    public $timestamps = false;
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
