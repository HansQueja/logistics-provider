<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\QrScanLog;
use App\Models\LogisticProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShiftController extends Controller
{
    /**
     * Get driver shift durations for a provider (using consistent provider pattern)
     */
    public function getShiftDurations(Request $request, LogisticProvider $provider)
    {
        // Handle preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        }

        $request->validate([
            'driver_id' => 'nullable|integer|exists:drivers,id',
            'range_type' => 'nullable|in:daily,weekly,monthly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        // Use the provider from route parameter (consistent pattern)
        $providerId = $provider->id;
        $driverId = $request->driver_id;
        $rangeType = $request->range_type ?? 'daily';

        // Default to current date if no dates provided
        $startDate = $request->start_date ?? now()->toDateString();
        $endDate = $request->end_date ?? now()->toDateString();

        // Adjust date range based on range type
        if ($rangeType === 'weekly') {
            $start = Carbon::parse($startDate)->startOfWeek();
            $end = Carbon::parse($endDate)->endOfWeek();
        } elseif ($rangeType === 'monthly') {
            $start = Carbon::parse($startDate)->startOfMonth();
            $end = Carbon::parse($endDate)->endOfMonth();
        } else {
            $start = Carbon::parse($startDate);
            $end = Carbon::parse($endDate);
        }

        // Updated query for PostgreSQL compatibility (since we're using Supabase)
        $query = DB::table('drivers as d')
            ->leftJoin('qr_scan_logs as qsl', 'd.id', '=', 'qsl.driver_id')
            ->select([
                'd.id as driver_id',
                'd.name',
                DB::raw('DATE(qsl.created_at) as shift_date'),
                DB::raw('MIN(CASE WHEN qsl.scan_type = \'IN\' THEN qsl.created_at END) as first_scan_in'),
                DB::raw('MAX(CASE WHEN qsl.scan_type = \'OUT\' THEN qsl.created_at END) as last_scan_out'),
                // PostgreSQL-compatible duration calculation
                DB::raw('
                    CASE
                        WHEN MAX(CASE WHEN qsl.scan_type = \'OUT\' THEN qsl.created_at END) IS NOT NULL
                        THEN ROUND(
                            EXTRACT(EPOCH FROM (
                                MAX(CASE WHEN qsl.scan_type = \'OUT\' THEN qsl.created_at END) -
                                MIN(CASE WHEN qsl.scan_type = \'IN\' THEN qsl.created_at END)
                            )) / 3600.0, 2
                        )
                        ELSE ROUND(
                            EXTRACT(EPOCH FROM (
                                NOW() - MIN(CASE WHEN qsl.scan_type = \'IN\' THEN qsl.created_at END)
                            )) / 3600.0, 2
                        )
                    END as shift_duration_hours
                ')
            ])
            ->where('d.provider_id', $providerId)
            ->whereBetween(DB::raw('DATE(qsl.created_at)'), [$start->toDateString(), $end->toDateString()])
            ->groupBy('d.id', 'd.name', DB::raw('DATE(qsl.created_at)'))
            ->orderBy('d.id')
            ->orderBy('shift_date');

        if ($driverId) {
            $query->where('d.id', $driverId);
        }

        $shifts = $query->get();

        if ($rangeType === 'daily') {
            return response()->json([
                'success' => true,
                'data' => [
                    'range_type' => 'daily',
                    'start_date' => $start->toDateString(),
                    'end_date' => $end->toDateString(),
                    'provider_id' => $providerId,
                    'provider_name' => $provider->name,
                    'shifts' => $shifts
                ]
            ]);
        }

        // For weekly/monthly, aggregate the data
        $aggregated = $shifts->groupBy('driver_id')->map(function ($driverShifts) use ($rangeType, $start) {
            $driver = $driverShifts->first();
            $totalHours = $driverShifts->sum('shift_duration_hours');
            $daysWorked = $driverShifts->where('shift_duration_hours', '>', 0)->count();
            $avgShift = $daysWorked > 0 ? round($totalHours / $daysWorked, 2) : 0;

            return [
                'driver_id' => $driver->driver_id,
                'driver_name' => $driver->name,
                'period_start' => $start->toDateString(),
                'days_worked' => $daysWorked,
                'total_hours' => $totalHours,
                'avg_shift_hours' => $avgShift,
                'daily_shifts' => $driverShifts
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'range_type' => $rangeType,
                'start_date' => $start->toDateString(),
                'end_date' => $end->toDateString(),
                'provider_id' => $providerId,
                'provider_name' => $provider->name,
                'aggregated_data' => $aggregated->values()
            ]
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }

    /**
     * Record a QR scan (check in or check out) - Updated for consistent pattern
     */
    public function recordScan(Request $request, LogisticProvider $provider)
    {
        // Add CORS headers
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');

        if ($request->getMethod() === 'OPTIONS') {
            return response('', 200);
        }

        $request->validate([
            'driver_id' => 'required|integer|exists:drivers,id',
            'scan_type' => 'required|in:IN,OUT',
        ]);

        // Verify the driver belongs to this provider
        $driver = Driver::where('id', $request->driver_id)
                       ->where('provider_id', $provider->id)
                       ->first();

        if (!$driver) {
            return response()->json([
                'success' => false,
                'message' => 'Driver not found for this provider'
            ], 404);
        }

        $scan = QrScanLog::create([
            'driver_id' => $request->driver_id,
            'scan_type' => $request->scan_type,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Scan recorded successfully',
            'data' => $scan,
            'provider_id' => $provider->id,
            'driver_name' => $driver->name
        ])->header('Access-Control-Allow-Origin', '*')
          ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
