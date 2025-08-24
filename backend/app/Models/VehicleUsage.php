<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleUsage extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'usage_date',
        'distance_km',
        'hours_in_use',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }
}