<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SpkResultsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $results;

    public function __construct($results)
    {
        $this->results = collect($results);
    }

    public function collection()
    {
        return $this->results;
    }

    public function headings(): array
    {
        return [
            'Peringkat',
            'Nama Siswa',
            'Kelas',
            'Tipe Disabilitas',
            'C1 - Teknis Barista (Hard Skill)',
            'C2 - Kedisiplinan',
            'C3 - Kebersihan Bar',
            'C4 - Kerja Sama',
            'C5 - Komunikasi & Tamu',
            'C6 - Inisiatif',
            'Rata-rata Soft Skill',
            'Nilai Akhir SPK',
            'Kategori Kelayakan'
        ];
    }

    public function map($row): array
    {
        $isObj = is_object($row);
        $student = $isObj ? ($row->student ?? null) : ($row['student'] ?? null);
        $studentObj = is_object($student) ? $student : (object) ($student ?? []);

        $scores = $isObj ? ($row->scores ?? []) : ($row['scores'] ?? []);
        if (is_object($scores)) {
            $scores = (array) $scores;
        }

        $rank = $isObj ? ($row->rank ?? '-') : ($row['rank'] ?? '-');
        $c1 = $scores['c1_hardskill'] ?? ($isObj ? ($row->hard_skill_score ?? 0) : ($row['hard_skill_score'] ?? 0));
        $c2 = $scores['c2_discipline'] ?? 0;
        $c3 = $scores['c3_cleanliness'] ?? 0;
        $c4 = $scores['c4_teamwork'] ?? 0;
        $c5 = $scores['c5_communication'] ?? 0;
        $c6 = $scores['c6_initiative'] ?? 0;

        $soft = $isObj ? ($row->soft_skill_score ?? 0) : ($row['soft_skill_score'] ?? 0);
        $final = $isObj ? ($row->final_score ?? 0) : ($row['final_score'] ?? 0);
        $kategori = $isObj ? ($row->kategori_spk ?? '-') : ($row['kategori_spk'] ?? '-');

        $className = is_object($studentObj->class ?? null) ? ($studentObj->class->name ?? '-') : ($studentObj->class ?? '-');

        return [
            $rank,
            $studentObj->name ?? '-',
            $className ?: '-',
            $studentObj->disability_type ?? 'Umum',
            $c1,
            $c2,
            $c3,
            $c4,
            $c5,
            $c6,
            $soft,
            $final,
            $kategori,
        ];
    }
}
