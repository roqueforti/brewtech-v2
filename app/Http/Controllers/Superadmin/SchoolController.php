<?php

namespace App\Http\Controllers\Superadmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function index()
    {
        // Panggil sekolah beserta user yang role-nya HANYA 'school_admin'
        $schools = School::with(['users' => function ($query) {
            $query->where('role', 'school_admin');
        }])->latest()->get();
        
        return Inertia::render('Superadmin/School/Index', ['schools' => $schools]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            // 1. Buat Profil Sekolah DULU
            $school = School::create([
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                // Berat default SPK dari SKPL
                'spk_hard_skill_weight' => 60,
                'spk_soft_skill_weight' => 40,
            ]);

            // 2. Buat Akun Admin Sekolah dan ikat dengan school_id
            User::create([
                'name' => 'Admin ' . $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'school_admin',
                'school_id' => $school->id, // Ikatan Multi-Tenant
            ]);
        });

        return redirect()->back()->with('message', 'Sekolah berhasil didaftarkan!');
    }

    public function destroy(School $school)
    {
        // Hapus sekolah (user akan ikut terhapus otomatis jika diset cascade di database)
        $school->delete(); 
        return redirect()->back()->with('message', 'Sekolah berhasil dihapus!');
    }
}