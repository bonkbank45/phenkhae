<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EducationQual extends Model
{
    protected $table = 'education_quals';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $keyType = 'string';
    public $timestamps = false;
    protected $fillable = ['id', 'edu_qual_name', 'edu_qual_eng', 'status'];
}
