<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SummarizerController extends Controller
{
    public function summarize(Request $request)
    {
        try {
            // Check if the user is authenticated
            // if (!Auth::user()) {
            //     return response()->json(['error' => 'Unauthorized'], 401);
            // }
            // Validate the request data
            $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            ]);
            $title = $request->input('title');
            $content = $request->input('content');

            $response = Http::withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4.1-nano',
            'messages' => [
                [
                'role' => 'system',
                'content' => 'You are a helpful assistant that summarizes notes.'
                ],
                [
                'role' => 'user',
                'content' => "Title: $title\nContent: $content\nPlease summarize the content in a concise manner, don't add any title, fix the grammar, and make it more readable."
                ]
            ],
            'temperature' => 0.5
            ]);

            if ($response->successful()) {
            return response()->json([
                'summary' => $response->json()['choices'][0]['message']['content']
            ]);
            } else {
            return response()->json(['error' => 'Failed to summarize.','response' => $response->json()], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => 'Validation failed.', 'messages' => $e->errors()], 422);
        } catch (\Illuminate\Http\Client\RequestException $e) {
            return response()->json(['error' => 'HTTP request failed.', 'message' => $e->getMessage()], 502);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred.', 'message' => $e->getMessage()], 500);
        }
    }

}
