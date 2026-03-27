<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\ModuleSoftSkillCriteria;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $modulesData = [
            ['title' => 'Choco Latte', 'desc' => 'Teknik meracik minuman cokelat dengan tekstur creamy dan latte art sederhana.'],
            ['title' => 'Matchabiyu', 'desc' => 'Persiapan Matcha berkualitas tinggi dengan campuran susu yang seimbang.'],
            ['title' => 'Thai Tea', 'desc' => 'Tradisi menyeduh Thai Tea otentik dengan racikan rempah dan susu kental manis.'],
            ['title' => 'Kopi Susu', 'desc' => 'Kreasi kopi susu kekinian yang populer dengan gula aren pilihan.']
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

            // Add Soft Skill Criteria for each module
            foreach ($criteriaNames as $cName) {
                ModuleSoftSkillCriteria::updateOrCreate(
                    ['module_id' => $module->id, 'criteria_name' => $cName]
                );
            }
        }
    }
}
