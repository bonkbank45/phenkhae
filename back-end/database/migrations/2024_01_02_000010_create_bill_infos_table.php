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
            $table->unsignedInteger('vol');
            $table->unsignedInteger('no');
            $table->unsignedBigInteger('course_group_id');
            $table->dateTime('date_submit');
            $table->string('bill_receiver');
            $table->foreignId('student_id')->constrained('students', 'id');
            $table->string('note')->nullable();
            $table->timestamps();

            $table->primary(['vol', 'no', 'course_group_id']);
            $table->foreign('course_group_id')->references('id')->on('course_groups')->onDelete('cascade');
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
