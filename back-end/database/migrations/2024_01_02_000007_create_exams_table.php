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
        Schema::create('exams', function (Blueprint $table) {
            // $table->id();
            // $table->unsignedBigInteger('course_group_id');
            // $table->unsignedBigInteger('student_id');
            // $table->year('year');
            // $table->tinyInteger('term');
            // $table->integer('exam_type_id');
            // $table->integer('exam_period');
            // $table->integer('score_full');
            // $table->integer('score_real');
            // $table->dateTime('date_exam');

            // $table->foreign(['course_group_id', 'student_id'])
            //     ->references(['course_group_id', 'student_id'])
            //     ->on('enrollments')
            //     ->onDelete('cascade');
            $table->id();
            $table->foreignId('course_group_id')->constrained('course_groups', 'id');
            $table->integer('year');
            $table->tinyInteger('term');
            $table->integer('exam_type_id');
            $table->integer('exam_period');
            $table->integer('score_pass');
            $table->dateTime('date_start_exam');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
