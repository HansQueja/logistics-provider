<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LogisticProvider;
use App\Models\VehicleUsage;
use Illuminate\Support\Facades\DB;

class VehicleUsageController extends Controller
{
    public function index(LogisticProvider $logisticProvider)
    {
        $dailyUsage = VehicleUsage::select(
            'usage_date',
            DB::raw('SUM(distance_km) as total_distance'),
            DB::raw('SUM(hours_in_use) as total_hours')
        )
        ->whereHas('vehicle', function ($query) use ($logisticProvider) {
            $query->where('logistic_provider_id', $logisticProvider->id);
        })
        ->groupBy('usage_date')
        ->orderBy('usage_date', 'desc')
        ->get();

        return view('vehicle_usage.index', [
            'logisticProvider' => $logisticProvider,
            'dailyUsage' => $dailyUsage,
        ]);
    }
}