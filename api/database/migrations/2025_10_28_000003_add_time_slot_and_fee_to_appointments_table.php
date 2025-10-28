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
        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'time_slot')) {
                $table->string('time_slot')->nullable()->after('appointment_date');
            }
            if (!Schema::hasColumn('appointments', 'fee')) {
                $table->decimal('fee', 10, 2)->nullable()->after('time_slot');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'fee')) {
                $table->dropColumn('fee');
            }
            if (Schema::hasColumn('appointments', 'time_slot')) {
                $table->dropColumn('time_slot');
            }
        });
    }
};
