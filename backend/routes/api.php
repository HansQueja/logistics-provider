<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShiftController;

// Simple test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working!', 'timestamp' => now()]);
});

// CORS preflight route
Route::options('/shifts', [ShiftController::class, 'getShiftDurations']);

// Shift tracking routes
Route::get('/shifts', [ShiftController::class, 'getShiftDurations']);
Route::post('/scans', [ShiftController::class, 'recordScan']);