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
        Schema::create('course_attendences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_opening_id');
            $table->unsignedBigInteger('student_id');
            $table->dateTime('attendance_date');
            $table->tinyInteger('status');

            $table->foreign(['course_opening_id', 'student_id'])->references(['course_opening_id', 'student_id'])->on('enrollments')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_attendences');
    }
};
