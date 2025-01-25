<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Enrollment extends Model
{
    protected $table = 'enrollments';
    protected $fillable = [
        'course_group_id',
        'student_id',
        'activity_case_status',
        'enrollment_date',
        'date_start',
        'date_end',
        'course_price_id',
        'created_at',
        'updated_at'
    ];

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('students.firstname_tha', 'like', '%' . $searchTerm . '%')
            ->orWhere('students.lastname_tha', 'like', '%' . $searchTerm . '%')
            ->orWhere('students.firstname_eng', 'like', '%' . $searchTerm . '%')
            ->orWhere('students.lastname_eng', 'like', '%' . $searchTerm . '%')
            ->orWhere('students.id', 'like', '%' . $searchTerm . '%')
            ->orWhere('students.email', 'like', '%' . $searchTerm . '%');
    }

    public function scopeFilterAgeRange($query, $ageRange)
    {
        return match ($ageRange) {
            'all' => $query,
            '20-30' => $query->whereBetween('students.birthdate', [now()->subYears(30)->startOfDay(), now()->subYears(20)->endOfDay()]),
            '31-40' => $query->whereBetween('students.birthdate', [now()->subYears(40)->startOfDay(), now()->subYears(31)->endOfDay()]),
            '41-50' => $query->whereBetween('students.birthdate', [now()->subYears(50)->startOfDay(), now()->subYears(41)->endOfDay()]),
            '51+' => $query->where('students.birthdate', '<', now()->subYears(51)->startOfDay()),
            default => $query,
        };
    }

    public function scopeFilterExperience($query, $experience)
    {
        return match ($experience) {
            'all' => $query,
            'hasExpLearn' => $query->where('students.learn_massage', 1),
            'hasExpWork' => $query->where('students.work_massage', 1),
            default => $query,
        };
    }

    public function scopeFilterEducation($query, $education)
    {
        return match ($education) {
            'all' => $query,
            'below' => $query->whereBetween('students.edu_qual_id', [0, 35]),
            'bachelor' => $query->where('students.edu_qual_id', 40),
            'above' => $query->whereBetween('students.edu_qual_id', [50, 90]),
            default => $query,
        };
    }

    public function scopeFilterRecentlyAdded($query, $recentlyAdded)
    {
        $now = now()->setTimezone('Asia/Bangkok');

        return match ($recentlyAdded) {
            'all' => $query,
            'today' => $query->whereDate('enrollments.created_at', $now->format('Y-m-d')),
            'yesterday' => $query->whereDate('enrollments.created_at', $now->copy()->subDay()->format('Y-m-d')),
            'last7days' => $query->whereBetween('enrollments.created_at', [$now->copy()->subWeek()->startOfDay(), $now->copy()->endOfDay()]),
            'last30days' => $query->whereBetween('enrollments.created_at', [$now->copy()->subMonth()->startOfDay(), $now->copy()->endOfDay()]),
            default => $query,
        };
    }

    public function course_group(): BelongsTo
    {
        return $this->belongsTo(CourseGroup::class, 'course_group_id');
    }
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
    public function course_attendences(): HasMany
    {
        return $this->hasMany(CourseAttendence::class);
    }
    public function course_price(): BelongsTo
    {
        return $this->belongsTo(CoursePrice::class, 'course_price_id');
    }
}
