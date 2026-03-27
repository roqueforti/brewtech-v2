<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cafe;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class AmongRasaCafeSeeder extends Seeder
{
    public function run(): void
    {
        $cafe = Cafe::updateOrCreate(
            ['name' => 'Among Rasa'],
            [
                'address' => 'Malang, Jawa Timur (Hilirisasi Vokasi)',
                'phone' => '08123456789',
            ]
        );

        // Akun Admin Kafe
        User::updateOrCreate(
            ['email' => 'admin@amongrasa.com'],
            [
                'name' => 'Admin Among Rasa',
                'password' => Hash::make('password123'),
                'role' => 'cafe_admin',
                'cafe_id' => $cafe->id,
            ]
        );

        // Daftar Menu (Sesuai Modul 4 dan Menu Umum)
        $menus = [
            'Choco Latte', 
            'Matchabiyu', 
            'Thai tea', 
            'Kopi Susu Gula Aren',
            'Espresso',
            'Americano',
            'Cappuccino'
        ];

        foreach ($menus as $menu) {
            Product::updateOrCreate(
                ['cafe_id' => $cafe->id, 'name' => $menu],
                [
                    'price' => 15000,
                    'cost_price' => 7000, // Default HPP for insights
                    'stock' => rand(50, 100),
                    'status' => true,
                ]
            );
        }
    }
}
