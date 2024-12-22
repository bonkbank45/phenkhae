<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use League\Csv\Reader;
class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/course.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            Course::create($row);
        }
    }
}
