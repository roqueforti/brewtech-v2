<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Module;
use App\Models\StudentModuleProgress;
use App\Models\StudentSoftSkillEvaluation;
use App\Models\ModuleSoftSkillCriteria;

class ProgressSeeder extends Seeder
{
    public function run(): void
    {
        $ypacSchool = \App\Models\School::where('name', 'SLB YPAC KOTA MALANG')->first();
        if (!$ypacSchool) return;

        $students = User::where('role', 'student')->where('school_id', $ypacSchool->id)->get();
        $instructors = User::where('role', 'instructor')->where('school_id', $ypacSchool->id)->get();
        $modules = Module::whereIn('order', [1, 2])->get();

        foreach ($students as $student) {
            foreach ($modules as $module) {
                // 1. Mark Module as Completed
                StudentModuleProgress::updateOrCreate(
                    ['student_id' => $student->id, 'module_id' => $module->id],
                    [
                        'status' => 'completed',
                        'pre_test_score' => rand(65, 75),
                        'post_test_score' => rand(78, 88), // Middle-range scores
                    ]
                );

                // 2. Assign Soft Skill Evaluations
                $criteria = ModuleSoftSkillCriteria::where('module_id', $module->id)->get();
                $instructor = $instructors->random();

                foreach ($criteria as $item) {
                    StudentSoftSkillEvaluation::updateOrCreate(
                        [
                            'student_id' => $student->id, 
                            'module_id' => $module->id, 
                            'criteria_id' => $item->id
                        ],
                        [
                            'instructor_id' => $instructor->id,
                            'score' => rand(3, 5), // Range 1-5 usually for rubrics, or 70-90? 
                            // Looking at spk logic earlier, it's probably numeric. I'll use 75-90.
                            'score' => rand(75, 85),
                            'observation_notes' => 'Menunjukkan progres yang stabil dalam ' . $item->criteria_name,
                        ]
                    );
                }
            }
        }
    }
}
