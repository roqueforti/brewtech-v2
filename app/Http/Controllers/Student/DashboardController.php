<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $student = Auth::user();
        $student->load(['studentClass.modules.materials', 'moduleProgresses']);

        $modules = [];
        $completedCount = 0;
        $totalXp = 50; // Base beginner XP
        $dinoBeans = 30; // Base beginner dino beans

        if ($student->studentClass) {
            $classModules = $student->studentClass->modules;

            // Stages on the Dino Map
            $dinoStages = [
                ['zone' => 'Lembah Biji Purba', 'dino' => 'bronto', 'bg' => 'from-emerald-400 to-teal-500'],
                ['zone' => 'Kawah Espresso Beruap', 'dino' => 'rexy', 'bg' => 'from-amber-400 to-orange-500'],
                ['zone' => 'Danau Susu Lembut', 'dino' => 'stego', 'bg' => 'from-cyan-400 to-blue-500'],
                ['zone' => 'Puncak Barista Purba', 'dino' => 'tricera', 'bg' => 'from-purple-400 to-pink-500'],
            ];

            $allCompletedSoFar = true;

            foreach ($classModules as $idx => $mod) {
                $progress = $student->moduleProgresses->where('module_id', $mod->id)->first();
                $isCompleted = $progress && $progress->status === 'completed';

                if ($isCompleted) {
                    $completedCount++;
                    $score = $progress->post_test_score ?: 85;
                    $totalXp += 100 + (int) $score;
                    $dinoBeans += 50;
                }

                $isLocked = false;
                if ($idx === 0) {
                    $isLocked = false;
                } else {
                    $isLocked = !$allCompletedSoFar;
                }

                if (!$isCompleted) {
                    $allCompletedSoFar = false;
                }

                $stageInfo = $dinoStages[$idx % count($dinoStages)];

                $modules[] = [
                    'id'          => $mod->id,
                    'title'       => $mod->title,
                    'description' => $mod->description,
                    'status'      => $isCompleted ? 'completed' : ($isLocked ? 'locked' : 'available'),
                    'is_locked'   => $isLocked,
                    'stage_name'  => $stageInfo['zone'],
                    'stage_dino'  => $stageInfo['dino'],
                    'stage_bg'    => $stageInfo['bg'],
                    'score'       => $progress ? $progress->post_test_score : null,
                ];
            }
        }

        // Determine Dino Level
        $level = 1;
        $levelName = 'Telur Dino Pemula';
        $dinoAvatar = '🥚';

        if ($completedCount >= 3) {
            $level = 4;
            $levelName = 'Master Baristasaurus 👑';
            $dinoAvatar = '🦖';
        } elseif ($completedCount >= 2) {
            $level = 3;
            $levelName = 'Raptor Seduh Cepat ⚡';
            $dinoAvatar = '🦕';
        } elseif ($completedCount >= 1) {
            $level = 2;
            $levelName = 'Bayi T-Rex Peracik ☕';
            $dinoAvatar = '🦖';
        }

        $badges = [
            [
                'id' => 'egg_hatched',
                'name' => 'Telur Menetas',
                'title' => 'Langkah Pertama Dino',
                'icon' => '🥚',
                'desc' => 'Memulai perjalanan di Lembah Purba Vokasi',
                'unlocked' => true,
            ],
            [
                'id' => 'rexy_brew',
                'name' => 'Rexy Si Penembak Espresso',
                'title' => 'Master Crema',
                'icon' => '🦖',
                'desc' => 'Menuntaskan teknik ekstraksi mesin espresso',
                'unlocked' => $completedCount >= 1,
            ],
            [
                'id' => 'stego_foam',
                'name' => 'Stego Busa Lembut',
                'title' => 'Ahli Foam Susu',
                'icon' => '🦕',
                'desc' => 'Berhasil membuat busa susu halus untuk latte',
                'unlocked' => $completedCount >= 2,
            ],
            [
                'id' => 'gold_dino',
                'name' => 'Fosil Emas Sempurna',
                'title' => 'Nilai Kuis Sempurna',
                'icon' => '⭐',
                'desc' => 'Meraih skor 100% pada evaluasi kuis barista',
                'unlocked' => $completedCount >= 3,
            ],
        ];

        return Inertia::render('Student/Dashboard', [
            'modules' => $modules,
            'student' => [
                'name'   => $student->name,
                'avatar' => $student->name[0],
            ],
            'gamification' => [
                'level'           => $level,
                'level_name'      => $levelName,
                'dino_avatar'     => $dinoAvatar,
                'xp'              => $totalXp,
                'next_level_xp'   => $level * 250,
                'dino_beans'      => $dinoBeans,
                'streak_days'     => 3,
                'completed_count' => $completedCount,
                'total_modules'   => count($modules),
                'badges'          => $badges,
            ],
        ]);
    }
}
