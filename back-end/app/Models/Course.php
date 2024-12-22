<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Course extends Model
{
    protected $table = 'courses';
    public $incrementing = false;
    protected $fillable = ['id', 'course_name', 'course_category_id', 'course_category_bill_id', 'course_description'];

    public function course_category(): BelongsTo
    {
        return $this->belongsTo(CourseCategory::class, 'course_category_id');
    }
    public function course_category_bill(): BelongsTo
    {
        return $this->belongsTo(CourseCategoryBill::class, 'course_category_bill_id');
    }
    public function course_groups(): HasMany
    {
        return $this->hasMany(CourseGroup::class);
    }
    public function course_prices(): HasMany
    {
        return $this->hasMany(CoursePrice::class);
    }
    public function student_license_completes(): HasMany
    {
        return $this->hasMany(StudentLicenseComplete::class);
    }
}
