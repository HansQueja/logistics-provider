<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LogisticController;

Route::get('/logistics/{id}/assigned_drivers', [LogisticController::class, 'assigned_drivers']);