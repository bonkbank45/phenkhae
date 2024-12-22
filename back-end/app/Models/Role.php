<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Role extends Model
{
    protected $table = 'roles';
    public $timestamps = false;
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function getNameAttribute()
    {
        return $this->role_name;
    }
}
