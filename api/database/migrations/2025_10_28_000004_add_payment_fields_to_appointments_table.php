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
            if (!Schema::hasColumn('appointments', 'payment_type')) {
                $table->string('payment_type')->nullable()->after('fee');
            }
            if (!Schema::hasColumn('appointments', 'payment_amount')) {
                $table->decimal('payment_amount', 10, 2)->nullable()->after('payment_type');
            }
            if (!Schema::hasColumn('appointments', 'payment_mode')) {
                $table->string('payment_mode')->nullable()->after('payment_amount');
            }
            if (!Schema::hasColumn('appointments', 'payment_status')) {
                $table->string('payment_status')->nullable()->after('payment_mode');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'payment_status')) {
                $table->dropColumn('payment_status');
            }
            if (Schema::hasColumn('appointments', 'payment_mode')) {
                $table->dropColumn('payment_mode');
            }
            if (Schema::hasColumn('appointments', 'payment_amount')) {
                $table->dropColumn('payment_amount');
            }
            if (Schema::hasColumn('appointments', 'payment_type')) {
                $table->dropColumn('payment_type');
            }
        });
    }
};
