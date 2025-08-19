<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogisticProvider;
use App\Models\Driver;

class LogisticController extends Controller
{
    // The method name can stay the same, but the logic is now more robust.
    public function assigned_drivers(LogisticProvider $provider) // <-- Change $id to LogisticProvider $provider
    {
        // Use the injected $provider model and add the 'status' filter
        $drivers_count = Driver::where('provider_id', $provider->id)
                               ->where('status', 'LINKED')
                               ->count();

        return response()->json([
            // Using snake_case is more conventional for JSON keys
            'assigned_drivers_count' => $drivers_count
        ]);
    }
}