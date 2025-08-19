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
Route::get('/logistic-providers/{provider}/assigned-drivers-count', [LogisticController::class, 'assignedDrivers']);

// Route for creating delivery records
Route::post('/logistic-providers/{provider}/delivery', [DeliveryController::class, 'createDelivery']);

// Route for "Get Assigned Drivers Count" feature
Route::get('/logistic-providers/{provider}/locations', [DeliveryController::class, 'getLocations']);

