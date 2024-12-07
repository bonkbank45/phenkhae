<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Enrollment extends Model
{
    protected $table = 'enrollments';
    protected $fillable = [
        'course_group_id',
        'student_id',
        'activity_case_status',
        'enrollment_date',
        'date_start',
        'date_end',
        'course_price_id',
        'created_at',
        'updated_at'
    ];
    public function course_group(): BelongsTo
    {
        return $this->belongsTo(CourseGroup::class, 'course_group_id');
    }
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
    public function course_attendences(): HasMany
    {
        return $this->hasMany(CourseAttendence::class);
    }
    public function course_price(): BelongsTo
    {
        return $this->belongsTo(CoursePrice::class, 'course_price_id');
    }
}
