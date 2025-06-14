<?php

namespace App\Http\Controllers\Socialite;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ProviderCallbackController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $provider)
    {
        if(!in_array($provider, ['google'])) {
            abort(404, 'Provider not supported');
        }

        try {

            $socialUser = Socialite::driver($provider)->stateless()->user();
            // dd($socialUser); // Debugging line to inspect the user object
            if (!$socialUser || !$socialUser->email) {
                return redirect('/login')->withErrors([
                    'oauth' => 'Failed to retrieve user information from the provider.'
                ]);
        }
        $user = User::updateOrCreate([
            'email' => $socialUser->email, // More reliable than provider_id
        ], [
            'name' => $socialUser->name,
            'provider_id' => $socialUser->id,
            'provider_name' => $provider,
            'provider_token' => $socialUser->token,
            'password' => '', // Critical for social login
        ]);

        Auth::login($user, true); // "Remember me" flag


        return redirect('/dashboard')->with([
            'status' => 'success',
            'message' => 'Logged in via Google',
        ]);

    } catch (\Exception $e) {
        logger()->error('OAuth Error: '.$e->getMessage());
        return redirect('/login')->withErrors([
            'oauth' => 'Failed to authenticate. Please try again.'
        ]);
    }
        }
}
