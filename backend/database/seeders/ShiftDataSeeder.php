<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShiftDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create multiple test logistic providers
        $providers = [
            ['company_name' => 'Swift Logistics', 'status' => 'PARTNERED'],
            ['company_name' => 'Express Delivery Co', 'status' => 'PARTNERED'],  
            ['company_name' => 'Metro Transport Ltd', 'status' => 'VERIFIED'],
            ['company_name' => 'Global Freight Services', 'status' => 'PARTNERED']
        ];

        foreach ($providers as $providerData) {
            $provider = \App\Models\LogisticProvider::create($providerData);

            // Create different number of drivers for each provider
            $driverCount = $provider->id === 1 ? 3 : 2; // Provider 1 gets 3 drivers, others get 2
            
            $driverNames = [
                1 => ['John Doe', 'Jane Smith', 'Mike Johnson'],
                2 => ['Sarah Wilson', 'David Brown'],  
                3 => ['Lisa Garcia', 'Tom Anderson'],
                4 => ['Emma Davis', 'Chris Taylor']
            ];

            $names = $driverNames[$provider->id] ?? ['Driver A', 'Driver B'];

            foreach ($names as $driverName) {
                $driver = \App\Models\Driver::create([
                    'name' => $driverName,
                    'provider_id' => $provider->id,
                    'status' => 'LINKED'
                ]);

                // Create scan logs for the past week
                for ($i = 0; $i < 7; $i++) {
                    $date = now()->subDays($i);
                    
                    // Morning check-in (between 8-9 AM)
                    $checkIn = $date->copy()->setHour(8)->addMinutes(rand(0, 60));
                    \App\Models\QrScanLog::create([
                        'driver_id' => $driver->id,
                        'scan_type' => 'IN',
                        'scanned_at' => $checkIn
                    ]);

                    // Evening check-out (between 5-7 PM) - sometimes missing
                    if (rand(1, 10) <= 8) { // 80% chance of checking out
                        $checkOut = $checkIn->copy()->addHours(8 + rand(0, 2))->addMinutes(rand(0, 59));
                        \App\Models\QrScanLog::create([
                            'driver_id' => $driver->id,
                            'scan_type' => 'OUT',
                            'scanned_at' => $checkOut
                        ]);
                    }
                }
            }
        }
    }
}
