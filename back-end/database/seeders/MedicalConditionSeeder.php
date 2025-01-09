<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MedicalCondition;
use League\Csv\Reader;

class MedicalConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/medical_condition.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            MedicalCondition::create([
                'id' => $row['id'],
                'name' => $row['name'],
            ]);
        }
    }
}
