<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class StudentAttendence extends Model
{
    protected $table = 'student_attendences';
    protected $fillable = ['student_id', 'course_attendence_id', 'status'];
    public $timestamps = false;

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function course_attendence(): BelongsTo
    {
        return $this->belongsTo(CourseAttendence::class);
    }
}
