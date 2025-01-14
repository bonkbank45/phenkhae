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

    public function scopeSearch($query, $searchTerm)
    {
        return $query->when($searchTerm, function ($query) use ($searchTerm) {
            return $query->where(function ($query) use ($searchTerm) {
                $query->where('course_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('course_description', 'like', '%' . $searchTerm . '%')
                    ->orWhere('id', $searchTerm)
                    ->orWhereHas('course_category', function ($query) use ($searchTerm) {
                        $query->where('category_name', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('course_category_bill', function ($query) use ($searchTerm) {
                        $query->where('category_bill_name', 'like', '%' . $searchTerm . '%');
                    });
            });
        });
    }

    public function scopeFilterByCategory($query, $filter)
    {
        if ($filter == 'all') {
            return $query;
        }
        return $query->when($filter, function ($query) use ($filter) {
            return $query->where('course_category_id', $filter);
        });
    }

    public function scopeFilterByCategoryBill($query, $filter)
    {
        if ($filter == 'all') {
            return $query;
        }
        return $query->when($filter, function ($query) use ($filter) {
            return $query->where('course_category_bill_id', $filter);
        });
    }

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
    public function latest_course_price()
    {
        return $this->hasOne(CoursePrice::class)->latest('date_start');
    }
    public function student_license_completes(): HasMany
    {
        return $this->hasMany(StudentLicenseComplete::class);
    }
}
