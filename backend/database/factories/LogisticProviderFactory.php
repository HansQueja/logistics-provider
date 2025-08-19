<?php

namespace Database\Factories;

use App\Models\LogisticProvider;
use App\Models\Driver;
use Illuminate\Database\Eloquent\Factories\Factory;

class LogisticProviderFactory extends Factory
{
    
    protected $model = LogisticProvider::class;

    public function definition(): array
    {
        return [
            'company_name' => fake()->company(),
            'status' => fake()->randomElement(['VERIFIED', 'PARTNERED', 'BLACKLISTED', 'REJECTED']),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (LogisticProvider $provider) {
            Driver::factory(rand(1, 5))->create([
                'provider_id' => $provider->id,
            ]);
        });
    }
}
