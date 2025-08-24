<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\LogisticProvider;
use App\Models\QrScanLog;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create 5 logistic providers
        // For each provider, the factory will automatically create some vehicles and drivers
        $providers = LogisticProvider::factory(5)->create();

        // Now, let's create scan logs for every driver in the system
        Driver::all()->each(function ($driver) {
            // Create 5 days of historical scan data for each driver
            for ($i = 0; $i < 5; $i++) {
                $scanInTime = Carbon::now()->subDays($i)->setHour(rand(7, 9))->setMinutes(rand(0, 59));
                $scanOutTime = $scanInTime->copy()->addHours(rand(8, 10));

                // Create the 'IN' scan
                QrScanLog::factory()->create([
                    'driver_id' => $driver->id,
                    'scan_type' => 'IN',
                    'created_at' => $scanInTime,
                    'updated_at' => $scanInTime,
                ]);

                // Create the 'OUT' scan
                QrScanLog::factory()->create([
                    'driver_id' => $driver->id,
                    'scan_type' => 'OUT',
                    'created_at' => $scanOutTime,
                    'updated_at' => $scanOutTime,
                ]);
            }
        });
    }
}