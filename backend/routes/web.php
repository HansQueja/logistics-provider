<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleUsageController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/logistic-providers/{logisticProvider}/vehicle-usage', [VehicleUsageController::class, 'index'])->name('vehicle-usage.index');
