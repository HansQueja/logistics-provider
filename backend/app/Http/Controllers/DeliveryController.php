<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use App\Models\Delivery;
use App\Jobs\PredictCoordinates;

class DeliveryController extends Controller
{
    public function create_delivery(Request $request, string $id) 
    {
        $validated = $request->validate([
            'driver_id' => 'required|numeric',
            'address' => 'required|string',
            'status' => 'required|string'
        ]);

        $delivery = Delivery::create([
            'provider_id' => $id,
            'driver_id' => $validated['driver_id'],
            'address' => $validated['address'],
            'status' => $validated['status']
        ]);

        $address = $validated['address'];

        $delivery_location = Location::where('address', $address)->first();

        if (is_null($delivery_location)) {
            PredictCoordinates::dispatch($delivery->id);
        } else {
            $delivery->location_id = $delivery_location->id;
            $delivery->save();
        }

        return response()->json([
            'message' => 'Delivery instance created',
            'delivery_id' => $delivery->id
        ]);
    }
}
