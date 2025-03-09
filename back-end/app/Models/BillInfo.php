<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class BillInfo extends Model
{
    protected $table = 'bill_infos';
    public $incrementing = false;
    protected $fillable = ['vol', 'no', 'bill_receiver', 'note', 'date_submit', 'course_group_id', 'student_id'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function course_group(): BelongsTo
    {
        return $this->belongsTo(CourseGroup::class, 'course_group_id');
    }
}
