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
        Schema::create('course_completions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('course_group_id')->constrained('course_groups')->onDelete('cascade');
            $table->date('date_start');
            $table->date('date_end');
            $table->date('completion_date');
            $table->tinyInteger('certificate_status')->default(0);
            $table->date('certificate_date')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'course_group_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
