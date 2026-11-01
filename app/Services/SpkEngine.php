<?php

namespace App\Services;

class SpkEngine
{
    /**
     * Definisi kriteria standar evaluasi kesiapan kerja barista vokasi inklusif.
     */
    public static function getDefaultCriteria(): array
    {
        return [
            'c1_hardskill' => [
                'code' => 'C1',
                'name' => 'Keahlian Teknis & Resep Kopi (Hard Skill)',
                'type' => 'benefit',
                'weight' => 30,
                'description' => 'Nilai rata-rata kuis teori, pengetahuan rasio seduh, dan langkah peracikan modul barista.',
            ],
            'c2_discipline' => [
                'code' => 'C2',
                'name' => 'Kedisiplinan & Ketepatan Waktu',
                'type' => 'benefit',
                'weight' => 15,
                'description' => 'Kepatuhan jam praktik laboratorium vokasi, ketertiban seragam barista, dan kepatuhan SOP.',
            ],
            'c3_cleanliness' => [
                'code' => 'C3',
                'name' => 'Kebersihan & Higienitas (Food Safety)',
                'type' => 'benefit',
                'weight' => 20,
                'description' => 'Sanitasi steam wand, pembersihan portafilter, dan kerapian stasiun peracikan meja bar.',
            ],
            'c4_teamwork' => [
                'code' => 'C4',
                'name' => 'Kerja Sama Tim & Adaptasi',
                'type' => 'benefit',
                'weight' => 15,
                'description' => 'Kemampuan berbagi stasiun kerja dengan rekan barista dan respons adaptif di lingkungan kerja.',
            ],
            'c5_communication' => [
                'code' => 'C5',
                'name' => 'Komunikasi & Keramahan Tamu',
                'type' => 'benefit',
                'weight' => 10,
                'description' => 'Kerapian gestur pelayanan, keramahan senyum, dan etika komunikasi dengan instruktur/pelanggan.',
            ],
            'c6_initiative' => [
                'code' => 'C6',
                'name' => 'Inisiatif & Tanggap Masalah',
                'type' => 'benefit',
                'weight' => 10,
                'description' => 'Kecepatan inisiatif merestok bahan, membersihkan tumpahan, dan meminta bimbingan saat kendala.',
            ],
        ];
    }

    /**
     * Jalankan analisis MCDM multi-algoritma (SAW, WP, TOPSIS)
     *
     * @param array $candidates Array siswa dengan scores per kriteria
     * @param array $customWeights Bobot kustom (opsional)
     * @param string $method 'saw' | 'wp' | 'topsis'
     * @return array Hasil kalkulasi lengkap beserta matriks penjelasan ilmiah
     */
    public static function analyze(array $candidates, array $customWeights = [], string $method = 'saw'): array
    {
        $criteria = self::getDefaultCriteria();
        $method = strtolower($method);
        if (!in_array($method, ['saw', 'wp', 'topsis'])) {
            $method = 'saw';
        }

        // Terapkan bobot kustom jika ada
        foreach ($criteria as $key => $c) {
            if (isset($customWeights[$key]) && is_numeric($customWeights[$key])) {
                $criteria[$key]['weight'] = max(1, (float) $customWeights[$key]);
            }
        }

        // Normalisasi bobot sehingga total = 1.0 (100%)
        $totalWeight = array_sum(array_column($criteria, 'weight'));
        if ($totalWeight <= 0) $totalWeight = 100;
        foreach ($criteria as $key => $c) {
            $criteria[$key]['normalized_weight'] = $c['weight'] / $totalWeight;
        }

        if (empty($candidates)) {
            return [
                'method' => $method,
                'criteria' => $criteria,
                'ranking' => [],
                'matrices' => [],
            ];
        }

        // 1. Matriks Keputusan Asal (X)
        $matrixX = [];
        foreach ($candidates as $cand) {
            $row = [];
            foreach ($criteria as $cKey => $cVal) {
                $val = (float) ($cand['scores'][$cKey] ?? 70);
                // Batasi nilai rentang 1 - 100 agar aman dalam operasi matematis
                $row[$cKey] = max(1.0, min(100.0, $val));
            }
            $matrixX[$cand['id']] = $row;
        }

        // Jalankan algoritma yang dipilih
        switch ($method) {
            case 'wp':
                $result = self::calculateWeightedProduct($candidates, $matrixX, $criteria);
                break;
            case 'topsis':
                $result = self::calculateTopsis($candidates, $matrixX, $criteria);
                break;
            case 'saw':
            default:
                $result = self::calculateSaw($candidates, $matrixX, $criteria);
                break;
        }

        return $result;
    }

