<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UsersExport implements FromCollection, WithHeadings, WithStyles
{
    protected $schoolId;
    protected $role;

    public function __construct($schoolId, $role = null)
    {
        $this->schoolId = $schoolId;
        $this->role = $role;
    }

    public function collection()
    {
        $query = User::where('school_id', $this->schoolId);

        if ($this->role) {
            $query->where('role', $this->role);
        }

        return $query->get()->map(function ($user) {
            return [
                $user->name,
                $user->email,
                ucfirst($user->role),
                $user->class?->name ?? '-',
                $user->parent?->name ?? '-',
                $user->disability_type ?? '-',
                $user->created_at->format('d/m/Y H:i'),
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Nama',
            'Email',
            'Role',
            'Kelas',
            'Orang Tua',
            'Tipe Disabilitas',
            'Dibuat Pada',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'fgColor' => ['rgb' => '7C3AED']],
            ],
        ];
    }
}
?>
