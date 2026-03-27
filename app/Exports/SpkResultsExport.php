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
        $this->results = $results;
    }

    public function collection()
    {
        return $this->results;
    }

    public function headings(): array
    {
        return [
            'Nama Siswa',
            'Kelas',
            'Tipe Disabilitas',
            'Hard Skill Score',
            'Soft Skill Score',
            'Final Score',
            'Kategori'
        ];
    }

    public function map($row): array
    {
        return [
            $row->student->name,
            $row->student->class?->name ?? '—',
            $row->student->disability_type ?? 'Umum',
            $row->hard_skill_score,
            $row->soft_skill_score,
            $row->final_score,
            $row->kategori_spk,
        ];
    }
}
