<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CourseCategoryBill;
use League\Csv\Reader;

class CourseBillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/course_bill_name.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            CourseCategoryBill::create($row);
        }
    }
}
