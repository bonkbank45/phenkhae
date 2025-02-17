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
        Schema::create('student_license_completes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students', 'id')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses', 'id')->onDelete('cascade');
            $table->dateTime('date_complete');
            $table->timestamps();

            $table->unique(['student_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_license_completes');
    }
};
