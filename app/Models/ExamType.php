<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class ExamType extends Model
{
    protected $table = 'exam_types';
    protected $fillable = ['exam_type_name'];
    public $timestamps = false;
    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }
}
