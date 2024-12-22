<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use League\Csv\Reader;
use App\Models\EducationQual;

class EducationQualSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/edu_qual.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            EducationQual::create($row);
        }
    }
}
