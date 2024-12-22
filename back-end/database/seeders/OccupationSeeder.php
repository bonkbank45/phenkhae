<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Occupation;
use League\Csv\Reader;

class OccupationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/occupation.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            Occupation::create($row);
        }
    }
}
