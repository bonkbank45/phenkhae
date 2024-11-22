<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Exam extends Model
{
    protected $table = 'exams';
    protected $fillable = ['year', 'term', 'exam_period', 'score_full', 'score_real', 'date_exam'];
    public $timestamps = false;
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class)
            ->where('course_group_id', $this->course_group_id)
            ->where('student_id', $this->student_id);
    }
    public function exam_type(): BelongsTo
    {
        return $this->belongsTo(ExamType::class, 'exam_type_id');
    }
}
