<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use League\Csv\Reader;
use App\Models\MaritalStatus;
class MaritalStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/marital_status.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            MaritalStatus::create($row);
        }
    }
}