    /**
     * ALGORITMA 1: Simple Additive Weighting (SAW)
     */
    private static function calculateSaw(array $candidates, array $matrixX, array $criteria): array
    {
        // Cari nilai Max untuk kriteria Benefit dan Min untuk Cost
        $extremes = [];
        foreach ($criteria as $cKey => $cVal) {
            $colValues = array_column($matrixX, $cKey);
            $extremes[$cKey] = [
                'max' => !empty($colValues) ? max($colValues) : 100.0,
                'min' => !empty($colValues) ? min($colValues) : 1.0,
            ];
        }

        // Normalisasi Matriks R
        $matrixR = [];
        $rankings = [];

        foreach ($candidates as $cand) {
            $id = $cand['id'];
            $rRow = [];
            $vScore = 0.0;

            foreach ($criteria as $cKey => $cVal) {
                $xVal = $matrixX[$id][$cKey];
                $wNorm = $cVal['normalized_weight'];

                if ($cVal['type'] === 'benefit') {
                    $denom = $extremes[$cKey]['max'] ?: 1.0;
                    $rVal = $xVal / $denom;
                } else {
                    $rVal = $extremes[$cKey]['min'] / ($xVal ?: 1.0);
                }

                $rRow[$cKey] = round($rVal, 4);
                $vScore += ($rVal * $wNorm);
            }

            $matrixR[$id] = $rRow;
            $finalPercentage = round($vScore * 100, 1);

            $softSkillAvg = round(
                ($cand['scores']['c2_discipline'] +
                 $cand['scores']['c3_cleanliness'] +
                 $cand['scores']['c4_teamwork'] +
                 $cand['scores']['c5_communication'] +
                 $cand['scores']['c6_initiative']) / 5,
                1
            );

            $rankings[] = [
                'id' => $id,
                'student' => $cand['student'],
                'scores' => $cand['scores'],
                'hard_skill_score' => $cand['scores']['c1_hardskill'],
                'soft_skill_score' => $softSkillAvg,
                'raw_score' => $vScore,
                'final_score' => $finalPercentage,
                'kategori_spk' => self::getKategoriSpk($finalPercentage),
            ];
        }

        // Urutkan ranking dari nilai tertinggi ke terendah
        usort($rankings, fn($a, $b) => $b['final_score'] <=> $a['final_score']);
        foreach ($rankings as $idx => &$item) {
            $item['rank'] = $idx + 1;
        }

        return [
            'method' => 'saw',
            'method_name' => 'Simple Additive Weighting (SAW)',
            'method_desc' => 'Metode penjumlahan terbobot dengan normalisasi matriks skala relatif.',
            'criteria' => $criteria,
            'ranking' => $rankings,
            'matrices' => [
                'decision_matrix' => $matrixX,
                'normalized_matrix' => $matrixR,
                'extremes' => $extremes,
            ],
        ];
    }

    /**
     * ALGORITMA 2: Weighted Product (WP)
     */
    private static function calculateWeightedProduct(array $candidates, array $matrixX, array $criteria): array
    {
        // Hitung Vektor S untuk setiap alternatif
        $vectorS = [];
        $totalS = 0.0;

        foreach ($candidates as $cand) {
            $id = $cand['id'];
            $sVal = 1.0;

            foreach ($criteria as $cKey => $cVal) {
                $xVal = $matrixX[$id][$cKey];
                $wNorm = $cVal['normalized_weight'];

                // Benefit dipangkatkan positif w, Cost dipangkatkan negatif w
                $power = ($cVal['type'] === 'benefit') ? $wNorm : -$wNorm;
                $sVal *= pow($xVal, $power);
            }

            $vectorS[$id] = $sVal;
            $totalS += $sVal;
        }

        // Hitung Vektor V (Preferensi Relatif)
        $rankings = [];
        if ($totalS <= 0) $totalS = 1.0;

        foreach ($candidates as $cand) {
            $id = $cand['id'];
            $vVal = $vectorS[$id] / $totalS;
            // Skala ke persentase 0-100 berbasis perbandingan relatif
            $finalPercentage = round(min(100.0, ($vVal * count($candidates) * 20)), 1);

            $softSkillAvg = round(
                ($cand['scores']['c2_discipline'] +
                 $cand['scores']['c3_cleanliness'] +
                 $cand['scores']['c4_teamwork'] +
                 $cand['scores']['c5_communication'] +
                 $cand['scores']['c6_initiative']) / 5,
                1
            );

            $rankings[] = [
                'id' => $id,
                'student' => $cand['student'],
                'scores' => $cand['scores'],
                'hard_skill_score' => $cand['scores']['c1_hardskill'],
                'soft_skill_score' => $softSkillAvg,
                'vector_s' => round($vectorS[$id], 4),
                'vector_v' => round($vVal, 4),
                'final_score' => $finalPercentage,
                'kategori_spk' => self::getKategoriSpk($finalPercentage),
            ];
        }

        usort($rankings, fn($a, $b) => $b['vector_v'] <=> $a['vector_v']);
        foreach ($rankings as $idx => &$item) {
            $item['rank'] = $idx + 1;
        }

        return [
            'method' => 'wp',
            'method_name' => 'Weighted Product (WP)',
            'method_desc' => 'Metode perkalian untuk menghubungkan rating atribut yang dipangkatkan bobot.',
            'criteria' => $criteria,
            'ranking' => $rankings,
            'matrices' => [
                'decision_matrix' => $matrixX,
                'vector_s' => $vectorS,
                'total_s' => round($totalS, 4),
            ],
        ];
    }

