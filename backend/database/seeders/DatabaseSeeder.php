<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\LogisticProvider;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        LogisticProvider::factory(10)->create();
    }
}
