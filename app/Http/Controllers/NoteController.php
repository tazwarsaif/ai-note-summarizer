<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Note;

class NoteController extends Controller
{
    public function create(Request $request)
    {
        // Check if the user is authenticated
        // if (!Auth::check()) {
        //     return response()->json(['error' => 'Unauthorized'], 401);
        // }
        // Validate the input data
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'summary' => 'nullable|string',
        ]);

        $note = $request->user()->notes()->create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'summary' => $request->input('summary'),
        ]);

        return response()->json($note, 201);
    }
    public function update(Request $request, $id){
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Validate the input data
        $request->validate([
            'title' => 'nullable|string',
            'content' => 'required|string',
            'summary' => 'nullable|string',
        ]);
        $title = $request->input('title');
        if (!$title) {
            $title = 'Untitled Note';
        }
        $content = $request->input('content');
        $summary = $request->input('summary');

        $note = Auth::user()->notes()->findOrFail($id);
        $note->update([
            'title' => $title,
            'content' => $content,
            'summary' => $summary,
        ]);

        return response()->json($note, 200);
    }
    public function deleteNote(Request $request, Note $id){
        // Check if the user is authenticated
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $note = Auth::user()->notes()->findOrFail($id->id);
        $note->delete();
        return response()->json(["message"=>"Note Deleted Successfully."], 200);
    }
}
