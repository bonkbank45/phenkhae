<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CoursePrice extends Model
{
    protected $table = 'course_prices';
    protected $fillable = ['price', 'date_start', 'date_end', 'created_at', 'updated_at'];
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
