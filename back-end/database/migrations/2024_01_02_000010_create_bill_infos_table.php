<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bill_infos', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('vol');
            $table->unsignedInteger('no');
            $table->dateTime('date_submit');
            $table->foreignId('course_group_id')->constrained('course_groups', 'id');
            $table->foreignId('student_id')->constrained('students', 'id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_infos');
    }
};
