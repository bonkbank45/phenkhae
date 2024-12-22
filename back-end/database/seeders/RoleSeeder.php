<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use League\Csv\Reader;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/role.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            Role::create($row);
        }
    }
}