    /**
     * ALGORITMA 3: TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
     */
    private static function calculateTopsis(array $candidates, array $matrixX, array $criteria): array
    {
        // 1. Pembagi Normalisasi Vektor (D_j = sqrt(sum(x_kj^2)))
        $divisors = [];
        foreach ($criteria as $cKey => $cVal) {
            $sumSq = 0.0;
            foreach ($matrixX as $row) {
                $sumSq += pow($row[$cKey], 2);
            }
            $divisors[$cKey] = sqrt($sumSq) ?: 1.0;
        }

        // 2. Matriks Ternormalisasi Terbobot (Y_ij = r_ij * w_j)
        $matrixY = [];
        foreach ($candidates as $cand) {
            $id = $cand['id'];
            $yRow = [];
            foreach ($criteria as $cKey => $cVal) {
                $rVal = $matrixX[$id][$cKey] / $divisors[$cKey];
                $yRow[$cKey] = $rVal * $cVal['normalized_weight'];
            }
            $matrixY[$id] = $yRow;
        }

        // 3. Solusi Ideal Positif (A+) dan Solusi Ideal Negatif (A-)
        $idealPositive = [];
        $idealNegative = [];

        foreach ($criteria as $cKey => $cVal) {
            $yCols = array_column($matrixY, $cKey);
            if ($cVal['type'] === 'benefit') {
                $idealPositive[$cKey] = max($yCols);
                $idealNegative[$cKey] = min($yCols);
            } else {
                $idealPositive[$cKey] = min($yCols);
                $idealNegative[$cKey] = max($yCols);
            }
        }

        // 4. Jarak Euclidean (D+ dan D-) serta Nilai Preferensi (C_i)
        $rankings = [];
        foreach ($candidates as $cand) {
            $id = $cand['id'];
            $dPlusSum = 0.0;
            $dMinusSum = 0.0;

            foreach ($criteria as $cKey => $cVal) {
                $dPlusSum += pow($matrixY[$id][$cKey] - $idealPositive[$cKey], 2);
                $dMinusSum += pow($matrixY[$id][$cKey] - $idealNegative[$cKey], 2);
            }

            $dPlus = sqrt($dPlusSum);
            $dMinus = sqrt($dMinusSum);

            $closeness = ($dPlus + $dMinus) > 0 ? ($dMinus / ($dPlus + $dMinus)) : 0.5;
            $finalPercentage = round($closeness * 100, 1);

            $softSkillAvg = round(
                ($cand['scores']['c2_discipline'] +
                 $cand['scores']['c3_cleanliness'] +
                 $cand['scores']['c4_teamwork'] +
                 $cand['scores']['c5_communication'] +
                 $cand['scores']['c6_initiative']) / 5,
                1
            );

            $rankings[] = [
                'id' => $id,
                'student' => $cand['student'],
                'scores' => $cand['scores'],
                'hard_skill_score' => $cand['scores']['c1_hardskill'],
                'soft_skill_score' => $softSkillAvg,
                'd_plus' => round($dPlus, 4),
                'd_minus' => round($dMinus, 4),
                'preference_ci' => round($closeness, 4),
                'final_score' => $finalPercentage,
                'kategori_spk' => self::getKategoriSpk($finalPercentage),
            ];
        }

        usort($rankings, fn($a, $b) => $b['preference_ci'] <=> $a['preference_ci']);
        foreach ($rankings as $idx => &$item) {
            $item['rank'] = $idx + 1;
        }

        return [
            'method' => 'topsis',
            'method_name' => 'TOPSIS (Ideal Solution Closeness)',
            'method_desc' => 'Metode kedekatan geometris relatif terhadap Solusi Ideal Positif & Negatif.',
            'criteria' => $criteria,
            'ranking' => $rankings,
            'matrices' => [
                'decision_matrix' => $matrixX,
                'divisors' => $divisors,
                'weighted_matrix' => $matrixY,
                'ideal_positive' => $idealPositive,
                'ideal_negative' => $idealNegative,
            ],
        ];
    }

    /**
     * Klasifikasi kategori kelayakan penempatan kerja
     */
    public static function getKategoriSpk(float $score): string
    {
        if ($score >= 80) return 'Siap Praktek Kerja (magang)';
        if ($score >= 65) return 'Perlu Pendampingan';
        return 'Perlu Pelatihan Lanjutan';
    }
}
