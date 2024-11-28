<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CoursePrice extends Model
{
    protected $table = 'course_prices';
    protected $fillable = ['course_id', 'price', 'date_start', 'date_end'];
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
