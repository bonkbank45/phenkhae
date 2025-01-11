<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use League\Csv\Reader;
use App\Models\CoursePrice;
class CoursePriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/course_price.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            CoursePrice::create($row);
        }
    }
}
