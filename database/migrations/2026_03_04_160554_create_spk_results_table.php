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
Schema::create('spk_results', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
    $table->float('total_hard_skill')->default(0);
    $table->float('total_soft_skill')->default(0);
    $table->float('nilai_keseluruhan')->default(0);
    $table->enum('kategori_spk', ['Perlu pelatihan lanjutan', 'Perlu pendampingan', 'Siap PKL'])->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spk_results');
    }
};
