<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class CourseCategoryBill extends Model
{
    protected $table = 'course_category_bills';
    protected $fillable = ['category_bill_name'];
    public $timestamps = false;

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
