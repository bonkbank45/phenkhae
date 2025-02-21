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

    public function scopeGetUnqualifiedCompletions(
        $query,
        $courseFilter = null,
        $batchFilter = null,
        $availableLicense = null,
        $searchTerm = null
    ) {
        $query->join('course_groups', 'course_completions.course_group_id', '=', 'course_groups.id')
            ->join('courses', 'course_groups.course_id', '=', 'courses.id')
            ->join('students', 'course_completions.student_id', '=', 'students.id')
            ->leftJoin('student_license_quals', function ($join) {
                $join->on('course_completions.student_id', '=', 'student_license_quals.student_id')
                    ->on('course_completions.course_group_id', '=', 'student_license_quals.course_group_id');
            })
            ->whereNull('student_license_quals.id');

        if ($courseFilter && $courseFilter !== 'all') {
            $query->where('courses.id', $courseFilter);
            if ($batchFilter && $batchFilter !== 'all') {
                $query->where('course_groups.batch', $batchFilter);
            }
        } else {
            if ($availableLicense == 'true') {
                $query->whereIn('courses.id', [7, 8, 9, 10]);
            }
        }

        if ($searchTerm) {
            $query->where('students.id', 'like', '%' . $searchTerm . '%')
                ->orWhere('students.firstname_tha', 'like', '%' . $searchTerm . '%')
                ->orWhere('students.lastname_tha', 'like', '%' . $searchTerm . '%');
        }

        return $query->select([
            'course_completions.*',
            'course_groups.id as course_group_id',
            'course_groups.course_id',
            'course_groups.max_students',
            'course_groups.batch',
            'course_groups.theoretical_score_criteria',
            'course_groups.practical_score_criteria',
            'course_groups.date_start',
            'course_groups.date_end',
            'course_groups.created_at',
            'course_groups.updated_at',
            'courses.id as course_id',
            'courses.course_category_id',
            'courses.course_category_bill_id',
            'courses.course_name',
            'courses.course_description',
            'courses.created_at as course_created_at',
            'courses.updated_at as course_updated_at',
            'students.*'
        ]);
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
