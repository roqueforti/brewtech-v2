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
            // 1. Create Mitra Cafe
            $cafe = Cafe::create([
                'name' => "Mitra Cafe $region",
                'address' => "Jl. Ahmad Yani No." . ($index + 1) . ", $region",
                'phone' => '0813' . rand(10000000, 99999999),
            ]);

            User::create([
                'name' => "Admin $cafe->name",
                'email' => "admin." . strtolower($region) . "@mitracafe.com",
                'password' => Hash::make('password123'),
                'role' => 'cafe_admin',
                'cafe_id' => $cafe->id,
            ]);

            // Dummy products for each cafe
            $products = ['Espresso', 'Latte', 'Cappuccino', 'Croissant', 'Muffin'];
            foreach ($products as $p) {
                Product::create([
                    'cafe_id' => $cafe->id,
                    'name' => $p,
                    'price' => 15000,
                    'cost_price' => 7000,
                    'stock' => 50,
                    'status' => true,
                ]);
            }

            // 2. Create Mitra School
            $school = School::create([
                'name' => "SLB Negeri $region",
                'address' => "Jl. Sudirman No." . ($index + 10) . ", $region",
                'phone' => '021-' . rand(1000000, 9999999),
            ]);

            User::create([
                'name' => "Admin $school->name",
                'email' => "admin." . strtolower($region) . "@slb.sch.id",
                'password' => Hash::make('password123'),
                'role' => 'school_admin',
                'school_id' => $school->id,
            ]);

            // Create 1 class per school
            $class = StudyClass::create([
                'name' => "Kelas Vokasi $region",
                'school_id' => $school->id,
                'emoji_icon' => '🌟',
                // instructor_id will be set after creating instructors
            ]);

            // Create instructors
            $instructors = [];
            for ($i = 1; $i <= 3; $i++) {
                $instructors[] = User::create([
                    'name' => "Instructor $i $region",
                    'email' => "instructor$i." . strtolower($region) . "@slb.com",
                    'password' => Hash::make('password123'),
                    'role' => 'instructor',
                    'school_id' => $school->id,
                ]);
            }
            $class->update(['instructor_id' => $instructors[0]->id]);

            // Create 5 Student-Parent pairs per mitra school
            for ($s = 1; $s <= 5; $s++) {
                $parent = User::create([
                    'name' => "Orang Tua $s $region",
                    'email' => "parent$s." . strtolower($region) . "@slb.com",
                    'password' => Hash::make('password123'),
                    'role' => 'parent',
                    'school_id' => $school->id,
                ]);

                User::create([
                    'name' => "Siswa $s $region",
                    'email' => "student$s." . strtolower($region) . "@slb.com",
                    'password' => Hash::make('password123'),
                    'role' => 'student',
                    'school_id' => $school->id,
                    'kelas_id' => $class->id,
                    'parent_id' => $parent->id,
                    'disability_type' => 'Disabilitas Fisik',
                ]);
            }
        }
    }
}
