<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class ApiTokenAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $auth = $request->header('Authorization') ?? $request->query('api_token');
        $token = null;
        if ($auth && str_starts_with($auth, 'Bearer ')) {
            $token = substr($auth, 7);
        } elseif ($auth) {
            $token = $auth;
        }

        if ($token) {
            $user = User::where('api_token', $token)->first();
            if ($user) {
                // set the authenticated user for the request
                auth()->setUser($user);
            }
        }

        // If no authenticated user was resolved, return 401
        if (!auth()->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return $next($request);
    }
}
