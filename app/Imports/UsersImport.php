<?php

namespace App\Imports;

use App\Models\User;
use App\Models\StudyClass;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    protected $schoolId;

    public function __construct($schoolId)
    {
        $this->schoolId = $schoolId;
    }

    public function model(array $row)
    {
        $inputRole = strtolower($row['role'] ?? 'student');
        
        $roleMap = [
            'pelatih'      => 'instructor',
            'instructor'   => 'instructor',
            'siswa'        => 'student',
            'student'      => 'student',
            'wali murid'   => 'parent',
            'parent'       => 'parent',
            'wali'         => 'parent',
        ];

        $role = $roleMap[$inputRole] ?? 'student';
        
        $data = [
            'name'      => $row['nama'],
            'email'     => $row['email'] ?? $this->generateEmail($row['nama'], $role),
            'password'  => Hash::make($row['password'] ?? 'Brewtech123!'),
            'role'      => $role,
            'school_id' => $this->schoolId,
        ];

        if ($role === 'student') {
            // Find class by name if provided
            if (!empty($row['kelas'])) {
                $class = StudyClass::where('school_id', $this->schoolId)
                    ->where('name', 'like', '%' . $row['kelas'] . '%')
                    ->first();
                if ($class) {
                    $data['kelas_id'] = $class->id;
                }
            }

            // Find parent by name if provided
            if (!empty($row['orang_tua'])) {
                $parent = User::where('school_id', $this->schoolId)
                    ->where('role', 'parent')
                    ->where('name', 'like', '%' . $row['orang_tua'] . '%')
                    ->first();
                if ($parent) {
                    $data['parent_id'] = $parent->id;
                }
            }

            $data['disability_type'] = $row['tipe_disabilitas'] ?? null;
        }

        return new User($data);
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'role' => 'required|in:instructor,student,parent,pelatih,siswa,wali murid',
            'email' => 'nullable|email',
        ];
    }

    private function generateEmail($name, $role)
    {
        $randomNum = rand(1000, 9999);
        $cleanName = Str::slug($name, '');
        $domain = $role === 'student' ? 'student.brewtech.com' : 'brewtech.com';
        return $cleanName . $randomNum . '@' . $domain;
    }
}
