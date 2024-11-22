<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class StudentLicenseQual extends Model
{
    protected $table = 'student_license_quals';
    protected $fillable = ['date_qualified', 'created_at', 'updated_at'];
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
