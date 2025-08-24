<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LogisticProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VehicleUsageController extends Controller
{
    /**
     * Get a summary of vehicle usage for a single day.
     */
    public function dailySummary(Request $request, LogisticProvider $provider)
    {
        $date = $request->query('date', now()->toDateString());

        // This is the query using PostgreSQL-compatible functions
        $usageData = DB::table('vehicles as v')
            ->select(
                'v.id as vehicle_id',
                'v.plate_number',
                'v.type as vehicle_type',
                DB::raw("COUNT(CASE WHEN qsl.scan_type = 'IN' THEN 1 END) as daily_scan_ins"),
                DB::raw("COUNT(CASE WHEN qsl.scan_type = 'OUT' THEN 1 END) as daily_scan_outs"),
                DB::raw("MIN(CASE WHEN qsl.scan_type = 'IN' THEN qsl.created_at END) as first_scan_in"),
                DB::raw("MAX(CASE WHEN qsl.scan_type = 'OUT' THEN qsl.created_at END) as last_scan_out"),
                // This CASE block is rewritten for PostgreSQL
                DB::raw("
                    CAST(
                        CASE
                            WHEN MAX(CASE WHEN qsl.scan_type = 'OUT' THEN qsl.created_at END) IS NOT NULL
                            THEN EXTRACT(EPOCH FROM (MAX(qsl.created_at) - MIN(qsl.created_at))) / 3600

                            WHEN MIN(CASE WHEN qsl.scan_type = 'IN' THEN qsl.created_at END) IS NOT NULL
                            THEN EXTRACT(EPOCH FROM (NOW() - MIN(qsl.created_at))) / 3600

                            ELSE 0
                        END
                    AS INTEGER) as usage_hours
                ")
            )
            ->leftJoin('drivers as d', 'v.id', '=', 'd.assigned_vehicle_id')
            ->leftJoin('qr_scan_logs as qsl', function ($join) use ($date) {
                $join->on('d.id', '=', 'qsl.driver_id')
                        ->whereDate('qsl.created_at', '=', $date);
            })
            ->where('v.logistic_provider_id', '=', $provider->id)
            ->where('v.status', '=', 'ACTIVE')
            ->groupBy('v.id', 'v.plate_number', 'v.type')
            ->orderBy('v.id')
            ->get();

        return response()->json($usageData);
    }

    /**
     * Get the daily activity trend over a date range.
     */
    public function activityTrend(Request $request, LogisticProvider $provider)
    {
        // Get start and end dates from the query, default to the last 30 days
        $endDate = $request->query('end_date', now()->toDateString());
        $startDate = $request->query('start_date', now()->subDays(29)->toDateString());

        $trendData = DB::table('qr_scan_logs as qsl')
            ->select(
                DB::raw("DATE(qsl.created_at) as date"),
                DB::raw("COUNT(CASE WHEN qsl.scan_type = 'IN' THEN 1 END) as total_scan_ins"),
                DB::raw("COUNT(CASE WHEN qsl.scan_type = 'OUT' THEN 1 END) as total_scan_outs")
            )
            // Join through drivers to filter by the provider
            ->join('drivers as d', 'qsl.driver_id', '=', 'd.id')
            ->where('d.provider_id', $provider->id)
            // Filter by the date range
            ->whereBetween(DB::raw("DATE(qsl.created_at)"), [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'asc') // Order by date ascending for the chart
            ->get();

        return response()->json($trendData);
    }
}