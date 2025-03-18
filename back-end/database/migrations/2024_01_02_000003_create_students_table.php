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
            $table->tinyInteger('gender');
            $table->string('firstname_tha');
            $table->string('lastname_tha');
            $table->string('firstname_eng');
            $table->string('lastname_eng');
            $table->string('citizenid_card')->unique();
            $table->date('birthdate');
            $table->integer('birth_province_id');
            $table->string('father_fname')->nullable();
            $table->string('father_lname')->nullable();
            $table->string('mother_fname')->nullable();
            $table->string('mother_lname')->nullable();
            $table->foreignId('marital_id')->constrained('marital_statuses', 'id');
            $table->string('address_num')->nullable();
            $table->string('address_moo')->nullable();
            $table->string('address_soi')->nullable();
            $table->string('address_road')->nullable();
            $table->integer('address_subdistrict_id');
            $table->string('address_zip_code');
            $table->string('phonenumber');
            $table->string('email')->unique()->nullable();
            $table->string('occupation_id')->constrained('occupations', 'id');
            $table->string('medical_condition')->nullable();
            $table->string('surgery_history')->nullable();
            $table->string('edu_qual_id');
            $table->string('edu_ins')->nullable();
            $table->tinyInteger('learn_massage');
            $table->text('learn_massage_description')->nullable();
            $table->tinyInteger('work_massage');
            $table->text('work_massage_description')->nullable();
            $table->text('profile_image')->nullable();
            $table->date('date_register_from_form');

            $table->foreign('edu_qual_id')->references('id')->on('education_quals');
            $table->foreign('occupation_id')->references('id')->on('occupations');
            $table->foreign('birth_province_id')->references('id')->on('provinces');
            $table->foreign('address_subdistrict_id')->references('id')->on('subdistricts');
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
