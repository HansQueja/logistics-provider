<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LogisticProvider;
use App\Models\Delivery;
use App\Models\Location;
use App\Models\Driver; // <-- MAKE SURE TO ADD THIS
use App\Jobs\PredictCoordinates;

class DeliveryController extends Controller
{
    public function createDelivery(Request $request, LogisticProvider $provider)
    {
        $validated = $request->validate([
            'address' => 'required|string|max:255',
            'status' => 'required|string',
            'driver_id' => 'required|exists:drivers,id',
        ]);

        $delivery = Delivery::create([
            'address' => $validated['address'],
            'status' => $validated['status'],
            'provider_id' => $provider->id,
            'driver_id' => $validated['driver_id'],
        ]);

        PredictCoordinates::dispatch($delivery->id);

        return response()->json(['message' => 'Delivery created and geocoding is in progress.'], 201);
    }

    public function getProviderLocations(LogisticProvider $provider)
    {
        // This method fetches locations via the deliveries relationship
        $locations = Location::whereIn('id', function ($query) use ($provider) {
            $query->select('location_id')
                ->from('deliveries')
                ->where('provider_id', $provider->id)
                ->whereNotNull('location_id');
        })->get(['latitude', 'longitude']);

        if ($locations->isEmpty()) {
            return response()->json(['message' => 'No delivery locations found for this provider.'], 200);
        }

        return response()->json($locations);
    }

    public function getAllLocations()
    {
        $locations = Location::all(['latitude', 'longitude']);
        return response()->json($locations);
    }

    // !!! ADD THIS NEW METHOD !!!
    /**
     * Get all drivers associated with a specific logistic provider.
     */
    public function getProviderDrivers(LogisticProvider $provider)
    {
        $drivers = Driver::where('provider_id', $provider->id)->get(['id', 'name']);
        return response()->json($drivers);
    }
}