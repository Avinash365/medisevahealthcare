<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('onboardings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('doctor')->nullable();
            $table->string('reg_no')->nullable();
            $table->string('gender')->nullable();
            $table->date('dob')->nullable();
            // store as json safely — for older DBs it will be text
            $table->json('qualifications')->nullable();
            $table->string('department')->nullable();
            $table->string('contact')->nullable();
            $table->text('clinic_address')->nullable();
            $table->json('schedule')->nullable();
            $table->decimal('fee', 10, 2)->nullable();
            $table->boolean('declaration')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onboardings');
    }
};
