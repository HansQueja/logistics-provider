<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleUsageController;
use App\Http\Controllers\LogisticController;
use App\Http\Controllers\DeliveryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Route for "Vehicle Usage Per Day" feature
Route::get('/logistic-providers/{provider}/vehicle-usage', [VehicleUsageController::class, 'dailySummary']);

// Route for "Get Assigned Drivers Count" feature
Route::get('/logistic-providers/{provider}/assigned-drivers-count', [LogisticController::class, 'assigned_drivers']);

// Route for creating delivery records
Route::post('/logistics/{id}/delivery', [DeliveryController::class, 'create_delivery']);