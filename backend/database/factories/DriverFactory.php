<?php

namespace Database\Factories;

use App\Models\LogisticProvider;
use App\Models\Driver;
use Illuminate\Database\Eloquent\Factories\Factory;

class DriverFactory extends Factory
{
    
    protected $model = Driver::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            // Creates a new logistic provider if none is passed
            'provider_id' => LogisticProvider::factory(),
            'status' => fake()->randomElement(['REGISTERED', 'LINKED', 'UNASSIGNED', 'REJECTED']),
        ];
    }
}
