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

// Route for getting all locations associated with provider
Route::get('/logistic-providers/{provider}/locations', [DeliveryController::class, 'getProviderLocations']);

// Route for getting all locations in the database
Route::get('/logistic-providers/locations', [DeliveryController::class, 'getAllLocations']);