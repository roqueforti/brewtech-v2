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
Schema::create('module_materials', function (Blueprint $table) {
    $table->id();
    $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
    $table->enum('type', ['alat', 'bahan', 'langkah']);
    $table->text('content_text');
    $table->string('media_url')->nullable();
    $table->integer('order')->default(0);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_materials');
    }
};
