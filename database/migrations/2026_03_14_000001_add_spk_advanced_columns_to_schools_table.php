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
        Schema::table('schools', function (Blueprint $table) {
            if (!Schema::hasColumn('schools', 'spk_method')) {
                $table->string('spk_method')->default('saw');
            }
            if (!Schema::hasColumn('schools', 'spk_criteria_weights')) {
                $table->json('spk_criteria_weights')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('schools', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('schools', 'spk_method')) {
                $columnsToDrop[] = 'spk_method';
            }
            if (Schema::hasColumn('schools', 'spk_criteria_weights')) {
                $columnsToDrop[] = 'spk_criteria_weights';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
