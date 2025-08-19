<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class QrScanLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'scan_type' => 'IN', // Default to IN, we'll create OUT scans separately
            // driver_id will be provided when we call the factory
        ];
    }
}