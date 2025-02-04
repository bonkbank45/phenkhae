<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class CourseGroup extends Model
{
    protected $table = 'course_groups';
    protected $fillable = ['course_id', 'max_students', 'batch', 'date_start', 'date_end', 'theoretical_score_criteria', 'practical_score_criteria'];

    public function scopeSearch($query, $searchTerm)
    {
        return $query->when($searchTerm, function ($query) use ($searchTerm) {
            return $query->where(function ($query) use ($searchTerm) {
                $query->where('batch', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('course', function ($query) use ($searchTerm) {
                        $query->where('course_name', 'like', '%' . $searchTerm . '%');
                    });
            });
        });
    }

    public function scopeFilterByStatus($query, $status)
    {
        $today = now();
        return match ($status) {
            'enrolling' => $query->where('date_start', '>', $today),
            'in_progress' => $query->where('date_start', '<=', $today)->where('date_end', '>=', $today),
            'closed' => $query->where('date_end', '<', $today),
            default => $query,
        };
    }

    public function scopeFilterByCourse($query, $courseId)
    {
        return $query->when($courseId, function ($query) use ($courseId) {
            return match ($courseId) {
                'all' => $query,
                default => $query->where('course_id', $courseId),
            };
        });
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
}
