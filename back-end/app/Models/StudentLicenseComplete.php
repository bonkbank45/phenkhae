<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class StudentLicenseComplete extends Model
{
    protected $table = 'student_license_completes';
    protected $fillable = ['student_id', 'course_group_id', 'date_complete'];
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
    public function course_group(): BelongsTo
    {
        return $this->belongsTo(CourseGroup::class, 'course_group_id');
    }
    // public function course(): BelongsTo
    // {
    //     return $this->belongsTo(Course::class, 'course_id');
    // }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->whereHas('student', function ($q) use ($searchTerm) {
            $q->where('firstname_tha', 'like', '%' . $searchTerm . '%')
                ->orWhere('lastname_tha', 'like', '%' . $searchTerm . '%')
                ->orWhere('id', '=', $searchTerm);
        });
    }

    public function scopeByCourse($query, $courseId)
    {
        if ($courseId === 'all') {
            return $query;
        }
        return $query->whereHas('course_group', function ($q) use ($courseId) {
            $q->where('course_id', $courseId);
        });
    }

    public function scopeDateSearchStart($query, $dateSearchStart)
    {
        return $query->where('student_license_completes.date_complete', '>=', $dateSearchStart);
    }

    public function scopeDateSearchEnd($query, $dateSearchEnd)
    {
        return $query->where('student_license_completes.date_complete', '<=', $dateSearchEnd);
    }
}
