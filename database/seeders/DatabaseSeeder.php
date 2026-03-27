<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\School;
use App\Models\Cafe;
use App\Models\StudyClass;
use App\Models\Module;
use App\Models\Product;
use App\Models\Transaction;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Superadmin
        User::updateOrCreate(
            ['email' => 'superadmin@brewtech.id'],
            [
                'name' => 'Superadmin Brewtech Nasional',
                'password' => Hash::make('password123'),
                'role' => 'superadmin',
            ]
        );

        // 2. Call specialized seeders
        $this->call([
            ModuleSeeder::class,
            YpacSchoolSeeder::class,
            AmongRasaCafeSeeder::class,
            ProgressSeeder::class,
            MitraScaleSeeder::class,
            ActivityLogSeeder::class,
            LandingPageAssetSeeder::class,
        ]);
    }
}