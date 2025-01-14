<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Prename extends Model
{
    protected $table = 'prenames';
    public $incrementing = false;
    protected $keyType = 'integer';
    protected $fillable = ['id', 'prename_tha', 'prename_eng', 'prename_short_tha', 'prename_short_eng', 'show_status'];
    public $timestamps = false;

    public function scopeFilterByStatus($query, $showStatus)
    {
        if ($showStatus === 'all') {
            return $query;
        }
        return $query->where('show_status', $showStatus);
    }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->when($searchTerm, function ($query) use ($searchTerm) {
            return $query->where(function ($query) use ($searchTerm) {
                $query->where('prename_tha', 'like', '%' . $searchTerm . '%')
                    ->orWhere('prename_eng', 'like', '%' . $searchTerm . '%')
                    ->orWhere('prename_short_tha', 'like', '%' . $searchTerm . '%')
                    ->orWhere('prename_short_eng', 'like', '%' . $searchTerm . '%')
                    ->orWhere('id', $searchTerm);
            });
        });
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
}
