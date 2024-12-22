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
        Schema::create('exam_inviduals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams', 'id');
            $table->foreignId('student_id')->constrained('students', 'id');
            $table->integer('score_real');
            $table->dateTime('date_exam');
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
