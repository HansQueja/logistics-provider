<?php

// database/factories/VehicleFactory.php
namespace Database\Factories;

use App\Models\LogisticProvider;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Truck ' . fake()->randomNumber(3),
            'type' => fake()->randomElement(['Van', 'Truck', 'Motorcycle']),
            'plate_number' => fake()->unique()->bothify('???-####'),
            'logistic_provider_id' => LogisticProvider::factory(),
            'status' => 'ACTIVE',
        ];
    }
}