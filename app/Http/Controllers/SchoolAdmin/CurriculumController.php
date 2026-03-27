<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Module;
use App\Models\StudyClass;
use Inertia\Inertia;

class CurriculumController extends Controller
{
    public function index()
    {
        $modules = Module::all(); // Assuming modules are from superadmin
        $classes = StudyClass::where('school_id', auth()->user()->school_id)->get();

        return Inertia::render('SchoolAdmin/AdopsiModul', compact('modules', 'classes'));
    }

    public function adopt(Request $request)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'class_id' => 'required|exists:study_classes,id',
        ]);

        // Assuming there's a pivot table for class_module
        $class = StudyClass::find($request->class_id);
        $class->modules()->attach($request->module_id);

        return redirect()->back();
    }
}