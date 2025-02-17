<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class StudentLicenseQual extends Model
{
    protected $table = 'student_license_quals';
    protected $fillable = ['student_id', 'course_id', 'date_qualified', 'created_at', 'updated_at'];

    public function student_license_qual(): HasOne
    {
        return $this->hasOne(StudentLicenseComplete::class, 'student_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function scopeWithFullDetails($query)
    {
        return $query->leftJoin('student_license_completes', function ($join) {
            $join->on('student_license_completes.student_id', '=', 'student_license_quals.student_id')
                ->on('student_license_completes.course_id', '=', 'student_license_quals.course_id');
        })
            ->join('students', 'student_license_quals.student_id', '=', 'students.id')
            ->join('courses', 'student_license_quals.course_id', '=', 'courses.id')
            ->select([
                'student_license_quals.id',
                'student_license_quals.student_id',
                'student_license_quals.course_id',
                'student_license_quals.date_qualified',
                'student_license_quals.created_at',
                'student_license_quals.updated_at',
                DB::raw('CASE 
                    WHEN student_license_completes.id IS NULL THEN 0 
                    ELSE 1 
                 END AS is_completed'),
                'students.id AS student_id',
                'students.firstname_tha AS student_firstname_tha',
                'students.lastname_tha AS student_lastname_tha',
                'courses.id AS course_id',
                'courses.course_name AS course_name'
            ]);
    }

    public function scopeByCourse($query, $courseId)
    {
        if ($courseId === 'all') {
            return $query;
        }
        return $query->where('student_license_quals.course_id', $courseId);
    }

    public function scopeByLicenseStatus($query, $licenseStatus)
    {
        if ($licenseStatus === 'all') {
            return $query;
        }

        if ($licenseStatus == 1) {
            return $query->whereNotNull('student_license_completes.id');
        } else {
            return $query->whereNull('student_license_completes.id');
        }
    }

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('students.firstname_tha', 'like', '%' . $searchTerm . '%')
            ->orWhere('students.lastname_tha', 'like', '%' . $searchTerm . '%')
            ->orWhere('students.id', '=', $searchTerm);
    }

    public function scopeDateSearchStart($query, $dateSearchStart)
    {
        return $query->where('student_license_quals.date_qualified', '>=', $dateSearchStart);
    }

    public function scopeDateSearchEnd($query, $dateSearchEnd)
    {
        return $query->where('student_license_quals.date_qualified', '<=', $dateSearchEnd);
    }

    public function scopeGetUnlicensedStudents($query, $courseId = null, $searchTerm = null)
    {
        return $query->select([
            'student_license_quals.*',
            'students.*',
            'courses.id as course_id',
            'courses.course_category_id',
            'courses.course_category_bill_id',
            'courses.course_name',
            'courses.course_description',
            'courses.created_at as course_created_at',
            'courses.updated_at as course_updated_at'
        ])
            ->join('students', 'student_license_quals.student_id', '=', 'students.id')
            ->join('courses', function ($join) use ($courseId) {
                $join->on('student_license_quals.course_id', '=', 'courses.id');
                if ($courseId && $courseId !== 'all') {
                    $join->where('courses.id', '=', $courseId);
                }
            })
            ->leftJoin('student_license_completes', function ($join) {
                $join->on('student_license_quals.student_id', '=', 'student_license_completes.student_id')
                    ->on('student_license_quals.course_id', '=', 'student_license_completes.course_id');
            })
            ->whereNull('student_license_completes.id')
            ->when($searchTerm, function ($query, $searchTerm) {
                return $query->where('students.id', 'like', '%' . $searchTerm . '%')
                    ->orWhere('students.firstname_tha', 'like', '%' . $searchTerm . '%')
                    ->orWhere('students.lastname_tha', 'like', '%' . $searchTerm . '%');
            });
    }
}
