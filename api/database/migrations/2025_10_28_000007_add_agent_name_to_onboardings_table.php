<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		if (!Schema::hasColumn('onboardings', 'agent_name')) {
			Schema::table('onboardings', function (Blueprint $table) {
				$table->string('agent_name')->nullable()->after('declaration');
			});
		}
	}

	public function down(): void
	{
		if (Schema::hasColumn('onboardings', 'agent_name')) {
			Schema::table('onboardings', function (Blueprint $table) {
				$table->dropColumn('agent_name');
			});
		}
	}
};

