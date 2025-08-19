<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use App\Models\Delivery;
use App\Models\Location;

class PredictCoordinates implements ShouldQueue
{
    use Queueable;

    public $deliveryId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $deliveryId)
    {
        $this->deliveryId = $deliveryId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $delivery = Delivery::find($this->deliveryId);
        if (!$delivery) return;

        $data = [
            'address' => $delivery->address,
            'status' => $delivery->status,
        ];

        $api_result = Http::post("http://localhost:5000/find_coordinates", $data);

        $locationData = $api_result->json();

        $location = Location::create([
            'address' => $locationData['address'],
            'latitude' => $locationData['latitude'],
            'longitude' => $locationData['longitude'],
            'type' => $locationData['type'],
            'status' => $locationData['status'],
        ]);

        $delivery->update(['location_id' => $location->id]);
    }
}
