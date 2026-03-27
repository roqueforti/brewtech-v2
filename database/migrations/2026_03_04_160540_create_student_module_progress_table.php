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
Schema::create('student_module_progresses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
    $table->enum('status', ['locked', 'pre_test', 'praktikum', 'post_test', 'waiting_soft_skill', 'completed'])->default('locked');
    $table->integer('pre_test_score')->default(0);
    $table->integer('post_test_score')->default(0);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_module_progress');
    }
};
