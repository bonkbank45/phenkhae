<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Student extends Model
{
    protected $table = 'students';
    protected $fillable = [
        'prename_id',
        'firstname_tha',
        'lastname_tha',
        'firstname_eng',
        'lastname_eng',
        'citizenid_card',
        'birthdate',
        'birth_province_id',
        'father_fname',
        'father_lname',
        'mother_fname',
        'mother_lname',
        'marital_id',
        'address_num',
        'address_moo',
        'address_soi',
        'address_road',
        'address_subdistrict_id',
        'phonenumber',
        'email',
        'occupation_id',
        'medical_condition_id',
        'surgery_history',
        'edu_qual_id',
        'edu_ins_id',
        'learn_massage',
        'learn_massage_desc',
        'work_massage',
        'work_massage_desc',
        'created_at',
        'updated_at'
    ];
    public function birth_province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'birth_province_id');
    }

    public function marital_status(): BelongsTo
    {
        return $this->belongsTo(MaritalStatus::class, 'marital_id');
    }
    public function occupation(): BelongsTo
    {
        return $this->belongsTo(Occupation::class, 'occupation_id');
    }
    public function medical_condition(): BelongsTo
    {
        return $this->belongsTo(MedicalCondition::class, 'medical_condition_id');
    }
    // public function edu_qual(): BelongsTo
    // {
    //     return $this->belongsTo(EduQual::class);
    // }
    // public function edu_ins(): BelongsTo
    // {
    //     return $this->belongsTo(University::class);
    // }
    public function prename(): BelongsTo
    {
        return $this->belongsTo(Prename::class, 'prename_id');
    }
    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }
    public function subdistrict(): BelongsTo
    {
        return $this->belongsTo(Subdistrict::class, 'address_subdistrict_id');
    }
    public function student_license_quals(): HasMany
    {
        return $this->hasMany(StudentLicenseQual::class);
    }
    public function student_license_completes(): HasMany
    {
        return $this->hasMany(StudentLicenseComplete::class);
    }
    public function bill_infos(): HasMany
    {
        return $this->hasMany(BillInfo::class);
    }
}
