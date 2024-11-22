<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class CourseGroup extends Model
{
    protected $table = 'course_groups';
    protected $fillable = ['max_students', 'batch', 'date_start', 'date_end'];
    public $timestamps = false;

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}
