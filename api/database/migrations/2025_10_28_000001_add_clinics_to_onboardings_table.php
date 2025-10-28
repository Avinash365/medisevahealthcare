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
        Schema::table('onboardings', function (Blueprint $table) {
            // add a nullable JSON column to store multiple clinics per doctor
            if (!Schema::hasColumn('onboardings', 'clinics')) {
                $table->json('clinics')->nullable()->after('clinic_address');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('onboardings', function (Blueprint $table) {
            if (Schema::hasColumn('onboardings', 'clinics')) {
                $table->dropColumn('clinics');
            }
        });
    }
};
