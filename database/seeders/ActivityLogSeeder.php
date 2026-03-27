<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ActivityLog;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $actions = ['Login', 'Logout', 'Created', 'Updated', 'Viewed'];
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15',
            'Mozilla/5.0 (Linux; Android 14) Chrome/122.0.0.0 Mobile',
        ];

        // 1. Specific Requirement: ~100 logs for parents
        $parents = User::where('role', 'parent')->get();
        if ($parents->isNotEmpty()) {
            for ($i = 0; $i < 110; $i++) {
                $user = $parents->random();
                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => 'Login',
                    'ip_address' => '192.168.1.' . rand(1, 254),
                    'user_agent' => $userAgents[array_rand($userAgents)],
                    'created_at' => Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 23)),
                ]);
            }
        }

        // 2. Generic logs for other roles (1 month testing)
        $users = User::whereIn('role', ['student', 'instructor', 'school_admin', 'cafe_admin'])->get();
        foreach ($users as $user) {
            $logCount = rand(5, 15);
            for ($i = 0; $i < $logCount; $i++) {
                ActivityLog::create([
                    'user_id' => $user->id,
                    'action' => $actions[array_rand($actions)],
                    'model_type' => rand(0, 1) ? 'App\\Models\\Product' : 'App\\Models\\Transaction',
                    'model_id' => rand(1, 50),
                    'ip_address' => '10.0.0.' . rand(1, 254),
                    'user_agent' => $userAgents[array_rand($userAgents)],
                    'created_at' => Carbon::now()->subDays(rand(1, 30))->subHours(rand(1, 23)),
                ]);
            }
        }
    }
}
