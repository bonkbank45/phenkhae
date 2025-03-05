<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamInvidual extends Model
{
    protected $table = 'exam_inviduals';
    protected $fillable = ['exam_id', 'student_id', 'score_get', 'date_exam'];
    public $timestamps = false;

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
