<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('cafe_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
        $table->date('tanggal');
        $table->string('keterangan');
        $table->enum('tipe', ['debit', 'kredit']); // debit = masuk, kredit = keluar
        $table->decimal('nominal', 15, 2); // Menggunakan decimal agar aman untuk uang
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
