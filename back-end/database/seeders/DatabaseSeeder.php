<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\CourseBillSeeder;
use App\Models\Student;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            OccupationSeeder::class,
            PrenameSeeder::class,
            CourseBillSeeder::class,
            CourseCategorySeeder::class,
            CourseSeeder::class,
            CoursePriceSeeder::class,
            MaritalStatusSeeder::class,
            EducationQualSeeder::class,
            MedicalConditionSeeder::class,
        ]);

        Student::factory(1000)->create();
    }
}
