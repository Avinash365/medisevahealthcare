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
            if (!Schema::hasColumn('appointments', 'payment_reference')) {
                $table->string('payment_reference')->nullable()->after('payment_status');
            }
            if (!Schema::hasColumn('appointments', 'payment_gateway')) {
                $table->string('payment_gateway')->nullable()->after('payment_reference');
            }
            if (!Schema::hasColumn('appointments', 'payment_verified_at')) {
                $table->timestamp('payment_verified_at')->nullable()->after('payment_gateway');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'payment_verified_at')) {
                $table->dropColumn('payment_verified_at');
            }
            if (Schema::hasColumn('appointments', 'payment_gateway')) {
                $table->dropColumn('payment_gateway');
            }
            if (Schema::hasColumn('appointments', 'payment_reference')) {
                $table->dropColumn('payment_reference');
            }
        });
    }
};
