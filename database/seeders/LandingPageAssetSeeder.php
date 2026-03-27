<?php

namespace Database\Seeders;

use App\Models\LandingPageAsset;
use Illuminate\Database\Seeder;

class LandingPageAssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Hero Banners (Based on Welcome.tsx defaults)
        $banners = [
            [
                'type' => 'hero_banner',
                'image_path' => '/images/hero_1.png',
                'title' => 'Satu Portal Inklusif',
                'description' => 'Platform SaaS pendidikan vokasi disabilitas.',
                'order' => 1,
            ],
            [
                'type' => 'hero_banner',
                'image_path' => '/images/hero_2.png',
                'title' => 'Mencetak Talenta Barista',
                'description' => 'Pelatihan berbasis kompetensi untuk masa depan cerah.',
                'order' => 2,
            ],
            [
                'type' => 'hero_banner',
                'image_path' => '/images/hero_3.png',
                'title' => 'Dunia Kerja Menanti',
                'description' => 'Disalurkan langsung ke Mitra Kafe Among Rasa.',
                'order' => 3,
            ],
        ];

        // 2. Gallery Documentation (Initial Placeholders)
        $gallery = [
            [
                'type' => 'gallery_documentation',
                'image_path' => '/images/hero_1.png',
                'title' => 'Pelatihan Barista Dasar',
                'description' => 'Siswa belajar teknik brewing manual.',
                'order' => 1,
            ],
            [
                'type' => 'gallery_documentation',
                'image_path' => '/images/hero_2.png',
                'title' => 'Sesi Penilaian SPK',
                'description' => 'Instruktur menilai kompetensi soft skill siswa.',
                'order' => 2,
            ],
            [
                'type' => 'gallery_documentation',
                'image_path' => '/images/hero_3.png',
                'title' => 'Kunjungan Mitra Kafe',
                'description' => 'Persiapan penyaluran kerja ke industri.',
                'order' => 3,
            ],
        ];

        foreach (array_merge($banners, $gallery) as $asset) {
            LandingPageAsset::create($asset);
        }
    }
}
