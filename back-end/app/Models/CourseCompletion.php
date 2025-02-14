<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
class CourseCompletion extends Model
{
    protected $table = 'course_completions';
    protected $fillable = ['course_group_id', 'student_id', 'date_start', 'date_end', 'completion_date'];

    public function scopeCourseFilter($query, $courseFilter): Builder
    {
        return $query->whereHas('course_group.course', function ($query) use ($courseFilter) {
            $query->where('id', $courseFilter);
        });
    }

    public function scopeBatchFilter($query, $batchFilter): Builder
    {
        return $query->whereHas('course_group', function ($query) use ($batchFilter) {
            $query->where('batch', $batchFilter);
        });
    }

    public function scopeAvailableLicense($query, $availableLicense): Builder
    {
        if ($availableLicense == 'true') {
            return $query->whereHas('course_group.course', function ($query) {
                $query->whereIn('id', [7, 8, 9, 10]);
            });
        }
        return $query;
    }

    public function course_group(): BelongsTo
    {
        return $this->belongsTo(CourseGroup::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
