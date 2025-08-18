<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\VehicleUsage;
use App\Models\Vehicle;
use Carbon\Carbon;

class VehicleUsageSeeder extends Seeder
{
    public function run(): void
    {
        $dhlVehicle = Vehicle::where('plate_number', 'DHL001')->first();
        $fedexVehicle = Vehicle::where('plate_number', 'FDX001')->first();

        // Seed some usage for DHL vehicle
        for ($i = 0; $i < 5; $i++) {
            VehicleUsage::create([
                'vehicle_id' => $dhlVehicle->id,
                'usage_date' => Carbon::now()->subDays($i)->toDateString(),
                'distance_km' => rand(100, 500),
                'hours_in_use' => rand(4, 8)
            ]);
        }

        // Seed some usage for FedEx vehicle
        for ($i = 0; $i < 5; $i++) {
            VehicleUsage::create([
                'vehicle_id' => $fedexVehicle->id,
                'usage_date' => Carbon::now()->subDays($i)->toDateString(),
                'distance_km' => rand(150, 600),
                'hours_in_use' => rand(5, 9)
            ]);
        }
    }
}