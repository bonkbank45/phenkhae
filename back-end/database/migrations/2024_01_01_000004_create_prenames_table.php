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
        Schema::create('prenames', function (Blueprint $table) {
            $table->id();
            $table->string("prename_tha");
            $table->string("prename_eng")->nullable();
            $table->string("prename_short_tha")->nullable();
            $table->string("prename_short_eng")->nullable();
            $table->integer("show_status");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prenames');
    }
};
