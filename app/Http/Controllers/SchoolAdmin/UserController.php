<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\StudyClass;
use App\Exports\UsersExport;
use App\Imports\UsersImport;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Illuminate\Support\Str; // Tambahkan ini untuk helper string

class UserController extends Controller
{
    public function index()
    {
        $schoolId = auth()->user()->school_id;

        $instructors = User::where('school_id', $schoolId)->where('role', 'instructor')->get();
        
        // PERBAIKAN 1: Ganti 'class' menjadi 'studentClass'
        $students = User::with(['studentClass', 'parent'])
            ->where('school_id', $schoolId)
            ->where('role', 'student')
            ->get();
            
        $parents = User::with('children')->where('school_id', $schoolId)->where('role', 'parent')->get();
        $classes = StudyClass::where('school_id', $schoolId)->get();
        $parentsList = User::where('school_id', $schoolId)->where('role', 'parent')->get();

        return Inertia::render('SchoolAdmin/UsersManager', compact('instructors', 'students', 'parents', 'classes', 'parentsList'));
    }

    public function store(Request $request)
    {
        $role = $request->input('role');

        // PERBAIKAN 2: Validasi Dinamis berdasarkan Role
        $rules = [
            'name' => 'required|string|max:255',
            'role' => 'required|in:instructor,student,parent',
        ];

        // Jika Pelatih atau Wali Murid, wajib punya Email & Password
        if ($role === 'instructor' || $role === 'parent') {
            $rules['email'] = 'required|email|unique:users,email';
            $rules['password'] = 'required|string|min:8';
        } 
        // Jika Siswa, wajib punya Kelas & Wali, tapi tidak butuh input email/password manual
        elseif ($role === 'student') {
            $rules['kelas_id'] = 'required|exists:study_classes,id';
            $rules['parent_id'] = 'required|exists:users,id';
            $rules['disability_type'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        // Siapkan data dasar
        $data = [
            'name'      => $validated['name'],
            'role'      => $validated['role'],
            'school_id' => auth()->user()->school_id,
        ];

        // Assign data sesuai Role
        if ($role === 'instructor' || $role === 'parent') {
            $data['email']    = $validated['email'];
            $data['password'] = bcrypt($validated['password']);
        } elseif ($role === 'student') {
            // Karena tabel User biasanya mewajibkan kolom 'email', kita generate otomatis untuk siswa
            // Format: namasiswa_1234@student.brewtech.com
            $randomNum = rand(1000, 9999);
            $cleanName = Str::slug($validated['name'], ''); // Menghapus spasi dan karakter unik
            
            $data['email']           = $cleanName . $randomNum . '@student.brewtech.com';
            $data['password']        = bcrypt('SiswaBrewtech123!'); // Password default siswa
            $data['kelas_id']        = $validated['kelas_id'];
            $data['parent_id']       = $validated['parent_id'];
            $data['disability_type'] = $validated['disability_type'] ?? null;
        }

        User::create($data);

        return redirect()->back()->with('message', 'Pengguna berhasil ditambahkan!');
    }

    public function export(Request $request)
    {
        $schoolId = auth()->user()->school_id;
        $format = $request->input('format', 'excel');
        $role = $request->input('role');

        $filename = 'pengguna-sekolah-' . now()->format('d-m-Y-Hi');

        if ($format === 'csv') {
            $filename .= '.csv';
        } else {
            $filename .= '.xlsx';
        }

        return Excel::download(new UsersExport($schoolId, $role), $filename);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv',
        ]);

        $schoolId = auth()->user()->school_id;

        Excel::import(new UsersImport($schoolId), $request->file('file'));

        return redirect()->back()->with('message', 'Data pengguna berhasil diimpor!');
    }

    public function update(Request $request, User $user)
    {
        // Pastikan user milik sekolah yang sama
        if ($user->school_id !== auth()->user()->school_id) {
            abort(403);
        }

        $rules = [
            'name' => 'required|string|max:255',
        ];

        if ($user->role === 'instructor' || $user->role === 'parent') {
            $rules['email'] = 'required|email|unique:users,email,' . $user->id;
            if ($request->filled('password')) {
                $rules['password'] = 'required|string|min:8';
            }
        } elseif ($user->role === 'student') {
            $rules['kelas_id'] = 'required|exists:study_classes,id';
            $rules['parent_id'] = 'required|exists:users,id';
            $rules['disability_type'] = 'nullable|string';
        }

        $validated = $request->validate($rules);

        $data = [
            'name' => $validated['name'],
        ];

        if ($user->role === 'instructor' || $user->role === 'parent') {
            $data['email'] = $validated['email'];
            if ($request->filled('password')) {
                $data['password'] = bcrypt($validated['password']);
            }
        } elseif ($user->role === 'student') {
            $data['kelas_id'] = $validated['kelas_id'];
            $data['parent_id'] = $validated['parent_id'];
            $data['disability_type'] = $validated['disability_type'];
        }

        $user->update($data);

        return redirect()->back()->with('message', 'Pengguna berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        if ($user->school_id !== auth()->user()->school_id) {
            abort(403);
        }

        $user->delete();

        return redirect()->back()->with('message', 'Pengguna berhasil dihapus!');
    }
}