<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LogisticProvider;
use App\Models\Driver;

class LogisticController extends Controller
{
    public function assigned_drivers($id)
    {
        $drivers = Driver::where('provider_id', $id)->count();
        return response()->json($drivers);
    }
}
