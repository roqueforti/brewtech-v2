<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        // Ambil role user yang baru saja login
        $role = $request->user()->role;

        // Redirect dinamis menggunakan match (Fitur PHP 8+)
        return match ($role) {
            'superadmin'   => redirect()->route('superadmin.dashboard'),
            'school_admin' => redirect()->route('school.dashboard'),
            'instructor'   => redirect()->route('instructor.dashboard'),
            'student'      => redirect()->route('student.dashboard'),
            'parent'       => redirect()->route('parent.dashboard'),
            'cafe_admin'   => redirect()->route('cafe.dashboard'),
            default        => redirect('/'),
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}