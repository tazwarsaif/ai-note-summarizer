<?php

use App\Http\Controllers\Socialite\ProviderRedirectController;
use App\Http\Controllers\Socialite\ProviderCallbackController;
use App\Http\Controllers\GeneralController;
use Illuminate\Support\Facades\Route;
use \Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


Route::get('/login', [GeneralController::class, 'showLoginPage'])->name('login');

Route::get('/dashboard', [GeneralController::class, 'showDashboardPage'])->middleware(['auth'])->name('dashboard');
Route::get('/', function () {
    if(Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

Route::get('/edit-note/{id}', [GeneralController::class, 'showEditNotePage'])->middleware(['auth'])->name('edit-note');

Route::get("/auth/{provider}/redirect", ProviderRedirectController::class)->name('auth.redirect');
Route::get("/auth/{provider}/callback", ProviderCallbackController::class)->name('auth.callback');

Route::get('/create-note', [GeneralController::class, 'showCreateNotePage'])->middleware(['auth'])->name('create-noteView');


Route::post('/logout', function () {
    $user = Auth::user();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    DB::table('personal_access_tokens')
        ->where('tokenable_id', $user->id)
        ->delete();
    Auth::logout();
    return redirect()->route('login');
})->name('logout');

Route::get('/debug-google-config', function() {
    return response()->json([
        'client_id' => config('services.google.client_id'),
        'redirect' => config('services.google.redirect'),
        'env_secret' => env('GOOGLE_CLIENT_SECRET'),
        'env_APP_URL' => env('APP_URL'),

    ]);
});
