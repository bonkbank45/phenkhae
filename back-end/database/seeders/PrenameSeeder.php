<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Prename;
use League\Csv\Reader;

class PrenameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('csv/prename.csv'), 'r');
        $csv->setHeaderOffset(0);
        foreach ($csv as $row) {
            Prename::create($row);
        }
        // DB::table('prenames')->insert([
        //     'prename_tha' => 'นาย',
        //     'prename_eng' => 'MR.',
        //     'prename_short_tha' => null,
        //     'prename_short_eng' => null,
        // ]);

        // DB::table('prenames')->insert([
        //     'prename_tha' => 'นาง',
        //     'prename_eng' => 'MRS.',
        //     'prename_short_tha' => null,
        //     'prename_short_eng' => null,
        // ]);
    }
}
