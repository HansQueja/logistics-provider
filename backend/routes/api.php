<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LogisticController;
use App\Http\Controllers\DeliveryController;

Route::get('/logistics/{id}/assigned_drivers', [LogisticController::class, 'assigned_drivers']);

# Heatmap
Route::post('/logistics/{id}/delivery', [DeliveryController::class, 'create_delivery']);