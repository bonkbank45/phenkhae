<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Exam extends Model
{
    protected $table = 'exams';
    protected $fillable = ['course_group_id', 'year', 'term', 'exam_type_id', 'exam_period', 'score_pass', 'date_start_exam'];
    public $timestamps = false;
    public function course_group(): BelongsTo
    {
        return $this->belongsTo(CourseGroup::class, 'course_group_id');
    }
    public function exam_type(): BelongsTo
    {
        return $this->belongsTo(ExamType::class, 'exam_type_id');
    }

    public function exam_invidual(): HasMany
    {
        return $this->hasMany(ExamInvidual::class, 'exam_id');
    }
}
