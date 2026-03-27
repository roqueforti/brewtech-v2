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
        $student->load(['studentClass.modules', 'moduleProgresses']);

        $modules = [];
        if ($student->studentClass) {
            $modules = $student->studentClass->modules->map(function ($mod) use ($student) {
                // Find progress
                $progress = $student->moduleProgresses->where('module_id', $mod->id)->first();
                
                return [
                    'id' => $mod->id,
                    'title' => $mod->title,
                    'description' => $mod->description,
                    'status' => $progress ? $progress->status : 'locked', // we can compute locked based on order if needed, but lets just say 'available' or 'completed'
                    'is_locked' => false // simplify for now, logic can be added to lock based on previous module status
                ];
            })->toArray();
            
            // Lock logic: module N is locked if module N-1 is not completed
            $allCompletedSoFar = true;
            foreach ($modules as $key => $mod) {
                if ($key === 0) {
                    $modules[$key]['is_locked'] = false;
                    if ($mod['status'] !== 'completed') $allCompletedSoFar = false;
                } else {
                    $modules[$key]['is_locked'] = !$allCompletedSoFar;
                    if ($mod['status'] !== 'completed') $allCompletedSoFar = false;
                }
                
                if (!$progress = $student->moduleProgresses->where('module_id', $mod['id'])->first()) {
                    $modules[$key]['status'] = $modules[$key]['is_locked'] ? 'locked' : 'available';
                }
            }
        }

        return Inertia::render('Student/Dashboard', [
            'modules' => $modules,
            'student' => [
                'name' => $student->name,
                'avatar' => $student->name[0]
            ]
        ]);
    }
}
