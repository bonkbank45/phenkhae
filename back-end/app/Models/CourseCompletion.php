<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseCompletion extends Model
{
    protected $table = 'course_completions';
    protected $fillable = ['course_group_id', 'student_id', 'date_start', 'date_end', 'completion_date'];
}
