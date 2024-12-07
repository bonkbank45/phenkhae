<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class StudentLicenseComplete extends Model
{
    protected $table = 'student_license_completes';
    protected $fillable = ['student_id', 'course_id', 'date_complete', 'created_at', 'updated_at'];
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
