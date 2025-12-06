<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DevAutoLoginController extends Controller
{
    /**
     * Dev-only login that accepts any email/password and logs the user in.
     */
    public function store(Request $request)
    {
        if (!app()->isLocal()) {
            abort(404);
        }

        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = strtolower($request->input('email'));

        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $this->makeNameFromEmail($email),
                'password' => Hash::make(Str::random(12)),
            ]
        );

        Auth::login($user, true);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    private function makeNameFromEmail(string $email): string
    {
        $name = explode('@', $email)[0] ?? 'Player';
        return Str::of($name)->replace(['.', '_', '-'], ' ')->title();
    }
}
