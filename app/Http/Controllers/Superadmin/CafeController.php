<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\Cafe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CafeController extends Controller
{
    /**
     * Tampilkan daftar kafe.
     */
    public function index()
    {
        return Inertia::render('Superadmin/Cafes/Index', [ // Sesuaikan folder jika jamak
            'cafes' => Cafe::latest()->get()
        ]);
    }

    /**
     * Simpan data kafe baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:cafes,email',
            'status'  => 'required|in:active,inactive,maintenance',
            'phone'   => 'nullable|string|max:20',
            'address' => 'nullable|string', // Tambahkan ini agar alamat tersimpan
        ]);

        Cafe::create($validated);

        // Menggunakan redirect route lebih aman daripada back() jika terjadi pergantian URL
        return redirect()->route('superadmin.cafes.index')
            ->with('message', 'Partner baru berhasil didaftarkan!');
    }

    /**
     * Update data kafe yang sudah ada.
     */
    public function update(Request $request, Cafe $cafe)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:cafes,email,' . $cafe->id,
            'status'  => 'required|in:active,inactive,maintenance',
            'phone'   => 'nullable|string|max:20',
            'address' => 'nullable|string', // Tambahkan ini agar alamat terupdate
        ]);

        $cafe->update($validated);

        return redirect()->route('superadmin.cafes.index')
            ->with('message', 'Data mitra berhasil diperbarui!');
    }

    /**
     * Hapus data kafe.
     */
    public function destroy(Cafe $cafe)
    {
        $cafe->delete();

        return redirect()->route('superadmin.cafes.index')
            ->with('message', 'Kemitraan telah dihapus.');
    }
}