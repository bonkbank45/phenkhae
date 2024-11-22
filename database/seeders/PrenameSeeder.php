<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrenameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('prenames')->insert([
            'prename_tha' => 'นาย',
            'prename_eng' => 'MR.',
            'prename_short_tha' => null,
            'prename_short_eng' => null,
        ]);

        DB::table('prenames')->insert([
            'prename_tha' => 'นาง',
            'prename_eng' => 'MRS.',
            'prename_short_tha' => null,
            'prename_short_eng' => null,
        ]);
    }
}
