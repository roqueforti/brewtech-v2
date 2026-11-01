<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;
use App\Models\Cafe;
use App\Models\User;
use App\Models\Product;
use App\Models\StudyClass;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MitraScaleSeeder extends Seeder
{
    public function run(): void
    {
        $regions = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Batam', 'Denpasar', 'Balikpapan'];

        foreach ($regions as $index => $region) {
            $regLower = strtolower($region);

            // 1. Create Mitra Cafe
            $cafe = Cafe::updateOrCreate(
                ['name' => "Mitra Cafe $region"],
                [
                    'email'   => "kontak.$regLower@mitracafe.com",
                    'status'  => 'active',
                    'address' => "Jl. Ahmad Yani No." . ($index + 1) . ", $region",
                    'phone'   => '0813' . rand(10000000, 99999999),
                ]
            );

            User::updateOrCreate(
                ['email' => "admin.$regLower@mitracafe.com"],
                [
                    'name'     => "Admin $cafe->name",
                    'password' => Hash::make('password123'),
                    'role'     => 'cafe_admin',
                    'cafe_id'  => $cafe->id,
                ]
            );

            // Dummy products for each cafe
            $products = ['Espresso', 'Latte', 'Cappuccino', 'Croissant', 'Muffin'];
            foreach ($products as $p) {
                Product::updateOrCreate(
                    ['cafe_id' => $cafe->id, 'name' => $p],
                    [
                        'price'      => 15000,
                        'cost_price' => 7000,
                        'stock'      => 50,
                        'status'     => true,
                    ]
                );
            }

            // 2. Create Mitra School
            $school = School::updateOrCreate(
                ['name' => "SLB Negeri $region"],
                [
                    'address'               => "Jl. Sudirman No." . ($index + 10) . ", $region",
                    'phone'                 => '021-' . rand(1000000, 9999999),
                    'spk_hard_skill_weight' => 60,
                    'spk_soft_skill_weight' => 40,
                ]
            );

            User::updateOrCreate(
                ['email' => "admin.$regLower@slb.sch.id"],
                [
                    'name'      => "Admin $school->name",
                    'password'  => Hash::make('password123'),
                    'role'      => 'school_admin',
                    'school_id' => $school->id,
                ]
            );

            // Create 1 class per school
            $class = StudyClass::updateOrCreate(
                ['name' => "Kelas Vokasi $region", 'school_id' => $school->id],
                [
                    'emoji_icon' => '🌟',
                ]
            );

            // Create instructors
            $instructors = [];
            for ($i = 1; $i <= 3; $i++) {
                $instructors[] = User::updateOrCreate(
                    ['email' => "instructor$i.$regLower@slb.com"],
                    [
                        'name'      => "Instructor $i $region",
                        'password'  => Hash::make('password123'),
                        'role'      => 'instructor',
                        'school_id' => $school->id,
                    ]
                );
            }
            $class->update(['instructor_id' => $instructors[0]->id]);

            // Create 5 Student-Parent pairs per mitra school
            $disabilityPool = ['Disabilitas Fisik', 'Disabilitas Sensorik Rungu', 'Disabilitas Sensorik Netra', 'Disabilitas Intelektual', 'Autisme'];
            for ($s = 1; $s <= 5; $s++) {
                $parent = User::updateOrCreate(
                    ['email' => "parent$s.$regLower@slb.com"],
                    [
                        'name'      => "Orang Tua $s $region",
                        'password'  => Hash::make('password123'),
                        'role'      => 'parent',
                        'school_id' => $school->id,
                    ]
                );

                User::updateOrCreate(
                    ['email' => "student$s.$regLower@slb.com"],
                    [
                        'name'            => "Siswa $s $region",
                        'password'        => Hash::make('password123'),
                        'role'            => 'student',
                        'school_id'       => $school->id,
                        'kelas_id'        => $class->id,
                        'parent_id'       => $parent->id,
                        'disability_type' => $disabilityPool[($s - 1) % count($disabilityPool)],
                        'ready_for_pkl'   => ($s > 2),
                    ]
                );
            }
        }
    }
}
