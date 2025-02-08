<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\CourseGroup;

class CourseAttendence extends Model
{
    protected $table = 'course_attendences';
    protected $fillable = ['course_group_id', 'attendence_date'];
    public $timestamps = true;

    public function course_group(): BelongsTo
    {
        return $this->belongsTo(CourseGroup::class);
    }
    // public function enrollment(): BelongsTo
    // {
    //     return $this->belongsTo(Enrollment::class)
    //         ->where('course_group_id', $this->course_group_id)
    //         ->where('student_id', $this->student_id);
    // }
}
