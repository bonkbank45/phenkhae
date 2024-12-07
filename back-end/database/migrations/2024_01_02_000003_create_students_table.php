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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prename_id')->constrained('prenames', 'id');
            $table->string('firstname_tha');
            $table->string('lastname_tha');
            $table->string('firstname_eng');
            $table->string('lastname_eng');
            $table->string('citizenid_card');
            $table->date('birthdate');
            $table->integer('birth_province_id');
            $table->string('father_fname');
            $table->string('father_lname');
            $table->string('mother_fname');
            $table->string('mother_lname');
            $table->foreignId('marital_id')->constrained('marital_statuses', 'id');
            $table->string('address_num')->nullable();
            $table->string('address_moo')->nullable();
            $table->string('address_road')->nullable();
            $table->integer('address_subdistrict_id');
            $table->string('phonenumber');
            $table->string('email');
            $table->foreignId('occupation_id')->constrained('occupations', 'id');
            $table->foreignId('medical_condition_id')->constrained('medical_conditions', 'id');
            $table->string('surgery_history');
            // $table->foreignId('edu_qual_id')->constrained('edu_quals', 'id');
            // $table->foreignId('edu_ins_id')->constrained('edu_inses', 'id');
            $table->tinyInteger('learn_massage');
            $table->text('learn_massage_desc')->nullable();
            $table->tinyInteger('work_massage');
            $table->text('work_massage_desc')->nullable();

            $table->foreign('birth_province_id')->references('id')->on('provinces')->onDelete('cascade');
            $table->foreign('address_subdistrict_id')->references('id')->on('subdistricts')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
