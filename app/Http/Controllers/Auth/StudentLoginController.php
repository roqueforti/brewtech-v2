<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class StudentLoginController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'kelas_id' => 'required|exists:study_classes,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->user_id);

        // Ensure the user is a student in the selected class
        if ($user->role !== 'student' || $user->kelas_id != $request->kelas_id) {
            return back()->withErrors(['error' => 'Invalid selection.']);
        }

        Auth::login($user);

        return redirect()->intended(route('student.dashboard'));
    }
}
