<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;
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
        'edu_ins',
        'learn_massage',
        'learn_massage_description',
        'work_massage',
        'work_massage_description',
        'profile_image',
        'created_at',
        'updated_at'
    ];

    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('firstname_tha', 'like', '%' . $searchTerm . '%')
            ->orWhere('lastname_tha', 'like', '%' . $searchTerm . '%')
            ->orWhere('phonenumber', 'like', '%' . $searchTerm . '%')
            ->orWhere('email', 'like', '%' . $searchTerm . '%');
    }

    public function scopeFilterAgeRange($query, $ageRange)
    {
        return match ($ageRange) {
            'all' => $query,
            '20-30' => $query->whereBetween('birthdate', [now()->subYears(30)->startOfDay(), now()->subYears(20)->endOfDay()]),
            '31-40' => $query->whereBetween('birthdate', [now()->subYears(40)->startOfDay(), now()->subYears(31)->endOfDay()]),
            '41-50' => $query->whereBetween('birthdate', [now()->subYears(50)->startOfDay(), now()->subYears(41)->endOfDay()]),
            '51+' => $query->where('birthdate', '<', now()->subYears(51)->startOfDay()),
            default => $query,
        };
    }

    public function scopeFilterExperience($query, $experience)
    {
        return match ($experience) {
            'all' => $query,
            'hasExpLearn' => $query->where('learn_massage', 1),
            'hasExpWork' => $query->where('work_massage', 1),
            default => $query,
        };
    }

    public function scopeFilterEducation($query, $education)
    {
        return match ($education) {
            'all' => $query,
            'below' => $query->whereBetween('edu_qual_id', [0, 35]),
            'bachelor' => $query->where('edu_qual_id', 40),
            'above' => $query->whereBetween('edu_qual_id', [50, 90]),
            default => $query,
        };
    }

    public function scopeFilterRecentlyAdded($query, $recentlyAdded)
    {
        $now = now()->setTimezone('Asia/Bangkok');

        return match ($recentlyAdded) {
            'all' => $query,
            'today' => $query->whereDate('created_at', $now->format('Y-m-d')),
            'yesterday' => $query->whereDate('created_at', $now->copy()->subDay()->format('Y-m-d')),
            'last7days' => $query->whereBetween('created_at', [$now->copy()->subWeek()->startOfDay(), $now->copy()->endOfDay()]),
            'last30days' => $query->whereBetween('created_at', [$now->copy()->subMonth()->startOfDay(), $now->copy()->endOfDay()]),
            default => $query,
        };
    }

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
