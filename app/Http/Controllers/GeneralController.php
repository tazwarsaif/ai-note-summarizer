<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class GeneralController extends Controller
{

    public function showLoginPage()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }
        return Inertia::render('Login', [
            'message' => 'Please log in to continue.',
        ]);
    }


    public function showDashboardPage()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        $user = Auth::user();
        if(DB::table('personal_access_tokens')
            ->where('tokenable_id', $user->id)
            ->exists()) {
            // Token already exists, no need to create a new one
            return Inertia::render('Home', [
                'user' => $user,
                'notes' => $user->notes()->latest()->get(),
                'token' => "Token already exists, no need to create a new one.",
            ]);
        }
        DB::table('personal_access_tokens')
            ->where('tokenable_id', $user->id)
            ->delete();
        $token = $user->createToken($user->email)->plainTextToken;
        return Inertia::render('Home', [
            'user' => Auth::user(),
            'notes' => Auth::user()->notes()->latest()->get(),
            'token' => $token,
        ]);
    }
    public function showCreateNotePage()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        return Inertia::render('CreateNote', [
            'user' => Auth::user(),
        ]);
    }

    public function showEditNotePage($id)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        $note = Auth::user()->notes()->findOrFail($id);
        return Inertia::render('UpdateNote', [
            'user' => Auth::user(),
            'note' => $note,
        ]);
    }
}
