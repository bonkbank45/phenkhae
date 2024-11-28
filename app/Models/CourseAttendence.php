<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class CourseAttendence extends Model
{
    protected $table = 'course_attendences';
    protected $fillable = ['course_group_id', 'student_id', 'attendence_date', 'status'];
    public $timestamps = false;
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class)
            ->where('course_group_id', $this->course_group_id)
            ->where('student_id', $this->student_id);
    }
}
