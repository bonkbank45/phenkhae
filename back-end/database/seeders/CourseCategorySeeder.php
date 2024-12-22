<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\CourseCategory;
use League\Csv\Reader;

class CourseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/course_category.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            CourseCategory::create($row);
        }
    }
}
