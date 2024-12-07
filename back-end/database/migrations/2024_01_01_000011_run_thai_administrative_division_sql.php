<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class RunThaiAdministrativeDivisionSql extends Migration
{
    public function up()
    {
        // Read the SQL file
        $sql = file_get_contents(database_path('sql\thai-administrative-division-full-my-sql.sql'));

        // Execute the SQL
        DB::unprepared($sql);
    }

    public function down()
    {
        // Optionally, you can add logic to reverse the migration
        // For example, dropping the tables created by the SQL
    }
}
