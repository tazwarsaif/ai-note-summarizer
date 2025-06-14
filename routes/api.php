<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SummarizerController;
use Illuminate\Support\Facades\Auth;
use \App\Http\Controllers\NoteController;



Route::middleware('auth:sanctum')->post('/summarize', [SummarizerController::class, 'summarize'])->name('summarize');
Route::middleware('auth:sanctum')->post('/create-note', [NoteController::class, 'create'])->name('create-note');
Route::middleware('auth:sanctum')->delete('/notes/{id}', [NoteController::class, 'deleteNote'])->name('delete-note');
Route::middleware('auth:sanctum')->put('/update-note/{id}', [NoteController::class, 'update'])->name('update-note');
Route::middleware('auth:sanctum')->post('/generate-pdf', function () {
    return redirect('/pdf-generator.php');
});
