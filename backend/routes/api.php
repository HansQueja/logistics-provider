<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\VehicleUsageController;
use App\Http\Controllers\LogisticController;
use App\Http\Controllers\DeliveryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Simple test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working!', 'timestamp' => now()]);
});

// Route for "Vehicle Usage Per Day" feature
Route::get('/logistic-providers/{provider}/vehicle-usage', [VehicleUsageController::class, 'dailySummary']);

// Route for "Get Assigned Drivers Count" feature  
Route::get('/logistic-providers/{provider}/assigned-drivers-count', [LogisticController::class, 'assignedDrivers']);

// Route for "Driver Login Duration/Shift" feature (consistent pattern)
Route::get('/logistic-providers/{provider}/shifts', [ShiftController::class, 'getShiftDurations']);
Route::options('/logistic-providers/{provider}/shifts', [ShiftController::class, 'getShiftDurations']);

// Route for recording QR scans
Route::post('/scans', [ShiftController::class, 'recordScan']);

// Route for creating delivery records
Route::post('/logistic-providers/{provider}/delivery', [DeliveryController::class, 'createDelivery']);

// Route for getting all locations associated with provider
Route::get('/logistic-providers/{provider}/locations', [DeliveryController::class, 'getProviderLocations']);

// Route for getting all locations in the database
Route::get('/logistic-providers/locations', [DeliveryController::class, 'getAllLocations']);