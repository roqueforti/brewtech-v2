<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        $user = auth()->user();

        if (!in_array($user->role, $roles)) {
            // Jika akses ditolak, arahkan kembali atau tampilkan 403
            abort(403, 'Akses tidak diizinkan untuk peran Anda.');
        }

        return $next($request);
    }
}