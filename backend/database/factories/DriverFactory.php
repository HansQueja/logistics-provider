<?php

namespace Database\Factories;

use App\Models\LogisticProvider;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class DriverFactory extends Factory
{
    public function definition(): array
    {
        // Get a provider ID to ensure vehicle and driver belong to the same provider
        $provider = LogisticProvider::inRandomOrder()->first() ?? LogisticProvider::factory()->create();

        return [
            'name' => fake()->name(),
            'provider_id' => $provider->id,
            'assigned_vehicle_id' => Vehicle::factory(['logistic_provider_id' => $provider->id]),
            'status' => 'LINKED',
        ];
    }
}