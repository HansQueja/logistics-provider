<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;
use App\Models\LogisticProvider;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $dhl = LogisticProvider::where('company_name', 'DHL')->first();
        $fedex = LogisticProvider::where('company_name', 'FedEx')->first();

        Vehicle::create(['name' => 'DHL Truck 1', 'type' => 'Truck', 'plate_number' => 'DHL001', 'logistic_provider_id' => $dhl->id]);
        Vehicle::create(['name' => 'FedEx Van 1', 'type' => 'Van', 'plate_number' => 'FDX001', 'logistic_provider_id' => $fedex->id]);
    }
}