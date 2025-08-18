<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LogisticProvider;

class LogisticProviderSeeder extends Seeder
{
    public function run(): void
    {
        LogisticProvider::create(['company_name' => 'DHL', 'status' => 'PARTNERED']);
        LogisticProvider::create(['company_name' => 'FedEx', 'status' => 'PARTNERED']);
    }
}