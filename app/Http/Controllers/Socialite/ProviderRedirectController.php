<?php

namespace App\Http\Controllers\Socialite;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class ProviderRedirectController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(string $provider)
    {
        if(!in_array($provider, ['google'])) {
            abort(404, 'Provider not supported');
        }

        try{
            return Socialite::driver($provider)->redirect();
        } catch (\Exception $e) {
            // Handle any exceptions that may occur during the redirect
            return redirect()->route('home')->withErrors(['error' => 'Failed to redirect to provider: ' . $e->getMessage()]);
        }
    }
}
