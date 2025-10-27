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
        Schema::create('appointments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('patient_name');
            $table->integer('age')->nullable();
            $table->string('guardian_name')->nullable();
            $table->json('address')->nullable();
            $table->string('mobile_primary');
            $table->string('mobile_alternate')->nullable();
            $table->string('disease')->nullable();
            $table->date('appointment_date');
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->string('state')->nullable();
            $table->string('city')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
