<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogisticProvider;
use App\Models\Driver;

class LogisticController extends Controller
{
    // The method name can stay the same, but the logic is now more robust.
    public function assignedDrivers(LogisticProvider $provider) // <-- Change $id to LogisticProvider $provider
    {
        $drivers_list = Driver::where('provider_id', $provider->id)
                               ->where('status', 'LINKED')->get();

        $logistic_provider = LogisticProvider::find($provider->id);

        return response()->json([
            // Using snake_case is more conventional for JSON keys
            'company_name' => $logistic_provider->company_name,
            'assigned_drivers_count' => $drivers_list->count(),
            'drivers_list' => $drivers_list
        ]);
    }
}