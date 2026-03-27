<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\User;
use App\Models\StudyClass;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class YpacSchoolSeeder extends Seeder
{
    public function run(): void
    {
        $school = School::updateOrCreate(
            ['name' => 'SLB YPAC KOTA MALANG'],
            [
                'address' => 'Jl. Tumenggung Suryo No.39, Bunulrejo, Kec. Blimbing, Kota Malang',
                'phone' => '0341-491680',
                'spk_hard_skill_weight' => 40,
                'spk_soft_skill_weight' => 60,
            ]
        );

        // Akun Admin Sekolah
        User::updateOrCreate(
            ['email' => 'admin@slbypacmalang.sch.id'],
            [
                'name' => 'Admin YPAC Malang',
                'password' => Hash::make('password123'),
                'role' => 'school_admin',
                'school_id' => $school->id,
            ]
        );

        // Daftar Guru Pendamping (Instructors)
        $instructorsData = [
            'Lilik Kurniyati S.Pd., Gr',
            'Ravelia Saktiasari S.Pd., Gr',
            'Amma Rochana S.Pd',
            'Chatarina Suniyati S.Pd',
            'Wanda Kharisma Sari S.Pd',
            'Ulul Azmi',
            'Khoiruddin Hidayatullah S.Psi',
            'Liya (External Pelatih Barista)'
        ];

        $instructors = [];
        foreach ($instructorsData as $index => $name) {
            $emailName = str_replace([' ', '.', ','], '', strtolower($name));
            $instructors[] = User::updateOrCreate(
                ['email' => $emailName . '@instructor.com'],
                [
                    'name' => $name,
                    'password' => Hash::make('password123'),
                    'role' => 'instructor',
                    'school_id' => $school->id,
                ]
            );
        }

        // Buat Kelas Spesifik
        $baristaClass = StudyClass::updateOrCreate(
            ['name' => 'Pelatihan Barista The Cup We Share', 'school_id' => $school->id],
            [
                'emoji_icon' => '☕',
                'instructor_id' => $instructors[0]->id, // Lilik as default
            ]
        );

        // Daftar Siswa & Wali Murid
        $studentParentData = [
            ['Arlando Malanesia Waran', 'Veronika Worabay'],
            ['Ajwa Achmad Zanjabil', 'Anis Yuliatin'],
            ['Dzaky Althaf Wijaya', 'Prihatin Rusmi'],
            ['Muhammad Fahmi Ammar', 'Karina Eksyania Sandi'],
            ['Rajawali Pamungkas', 'Sunarti'],
            ['Agam Baharudin Syahputra', 'Sutik Indrawati'],
            ['Muhammad Arif Setiawan', 'Sulistyowati'],
            ['Muhammad Aldi Firmansyah', 'Eny'],
            ['Muchammad Robichul Mirza', 'Suswati'],
            ['Shintya Ayu Rizki Ramadhani', 'Puji Utami'],
            ['Renaldi Aditya Pratama', 'Tantri Wardhani'],
            ['Juliam Rutin Putra', 'Esther Tabua Sulele'],
            ['Xavier Anarghyaza Radike', 'Nucke Indriawati'],
            ['Valent Apriliano', 'Anita Pujiastuti'],
            ['Dauz', 'Nurul'],
        ];

        $disabilities = [
            'Disabilitas Sensorik Netra',
            'Disabilitas Sensorik Rungu',
            'Disabilitas Intelektual',
            'Disabilitas Fisik',
            'Autisme',
        ];

        foreach ($studentParentData as $data) {
            $studentName = $data[0];
            $parentName = $data[1];

            $pEmail = str_replace(' ', '', strtolower($parentName)) . '@parent.com';
            $sEmail = str_replace(' ', '', strtolower($studentName)) . '@student.com';

            $parent = User::updateOrCreate(
                ['email' => $pEmail],
                [
                    'name' => $parentName,
                    'password' => Hash::make('password123'),
                    'role' => 'parent',
                    'school_id' => $school->id,
                ]
            );

            User::updateOrCreate(
                ['email' => $sEmail],
                [
                    'name' => $studentName,
                    'password' => Hash::make('password123'),
                    'role' => 'student',
                    'school_id' => $school->id,
                    'kelas_id' => $baristaClass->id,
                    'parent_id' => $parent->id,
                    'disability_type' => $disabilities[array_rand($disabilities)],
                    'ready_for_pkl' => (rand(1, 10) > 6),
                ]
            );
        }
    }
}
