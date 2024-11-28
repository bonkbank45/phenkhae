<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class BillInfo extends Model
{
    protected $table = 'bill_infos';
    protected $fillable = ['vol', 'no', 'date_submit'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
