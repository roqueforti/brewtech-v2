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
Schema::table('users', function (Blueprint $table) {
    $table->enum('role', ['superadmin', 'school_admin', 'instructor', 'student', 'parent', 'cafe_admin'])->default('student')->after('password');
    $table->foreignId('school_id')->nullable()->constrained('schools')->cascadeOnDelete()->after('role');
    $table->foreignId('cafe_id')->nullable()->constrained('cafes')->cascadeOnDelete()->after('school_id');
    $table->foreignId('kelas_id')->nullable()->constrained('study_classes')->cascadeOnDelete()->after('cafe_id');
    $table->foreignId('parent_id')->nullable()->constrained('users')->cascadeOnDelete()->after('kelas_id');
    $table->string('disability_type')->nullable()->after('parent_id');
    
    // Pastikan kolom email dan password menjadi nullable untuk kemudahan login Siswa
    $table->string('email')->nullable()->change();
    $table->string('password')->nullable()->change();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
