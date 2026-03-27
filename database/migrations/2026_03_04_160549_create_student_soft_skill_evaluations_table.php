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
Schema::create('student_soft_skill_evaluations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
    $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('criteria_id')->constrained('module_soft_skill_criteria')->cascadeOnDelete();
    $table->integer('score')->default(0);
    $table->text('observation_notes')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_soft_skill_evaluations');
    }
};
