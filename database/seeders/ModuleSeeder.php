<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\ModuleMaterial;
use App\Models\ModuleQuestion;
use App\Models\ModuleQuestionOption;
use App\Models\ModuleSoftSkillCriteria;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modulesData = [
            [
                'title' => 'Choco Latte',
                'desc' => 'Teknik meracik minuman cokelat dengan tekstur creamy dan latte art sederhana.',
                'materials' => [
                    ['type' => 'alat', 'content' => 'Cangkir Keramik & Saucer (Kapasitas 200-250 ml)', 'media' => '/images/hero_1.png'],
                    ['type' => 'alat', 'content' => 'Milk Steaming Pitcher / Jug Stainless (350 ml)', 'media' => '/images/hero_2.png'],
                    ['type' => 'alat', 'content' => 'Bar Spoon Stainless Steel Pengaduk', 'media' => null],
                    ['type' => 'alat', 'content' => 'Thermometer Pengukur Suhu Susu', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Bubuk Cokelat Murni (Cocoa Powder 25-30 gr)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Susu Segar UHT / Pasteurisasi (150-180 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Sirup Gula / Simple Syrup (15 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Air Panas Bersih (30 ml)', 'media' => null],
                    ['type' => 'langkah', 'content' => '1. Larutkan bubuk cokelat dengan 30ml air panas di dalam cangkir hingga larut sempurna dan tidak ada gumpalan.', 'media' => null],
                    ['type' => 'langkah', 'content' => '2. Masukkan susu segar dingin ke dalam pitcher hingga batas bawah moncong pitcher.', 'media' => null],
                    ['type' => 'langkah', 'content' => '3. Panaskan susu dengan steam wand mesin kopi hingga suhu mencapai 60°C - 65°C dan terbentuk busa mikro halus.', 'media' => null],
                    ['type' => 'langkah', 'content' => '4. Tuang susu hangat perlahan ke dalam cangkir cokelat dengan gerakan memutar stabil hingga cangkir terisi penuh.', 'media' => null],
                ],
                'questions' => [
                    [
                        'type' => 'pre_test',
                        'text' => 'Berapa suhu ideal untuk memanaskan susu (steaming milk) agar manis alaminya keluar optimal?',
                        'options' => [
                            ['text' => '60°C - 65°C', 'is_correct' => true],
                            ['text' => '100°C mendidih', 'is_correct' => false],
                            ['text' => '30°C hangat kuku', 'is_correct' => false],
                            ['text' => '85°C sangat panas', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'pre_test',
                        'text' => 'Alat apa yang digunakan untuk melarutkan bubuk cokelat di dalam cangkir?',
                        'options' => [
                            ['text' => 'Bar Spoon Stainless Steel', 'is_correct' => true],
                            ['text' => 'Portafilter', 'is_correct' => false],
                            ['text' => 'Tamper kopi', 'is_correct' => false],
                            ['text' => 'Knockbox', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Ciri tekstur busa susu (microfoam) yang baik dan benar untuk Choco Latte adalah?',
                        'options' => [
                            ['text' => 'Halus mengkilap (glossy) tanpa gelembung besar', 'is_correct' => true],
                            ['text' => 'Kering berbusa tebal seperti sabun', 'is_correct' => false],
                            ['text' => 'Bergelembung besar dan kasar', 'is_correct' => false],
                            ['text' => 'Dingin dan encer', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Mengapa bubuk cokelat harus dilarutkan dengan sedikit air panas terlebih dahulu sebelum dituang susu?',
                        'options' => [
                            ['text' => 'Agar cokelat larut homogen dan tidak menggumpal di dasar cangkir', 'is_correct' => true],
                            ['text' => 'Agar warnanya memudar', 'is_correct' => false],
                            ['text' => 'Agar susu tidak basi', 'is_correct' => false],
                            ['text' => 'Hanya sebagai hiasan', 'is_correct' => false],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Matchabiyu',
                'desc' => 'Persiapan Matcha berkualitas tinggi dengan campuran susu yang seimbang.',
                'materials' => [
                    ['type' => 'alat', 'content' => 'Chasen (Pengaduk Bambu Tradisional Matcha)', 'media' => '/images/hero_2.png'],
                    ['type' => 'alat', 'content' => 'Chawan (Mangkuk Keramik Pengocok Matcha)', 'media' => null],
                    ['type' => 'alat', 'content' => 'Saringan Halus (Fine Mesh Sieve)', 'media' => null],
                    ['type' => 'alat', 'content' => 'Gelas Saji Transparan (Serving Glass 350 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Bubuk Pure Matcha Grade A (5 gr)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Susu Segar Dingin (Fresh Milk 150 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Air Hangat Suhu 80°C (40 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Sirup Vanila / Gula Cair (15 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Es Batu Kristal Secukupnya', 'media' => null],
                    ['type' => 'langkah', 'content' => '1. Ayak 5 gram bubuk matcha menggunakan saringan halus ke dalam mangkuk Chawan.', 'media' => null],
                    ['type' => 'langkah', 'content' => '2. Tuangkan 40 ml air hangat bersuhu 80°C ke dalam mangkuk matcha.', 'media' => null],
                    ['type' => 'langkah', 'content' => '3. Kocok menggunakan Chasen dengan gerakan zig-zag cepat membentuk huruf "W" hingga berbusa hijau cerah.', 'media' => null],
                    ['type' => 'langkah', 'content' => '4. Siapkan gelas saji, isi dengan sirup, es batu, dan susu segar dingin hingga 3/4 penuh.', 'media' => null],
                    ['type' => 'langkah', 'content' => '5. Tuangkan lapisan matcha yang telah berbusa perlahan di bagian paling atas untuk efek visual dua warna (layering).', 'media' => null],
                ],
                'questions' => [
                    [
                        'type' => 'pre_test',
                        'text' => 'Pengaduk bambu tradisional khas Jepang untuk mengocok matcha disebut?',
                        'options' => [
                            ['text' => 'Chasen', 'is_correct' => true],
                            ['text' => 'V60 Dripper', 'is_correct' => false],
                            ['text' => 'Aeropress', 'is_correct' => false],
                            ['text' => 'French Press', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'pre_test',
                        'text' => 'Berapa suhu air yang ideal untuk menyeduh bubuk matcha agar tidak hangus dan pahit?',
                        'options' => [
                            ['text' => 'Sekitar 80°C', 'is_correct' => true],
                            ['text' => 'Air mendidih 100°C', 'is_correct' => false],
                            ['text' => 'Air es 5°C', 'is_correct' => false],
                            ['text' => 'Air mentah', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Bagaimana gerakan tangan yang tepat saat menggunakan Chasen untuk menghasilkan busa matcha yang lembut?',
                        'options' => [
                            ['text' => 'Gerakan zig-zag cepat menyerupai huruf "W"', 'is_correct' => true],
                            ['text' => 'Gerakan memutar searah jarum jam perlahan', 'is_correct' => false],
                            ['text' => 'Menekan Chasen kuat-kuat ke dasar mangkuk', 'is_correct' => false],
                            ['text' => 'Mengocok Chasen ke atas dan ke bawah vertikal', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Mengapa bubuk matcha perlu diayak sebelum diseduh?',
                        'options' => [
                            ['text' => 'Mencegah gumpalan bubuk agar matcha larut lembut sempurna', 'is_correct' => true],
                            ['text' => 'Menghilangkan aroma matcha', 'is_correct' => false],
                            ['text' => 'Mengubah warna matcha menjadi gelap', 'is_correct' => false],
                            ['text' => 'Agar rasa matcha menjadi manis', 'is_correct' => false],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Thai Tea',
                'desc' => 'Tradisi menyeduh Thai Tea otentik dengan racikan rempah dan susu kental manis.',
                'materials' => [
                    ['type' => 'alat', 'content' => 'Saringan Kain Tradisional (Thai Tea Sock Filter)', 'media' => '/images/hero_3.png'],
                    ['type' => 'alat', 'content' => 'Teko Stainless Steel (Pitcher Tarik 2 buah)', 'media' => null],
                    ['type' => 'alat', 'content' => 'Jigger (Gelas Ukur Takar 15/30 ml)', 'media' => null],
                    ['type' => 'alat', 'content' => 'Gelas Saji Kaca Tinggi (350-400 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Daun Teh Hitam Thailand (Thai Tea Mix 20 gr)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Air Panas Mendidih (200 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Susu Kental Manis (30 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Susu Evaporasi (20 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Es Batu Kristal Secukupnya', 'media' => null],
                    ['type' => 'langkah', 'content' => '1. Masukkan daun teh Thailand ke dalam saringan kain di atas teko pertama.', 'media' => null],
                    ['type' => 'langkah', 'content' => '2. Tuangkan 200 ml air mendidih dan diamkan selama 3-4 menit hingga terekstrak pekat.', 'media' => null],
                    ['type' => 'langkah', 'content' => '3. Lakukan teknik tarikan teh dengan menuang bolak-balik antara teko pertama dan kedua sebanyak 3-4 kali.', 'media' => null],
                    ['type' => 'langkah', 'content' => '4. Campurkan susu kental manis ke dalam ekstrak teh panas, aduk rata hingga berwarna oranye khas.', 'media' => null],
                    ['type' => 'langkah', 'content' => '5. Tuang ke dalam gelas berisi es batu, lalu siramkan susu evaporasi di lapisan atas untuk rasa gurih creamy.', 'media' => null],
                ],
                'questions' => [
                    [
                        'type' => 'pre_test',
                        'text' => 'Saringan khas yang digunakan untuk menyeduh Thai Tea otentik berbentuk?',
                        'options' => [
                            ['text' => 'Saringan kain panjang berbentuk kantong (Sock Filter)', 'is_correct' => true],
                            ['text' => 'Saringan kertas lipat V60', 'is_correct' => false],
                            ['text' => 'Saringan kawat kasa datar', 'is_correct' => false],
                            ['text' => 'Filter keramik pori', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'pre_test',
                        'text' => 'Berapa lama waktu seduh ideal daun teh Thailand agar rasa sepatnya pas dan tidak pahit berlebihan?',
                        'options' => [
                            ['text' => '3 hingga 4 menit', 'is_correct' => true],
                            ['text' => '30 menit', 'is_correct' => false],
                            ['text' => '10 detik saja', 'is_correct' => false],
                            ['text' => '1 jam', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Bahan susu apa yang dituangkan di bagian paling atas Thai Tea untuk menghasilkan rasa gurih legit?',
                        'options' => [
                            ['text' => 'Susu Evaporasi', 'is_correct' => true],
                            ['text' => 'Susu Kedelai tawar', 'is_correct' => false],
                            ['text' => 'Susu skim bebas lemak', 'is_correct' => false],
                            ['text' => 'Yogurt asam', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Apa tujuan menuang teh secara bolak-balik antara dua teko (tarikan teh)?',
                        'options' => [
                            ['text' => 'Membantu aerasi rasa teh dan mencampur sari teh secara merata', 'is_correct' => true],
                            ['text' => 'Menghilangkan warna teh', 'is_correct' => false],
                            ['text' => 'Membuat teh menjadi beku', 'is_correct' => false],
                            ['text' => 'Menambah jumlah air', 'is_correct' => false],
                        ]
                    ],
                ]
            ],
            [
                'title' => 'Kopi Susu',
                'desc' => 'Kreasi kopi susu kekinian yang populer dengan gula aren pilihan.',
                'materials' => [
                    ['type' => 'alat', 'content' => 'Mesin Espresso / Rok Presso / Moka Pot Pembuat Kopi', 'media' => '/images/hero_1.png'],
                    ['type' => 'alat', 'content' => 'Grinder Kopi (Penggiling Biji Kopi Espresso)', 'media' => null],
                    ['type' => 'alat', 'content' => 'Gelas Ukur Espresso (Shot Glass 60 ml)', 'media' => null],
                    ['type' => 'alat', 'content' => 'Gelas Saji Cup 14-16 oz', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Biji Kopi Sangrai Espresso Blend (18-20 gr)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Sirup Gula Aren Organik Asli (25 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Susu Segar Dingin (Fresh Milk Full Cream 120 ml)', 'media' => null],
                    ['type' => 'bahan', 'content' => 'Es Batu Balok / Tube Secukupnya', 'media' => null],
                    ['type' => 'langkah', 'content' => '1. Giling 18-20 gram biji kopi dengan tingkat kehalusan fine, lalu ekstraksi double shot espresso (35-40 ml).', 'media' => null],
                    ['type' => 'langkah', 'content' => '2. Masukkan 25 ml sirup gula aren ke dasar gelas saji.', 'media' => null],
                    ['type' => 'langkah', 'content' => '3. Tambahkan es batu secukupnya hingga mencapai 3/4 volume gelas.', 'media' => null],
                    ['type' => 'langkah', 'content' => '4. Tuangkan 120 ml susu segar dingin di atas es batu secara perlahan.', 'media' => null],
                    ['type' => 'langkah', 'content' => '5. Tuangkan espresso panas di atas susu secara mengambang (floating) sehingga membentuk gradasi warna 3 layer yang estetik.', 'media' => null],
                ],
                'questions' => [
                    [
                        'type' => 'pre_test',
                        'text' => 'Berapa volume standar untuk ekstraksi 1 shot espresso tunggal?',
                        'options' => [
                            ['text' => '30 ml - 35 ml', 'is_correct' => true],
                            ['text' => '150 ml', 'is_correct' => false],
                            ['text' => '5 ml', 'is_correct' => false],
                            ['text' => '500 ml', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'pre_test',
                        'text' => 'Jenis biji kopi apa yang paling umum dipadukan dalam es kopi susu aren agar rasa kopinya tetap kuat menonjol?',
                        'options' => [
                            ['text' => 'Robusta atau Blend Robusta-Arabika', 'is_correct' => true],
                            ['text' => 'Kopi Luwak murni', 'is_correct' => false],
                            ['text' => 'Kopi Decaf tanpa kafein', 'is_correct' => false],
                            ['text' => 'Kopi Hijau mentah', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Urutan memasukkan bahan yang benar agar menghasilkan tampilan 3 layer yang cantik adalah?',
                        'options' => [
                            ['text' => 'Gula Aren -> Es Batu -> Susu Segar -> Espresso', 'is_correct' => true],
                            ['text' => 'Espresso -> Susu -> Gula Aren -> Es Batu', 'is_correct' => false],
                            ['text' => 'Susu -> Gula Aren -> Espresso -> Es Batu', 'is_correct' => false],
                            ['text' => 'Es Batu -> Espresso -> Susu -> Gula Aren', 'is_correct' => false],
                        ]
                    ],
                    [
                        'type' => 'post_test',
                        'text' => 'Mengapa espresso dituangkan paling akhir di lapisan atas?',
                        'options' => [
                            ['text' => 'Karena densitasnya lebih ringan di atas es/susu sehingga membentuk layer estetik', 'is_correct' => true],
                            ['text' => 'Agar kopi cepat dingin', 'is_correct' => false],
                            ['text' => 'Agar rasa kopi menghilang', 'is_correct' => false],
                            ['text' => 'Hanya kebiasaan tanpa alasan teknis', 'is_correct' => false],
                        ]
                    ],
                ]
            ],
        ];

        $criteriaNames = ['Kedisiplinan', 'Kerja Sama', 'Komunikasi', 'Kebersihan', 'Inisiatif'];

        foreach ($modulesData as $index => $mod) {
            $module = Module::updateOrCreate(
                ['title' => $mod['title']],
                [
                    'description' => $mod['desc'],
                    'order' => $index + 1,
                ]
            );

            // 1. Add Materials (Alat, Bahan, Langkah)
            if (isset($mod['materials'])) {
                foreach ($mod['materials'] as $mOrder => $mat) {
                    ModuleMaterial::updateOrCreate(
                        [
                            'module_id' => $module->id,
                            'type' => $mat['type'],
                            'content_text' => $mat['content'],
                        ],
                        [
                            'media_url' => $mat['media'] ?? null,
                            'order' => $mOrder + 1,
                        ]
                    );
                }
            }

            // 2. Add Questions (Pre-test & Post-test) with Options
            if (isset($mod['questions'])) {
                foreach ($mod['questions'] as $qData) {
                    $question = ModuleQuestion::updateOrCreate(
                        [
                            'module_id' => $module->id,
                            'type' => $qData['type'],
                            'question_text' => $qData['text'],
                        ]
                    );

                    foreach ($qData['options'] as $opt) {
                        ModuleQuestionOption::updateOrCreate(
                            [
                                'module_question_id' => $question->id,
                                'option_text' => $opt['text'],
                            ],
                            [
                                'is_correct' => (bool)$opt['is_correct'],
                            ]
                        );
                    }
                }
            }

            // 3. Add Soft Skill Criteria
            foreach ($criteriaNames as $cName) {
                ModuleSoftSkillCriteria::updateOrCreate(
                    ['module_id' => $module->id, 'criteria_name' => $cName]
                );
            }
        }
    }
}
