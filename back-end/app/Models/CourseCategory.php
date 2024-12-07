<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use JsonResponseTrait;
class CourseCategory extends Model
{
    protected $table = 'course_categories';
    protected $fillable = ['category_name'];
    public $timestamps = false;

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
