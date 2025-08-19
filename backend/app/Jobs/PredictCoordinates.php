<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use App\Models\Delivery;

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

        $address = $delivery->address;

        $api_result = Http::post("http://localhost:5000/api/find_coordinates", [
            'address' => $address]
        );

        $locationData = $api_result->json();
        $delivery->location_id = $locationData['location_id'] ?? null;
        $delivery->save();
    }
}
